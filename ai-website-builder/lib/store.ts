import type { ProjectData, PageData, SitemapData } from './types'
import { generatePageStructure, slugify } from './utils'

const KEY = 'aiwb_projects'

function load(): ProjectData[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(projects: ProjectData[]) {
  localStorage.setItem(KEY, JSON.stringify(projects))
}

export function getProjects(): ProjectData[] {
  return load()
}

export function getProject(id: string): ProjectData | null {
  return load().find(p => p.id === id) ?? null
}

export function createProject(businessName: string): ProjectData {
  const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const project: ProjectData = {
    id, status: 'draft', currentStep: 1,
    businessName, industry: '',
    services: [], serviceAreas: [],
    businessDescription: '', uniqueSellingPoints: [], yearsInBusiness: '',
    phone: '', email: '', address: '',
    logoUrl: '', brandStyle: 'modern',
    hasExistingWebsite: false, existingWebsiteUrl: '', scrapedData: {},
    contactFormLink: '', useInternalForm: false,
    reviewLink: '', chatWidgetScript: '', bookingLink: '',
    socialLinks: {},
    sitemapData: { pages: [], navigation: [] },
    pages: [],
  }
  const all = load()
  all.unshift(project)
  save(all)
  return project
}

export function updateProject(id: string, updates: Partial<ProjectData>): ProjectData {
  const all = load()
  const i = all.findIndex(p => p.id === id)
  if (i === -1) throw new Error('Project not found')
  all[i] = { ...all[i], ...updates }
  save(all)
  return all[i]
}

export function deleteProject(id: string) {
  save(load().filter(p => p.id !== id))
}

export function regeneratePages(id: string): ProjectData {
  const project = getProject(id)
  if (!project) throw new Error('Project not found')

  const { pages: sitemapPages, navigation } = generatePageStructure(
    project.services, project.serviceAreas
  )

  function flatten(pages: ReturnType<typeof generatePageStructure>['pages']): typeof pages {
    const out: typeof pages = []
    for (const p of pages) { out.push(p); if (p.children) out.push(...flatten(p.children)) }
    return out
  }

  const pageRecords: PageData[] = flatten(sitemapPages).map(p => {
    const parts = p.slug.split('/').filter(Boolean)
    let pageType = p.type, service = '', location = '', title = p.title

    if (p.type === 'service') {
      service = project.services.find(s => slugify(s) === parts[1]) || parts[1]
      title = service
    } else if (p.type === 'location') {
      location = project.serviceAreas.find(l => slugify(l) === parts[1]) || parts[1]
      title = location
    } else if (p.type === 'service-location') {
      service = project.services.find(s => slugify(s) === parts[1]) || parts[1]
      location = project.serviceAreas.find(l => slugify(l) === parts[2]) || parts[2]
      title = `${service} in ${location}`
      pageType = 'service-location'
    }

    return {
      id: `page_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      projectId: id, slug: p.slug, title, pageType, service, location,
      content: '', metaTitle: `${title} | ${project.businessName}`,
      metaDesc: `Professional ${service || title} services${location ? ` in ${location}` : ''}.`,
      imageUrl: '', imageData: '', serviceDesc: '', approved: false,
    }
  })

  return updateProject(id, {
    pages: pageRecords,
    sitemapData: { pages: sitemapPages, navigation } as SitemapData,
  })
}

export function updatePage(projectId: string, pageId: string, updates: Partial<PageData>): ProjectData {
  const project = getProject(projectId)
  if (!project) throw new Error('Project not found')
  const pages = project.pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
  return updateProject(projectId, { pages })
}
