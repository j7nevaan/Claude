export interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
}

export interface ScrapedData {
  services?: string[]
  about?: string
  phone?: string
  email?: string
  address?: string
}

export interface ProjectData {
  id: string
  status: string
  currentStep: number

  // Business Info
  businessName: string
  industry: string
  services: string[]
  serviceAreas: string[]
  businessDescription: string
  uniqueSellingPoints: string[]
  yearsInBusiness: string

  // Contact
  phone: string
  email: string
  address: string

  // Branding
  logoUrl: string
  brandStyle: string

  // Existing Website
  hasExistingWebsite: boolean
  existingWebsiteUrl: string
  scrapedData: ScrapedData

  // Integrations
  contactFormLink: string
  useInternalForm: boolean
  reviewLink: string
  chatWidgetScript: string
  bookingLink: string
  socialLinks: SocialLinks

  sitemapData: SitemapData

  pages: PageData[]
}

export interface PageData {
  id: string
  projectId: string
  slug: string
  title: string
  pageType: string
  service: string
  location: string
  content: string
  metaTitle: string
  metaDesc: string
  imageUrl: string
  imageData: string
  serviceDesc: string
  approved: boolean
}

export interface SitemapData {
  pages: SitemapPage[]
  navigation: NavItem[]
}

export interface SitemapPage {
  slug: string
  title: string
  type: string
  children?: SitemapPage[]
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export const INDUSTRIES = [
  'Painting & Pressure Washing',
  'Plumbing',
  'HVAC',
  'Electrical',
  'Landscaping & Lawn Care',
  'Roofing',
  'General Contractor',
  'Cleaning Services',
  'Pest Control',
  'Tree Service',
  'Flooring',
  'Remodeling & Renovation',
  'Concrete & Masonry',
  'Fencing',
  'Pool & Spa',
  'Moving Services',
  'Garage Door',
  'Locksmith',
  'Appliance Repair',
  'Auto Detailing',
  'Trucking & Logistics',
  'Real Estate',
  'Legal Services',
  'Medical / Dental',
  'Restaurant / Food Service',
  'Retail',
  'E-commerce',
  'Other',
]

export const BRAND_STYLES = [
  { value: 'modern', label: 'Modern & Professional' },
  { value: 'luxury', label: 'Luxury & Premium' },
  { value: 'minimal', label: 'Minimal & Clean' },
  { value: 'bold', label: 'Bold & Energetic' },
  { value: 'friendly', label: 'Friendly & Approachable' },
  { value: 'corporate', label: 'Corporate & Formal' },
  { value: 'creative', label: 'Creative & Playful' },
]

export const STEPS = [
  { number: 1, label: 'Business Info' },
  { number: 2, label: 'Contact & Brand' },
  { number: 3, label: 'Existing Site' },
  { number: 4, label: 'Integrations' },
  { number: 5, label: 'Pages & Structure' },
  { number: 6, label: 'Preview' },
  { number: 7, label: 'Approve & Generate' },
]
