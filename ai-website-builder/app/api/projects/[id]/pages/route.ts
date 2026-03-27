import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { serializePage } from '@/lib/utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const pages = await prisma.page.findMany({ where: { projectId: id } })
  return Response.json(pages.map(serializePage))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  // body: { pageId, ...updates }
  const { pageId, ...updates } = body

  const page = await prisma.page.update({
    where: { id: pageId, projectId: id },
    data: updates,
  })
  return Response.json(serializePage(page))
}
