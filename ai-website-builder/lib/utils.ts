import type { Project, Page } from '@prisma/client'
import type { ProjectData, PageData, SitemapData, NavItem, SitemapPage } from './types'

export function serializeProject(project: Project & { pages?: Page[] }): ProjectData {
  return {
    id: project.id,
    status: project.status,
    currentStep: project.currentStep,
    businessName: project.businessName,
    industry: project.industry,
    services: JSON.parse(project.services),
    serviceAreas: JSON.parse(project.serviceAreas),
    businessDescription: project.businessDescription,
    uniqueSellingPoints: JSON.parse(project.uniqueSellingPoints),
    yearsInBusiness: project.yearsInBusiness,
    phone: project.phone,
    email: project.email,
    address: project.address,
    logoUrl: project.logoUrl,
    brandStyle: project.brandStyle,
    hasExistingWebsite: project.hasExistingWebsite,
    existingWebsiteUrl: project.existingWebsiteUrl,
    scrapedData: JSON.parse(project.scrapedData),
    contactFormLink: project.contactFormLink,
    useInternalForm: project.useInternalForm,
    reviewLink: project.reviewLink,
    chatWidgetScript: project.chatWidgetScript,
    bookingLink: project.bookingLink,
    socialLinks: JSON.parse(project.socialLinks),
    sitemapData: JSON.parse(project.sitemapData),
    pages: (project.pages || []).map(serializePage),
  }
}

export function serializePage(page: Page): PageData {
  return {
    id: page.id,
    projectId: page.projectId,
    slug: page.slug,
    title: page.title,
    pageType: page.pageType,
    service: page.service,
    location: page.location,
    content: page.content,
    metaTitle: page.metaTitle,
    metaDesc: page.metaDesc,
    imageUrl: page.imageUrl,
    imageData: page.imageData,
    serviceDesc: page.serviceDesc,
    approved: page.approved,
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generatePageStructure(
  services: string[],
  locations: string[]
): { pages: SitemapPage[]; navigation: NavItem[] } {
  const pages: SitemapPage[] = [
    { slug: '/', title: 'Home', type: 'home' },
    { slug: '/about', title: 'About Us', type: 'about' },
  ]

  const servicePages: SitemapPage[] = services.map((s) => ({
    slug: `/services/${slugify(s)}`,
    title: s,
    type: 'service',
  }))

  if (servicePages.length > 0) {
    pages.push({
      slug: '/services',
      title: 'Services',
      type: 'services-index',
      children: servicePages,
    })
  }

  const locationPages: SitemapPage[] = locations.map((l) => ({
    slug: `/locations/${slugify(l)}`,
    title: l,
    type: 'location',
  }))

  if (locationPages.length > 0) {
    pages.push({
      slug: '/locations',
      title: 'Service Areas',
      type: 'locations-index',
      children: locationPages,
    })
  }

  // Service + Location combo pages
  const comboPages: SitemapPage[] = []
  for (const service of services) {
    for (const location of locations) {
      comboPages.push({
        slug: `/services/${slugify(service)}/${slugify(location)}`,
        title: `${service} in ${location}`,
        type: 'service-location',
      })
    }
  }

  if (comboPages.length > 0) {
    pages.push(...comboPages)
  }

  pages.push({ slug: '/contact', title: 'Contact', type: 'contact' })

  const navigation: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]

  if (servicePages.length > 0) {
    navigation.push({
      label: 'Services',
      href: '/services',
      children: servicePages.map((p) => ({ label: p.title, href: p.slug })),
    })
  }

  if (locationPages.length > 0) {
    navigation.push({
      label: 'Locations',
      href: '/locations',
      children: locationPages.map((p) => ({ label: p.title, href: p.slug })),
    })
  }

  navigation.push({ label: 'Contact', href: '/contact' })

  return { pages, navigation }
}
