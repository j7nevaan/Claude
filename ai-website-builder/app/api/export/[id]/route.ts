import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeProject } from '@/lib/utils'
import { generateAllPages } from '@/lib/generator'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: { pages: true },
  })

  if (!project || project.status !== 'complete') {
    return Response.json({ error: 'Not ready for export' }, { status: 400 })
  }

  const projectData = serializeProject(project)
  const files = generateAllPages(projectData, projectData.pages)

  // Build a simple ZIP-like bundle as JSON for download
  const bundle: Record<string, string> = {}
  for (const [path, content] of files.entries()) {
    bundle[path] = content
  }

  return Response.json({
    businessName: project.businessName,
    generatedAt: new Date().toISOString(),
    files: bundle,
  })
}
