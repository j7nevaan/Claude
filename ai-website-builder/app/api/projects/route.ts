import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeProject } from '@/lib/utils'

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { pages: false },
  })
  return Response.json(projects.map((p) => serializeProject(p)))
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const project = await prisma.project.create({
    data: {
      businessName: body.businessName || 'My Business',
      status: 'draft',
      currentStep: 1,
    },
    include: { pages: true },
  })

  return Response.json(serializeProject(project), { status: 201 })
}
