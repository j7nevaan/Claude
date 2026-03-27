import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeProject } from '@/lib/utils'
import { generatePageStructure, slugify } from '@/lib/utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { pages: true },
  })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(serializeProject(project))
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  // Stringify array/object fields
  const data: Record<string, unknown> = {}
  const arrayFields = ['services', 'serviceAreas', 'uniqueSellingPoints']
  const objectFields = ['scrapedData', 'sitemapData', 'socialLinks']

  const skipKeys = new Set(['pages', 'id', 'createdAt', 'updatedAt', '_regeneratePages'])

  for (const [key, val] of Object.entries(body)) {
    if (skipKeys.has(key)) continue
    if (arrayFields.includes(key)) {
      data[key] = Array.isArray(val) ? JSON.stringify(val) : val
    } else if (objectFields.includes(key)) {
      data[key] = typeof val === 'object' ? JSON.stringify(val) : val
    } else {
      data[key] = val
    }
  }

  // If services or serviceAreas changed, regenerate page structure
  const shouldRegen =
    body.services !== undefined || body.serviceAreas !== undefined

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

  const project = await prisma.project.update({
    where: { id },
    data,
    include: { pages: true },
  })

  // If we should regenerate pages (step 5 action)
  if (body._regeneratePages) {
    const services: string[] = JSON.parse(project.services) || []
    const locations: string[] = JSON.parse(project.serviceAreas) || []
    const { pages: sitemapPages, navigation } = generatePageStructure(services, locations)

    // Flatten sitemap tree (including children) into flat list
    function flattenPages(pages: typeof sitemapPages): typeof sitemapPages {
      const result: typeof sitemapPages = []
      for (const p of pages) {
        result.push(p)
        if (p.children) result.push(...flattenPages(p.children))
      }
      return result
    }
    const allPages = flattenPages(sitemapPages)

    // Delete old pages and recreate
    await prisma.page.deleteMany({ where: { projectId: id } })

    const pageData = allPages.map((p) => {
      const parts = p.slug.split('/').filter(Boolean)
      let pageType = p.type
      let service = ''
      let location = ''
      let title = p.title

      if (p.type === 'service') {
        service = services.find((s) => slugify(s) === parts[1]) || parts[1]
        title = service
      } else if (p.type === 'location') {
        location = locations.find((l) => slugify(l) === parts[1]) || parts[1]
        title = location
      } else if (p.type === 'service-location') {
        service = services.find((s) => slugify(s) === parts[1]) || parts[1]
        location = locations.find((l) => slugify(l) === parts[2]) || parts[2]
        title = `${service} in ${location}`
        pageType = 'service-location'
      }

      return {
        projectId: id,
        slug: p.slug,
        title,
        pageType,
        service,
        location,
        metaTitle: `${title} | ${existing.businessName}`,
        metaDesc: `Professional ${service || title} services${location ? ` in ${location}` : ''}.`,
      }
    })

    await prisma.page.createMany({ data: pageData })

    await prisma.project.update({
      where: { id },
      data: { sitemapData: JSON.stringify({ pages: sitemapPages, navigation }) },
    })

    const updated = await prisma.project.findUnique({
      where: { id },
      include: { pages: true },
    })
    return Response.json(serializeProject(updated!))
  }

  return Response.json(serializeProject(project))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.project.delete({ where: { id } })
  return Response.json({ success: true })
}
