import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeProject } from '@/lib/utils'
import { generateAllPages } from '@/lib/generator'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: { pages: true },
  })

  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }

  // Mark as generating
  await prisma.project.update({
    where: { id },
    data: { status: 'generating' },
  })

  try {
    const projectData = serializeProject(project)
    const files = generateAllPages(projectData, projectData.pages)

    // Store generated content in pages
    for (const page of project.pages) {
      let filename = ''
      if (page.pageType === 'home') filename = 'index.html'
      else if (page.pageType === 'about') filename = 'about/index.html'
      else if (page.pageType === 'contact') filename = 'contact/index.html'
      else if (page.pageType === 'service') filename = `services/${page.service.toLowerCase().replace(/\s+/g, '-')}/index.html`
      else if (page.pageType === 'location') filename = `locations/${page.location.toLowerCase().replace(/\s+/g, '-')}/index.html`
      else if (page.pageType === 'service-location') filename = `services/${page.service.toLowerCase().replace(/\s+/g, '-')}/${page.location.toLowerCase().replace(/\s+/g, '-')}/index.html`

      if (filename && files.has(filename)) {
        await prisma.page.update({
          where: { id: page.id },
          data: { content: files.get(filename)!, approved: true },
        })
      }
    }

    // Build ZIP-style manifest as JSON
    const manifest: Record<string, string> = {}
    for (const [path, content] of files.entries()) {
      manifest[path] = content
    }

    await prisma.project.update({
      where: { id },
      data: {
        status: 'complete',
        sitemapData: JSON.stringify({
          ...JSON.parse(project.sitemapData),
          generatedAt: new Date().toISOString(),
          fileCount: files.size,
        }),
      },
    })

    const updated = await prisma.project.findUnique({
      where: { id },
      include: { pages: true },
    })

    return Response.json({
      success: true,
      project: serializeProject(updated!),
      fileCount: files.size,
      files: Object.keys(manifest),
    })
  } catch (err) {
    await prisma.project.update({
      where: { id },
      data: { status: 'approved' },
    })
    const message = err instanceof Error ? err.message : 'Generation failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
