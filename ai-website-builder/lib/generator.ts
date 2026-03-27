import type { ProjectData, PageData } from './types'
import { slugify } from './utils'

const BRAND_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  modern: { primary: '#1e40af', secondary: '#1e293b', accent: '#3b82f6' },
  luxury: { primary: '#78350f', secondary: '#1c1917', accent: '#d97706' },
  minimal: { primary: '#374151', secondary: '#111827', accent: '#6b7280' },
  bold: { primary: '#dc2626', secondary: '#1f2937', accent: '#f97316' },
  friendly: { primary: '#059669', secondary: '#064e3b', accent: '#10b981' },
  corporate: { primary: '#1e3a5f', secondary: '#0f172a', accent: '#3b82f6' },
  creative: { primary: '#7c3aed', secondary: '#1e1b4b', accent: '#a855f7' },
}

function getColors(brandStyle: string) {
  return BRAND_COLORS[brandStyle] || BRAND_COLORS.modern
}

function buildBaseCSS(colors: { primary: string; secondary: string; accent: string }): string {
  return `
:root {
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1f2937; line-height: 1.6; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
nav { background: var(--secondary); color: #fff; padding: 1rem 0; position: sticky; top: 0; z-index: 100; }
nav .container { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.nav-brand { font-size: 1.25rem; font-weight: 700; color: #fff; white-space: nowrap; }
.nav-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.nav-links a { color: #d1d5db; font-size: 0.9rem; transition: color 0.2s; }
.nav-links a:hover { color: #fff; text-decoration: none; }
.hero { background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%); color: #fff; padding: 5rem 0; text-align: center; }
.hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 1rem; }
.hero p { font-size: 1.25rem; max-width: 600px; margin: 0 auto 2rem; opacity: 0.9; }
.btn { display: inline-block; padding: 0.875rem 2rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 1rem; }
.btn-primary { background: var(--accent); color: #fff; border: none; }
.btn-primary:hover { opacity: 0.9; text-decoration: none; transform: translateY(-1px); }
.btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.7); margin-left: 1rem; }
.btn-outline:hover { background: rgba(255,255,255,0.1); text-decoration: none; }
.section { padding: 4rem 0; }
.section-title { font-size: 2rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; }
.section-subtitle { color: #6b7280; margin-bottom: 3rem; font-size: 1.1rem; }
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
.card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 20px 30px rgba(0,0,0,0.08); }
.card h3 { font-size: 1.2rem; font-weight: 600; color: var(--secondary); margin-bottom: 0.75rem; }
.card-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.bg-light { background: #f9fafb; }
.bg-dark { background: var(--secondary); color: #fff; }
.bg-dark .section-title { color: #fff; }
.bg-dark .section-subtitle { color: #d1d5db; }
.text-center { text-align: center; }
.cta-section { background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: #fff; padding: 4rem 0; text-align: center; }
.cta-section h2 { font-size: 2rem; margin-bottom: 1rem; }
.cta-section p { margin-bottom: 2rem; opacity: 0.9; font-size: 1.1rem; }
footer { background: #111827; color: #9ca3af; padding: 3rem 0 1.5rem; }
.footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem; }
.footer-col h4 { color: #fff; font-weight: 600; margin-bottom: 1rem; }
.footer-col a { display: block; color: #9ca3af; margin-bottom: 0.5rem; font-size: 0.9rem; }
.footer-col a:hover { color: #fff; }
.footer-bottom { border-top: 1px solid #374151; padding-top: 1.5rem; text-align: center; font-size: 0.85rem; }
.page-hero { background: var(--secondary); color: #fff; padding: 3rem 0; }
.page-hero h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; }
.page-hero p { opacity: 0.8; margin-top: 0.5rem; }
.breadcrumb { font-size: 0.85rem; color: #9ca3af; margin-bottom: 0.5rem; }
.breadcrumb a { color: #9ca3af; }
.content-section { padding: 4rem 0; }
.content-section img { max-width: 100%; border-radius: 12px; }
.contact-form { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #374151; }
.form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; outline: none; transition: border-color 0.2s; }
.form-group input:focus, .form-group textarea:focus { border-color: var(--primary); }
.form-group textarea { min-height: 120px; resize: vertical; }
.locations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem; }
.location-card { background: #fff; border-radius: 8px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid var(--primary); }
.usp-list { list-style: none; margin-top: 1.5rem; }
.usp-list li { padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb; display: flex; align-items: flex-start; gap: 0.75rem; }
.usp-list li::before { content: "✓"; color: var(--accent); font-weight: 700; flex-shrink: 0; }
.review-widget { text-align: center; margin: 2rem 0; }
.stars { color: #f59e0b; font-size: 1.5rem; letter-spacing: 2px; }
.social-links { display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
.social-link { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 6px; background: rgba(255,255,255,0.1); color: #fff; font-size: 0.9rem; }
.chat-widget { position: fixed; bottom: 2rem; right: 2rem; z-index: 1000; }
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hero { padding: 3rem 0; }
  .btn-outline { display: none; }
}
`
}

function buildNav(project: ProjectData): string {
  const sitemap = project.sitemapData
  const navItems = sitemap?.navigation || []
  const logoHtml = project.logoUrl
    ? `<img src="${project.logoUrl}" alt="${project.businessName}" style="height:40px;object-fit:contain;" />`
    : `<span class="nav-brand">${project.businessName}</span>`

  const links = navItems
    .map((item) => {
      if (item.children && item.children.length > 0) {
        return `<a href="${item.href}">${item.label} ▾</a>`
      }
      return `<a href="${item.href}">${item.label}</a>`
    })
    .join('\n')

  return `
<nav>
  <div class="container">
    <a href="/" style="text-decoration:none;">${logoHtml}</a>
    <div class="nav-links">
      ${links}
      ${project.bookingLink ? `<a href="${project.bookingLink}" target="_blank" style="background:var(--accent);color:#fff;padding:0.4rem 1rem;border-radius:6px;">Book Now</a>` : ''}
    </div>
  </div>
</nav>`
}

function buildFooter(project: ProjectData): string {
  const social = project.socialLinks || {}
  const socialHtml = Object.entries(social)
    .filter(([, url]) => url)
    .map(([platform, url]) => `<a href="${url}" class="social-link" target="_blank">${platform}</a>`)
    .join('')

  const services = (project.services || []).slice(0, 5)
  const locations = (project.serviceAreas || []).slice(0, 5)

  return `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <h4>${project.businessName}</h4>
        <p style="font-size:0.9rem;margin-bottom:1rem;">${project.businessDescription?.slice(0, 120) || ''}</p>
        <p style="font-size:0.9rem;">${project.phone || ''}</p>
        <p style="font-size:0.9rem;">${project.email || ''}</p>
        <p style="font-size:0.9rem;">${project.address || ''}</p>
        ${socialHtml ? `<div class="social-links">${socialHtml}</div>` : ''}
      </div>
      ${services.length > 0 ? `
      <div class="footer-col">
        <h4>Services</h4>
        ${services.map((s) => `<a href="/services/${slugify(s)}">${s}</a>`).join('')}
      </div>` : ''}
      ${locations.length > 0 ? `
      <div class="footer-col">
        <h4>Service Areas</h4>
        ${locations.map((l) => `<a href="/locations/${slugify(l)}">${l}</a>`).join('')}
      </div>` : ''}
      <div class="footer-col">
        <h4>Quick Links</h4>
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        ${project.reviewLink ? `<a href="${project.reviewLink}" target="_blank">Leave a Review</a>` : ''}
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} ${project.businessName}. All rights reserved.</p>
    </div>
  </div>
</footer>
${project.chatWidgetScript ? `<div class="chat-widget">${project.chatWidgetScript}</div>` : ''}`
}

function wrapPage(project: ProjectData, title: string, body: string, colors: ReturnType<typeof getColors>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>${buildBaseCSS(colors)}</style>
</head>
<body>
${buildNav(project)}
${body}
${buildFooter(project)}
</body>
</html>`
}

export function generateHomePage(project: ProjectData): string {
  const colors = getColors(project.brandStyle)
  const services = project.services || []
  const usps = project.uniqueSellingPoints || []

  const serviceCards = services.slice(0, 6).map((s) => `
    <div class="card">
      <div class="card-icon">🔧</div>
      <h3>${s}</h3>
      <p style="color:#6b7280;margin-bottom:1rem;">Professional ${s.toLowerCase()} services. Quality workmanship with lasting results.</p>
      <a href="/services/${slugify(s)}" class="btn btn-primary" style="font-size:0.85rem;padding:0.5rem 1.25rem;">Learn More</a>
    </div>`).join('')

  const uspItems = usps.map((u) => `<li>${u}</li>`).join('')

  const reviewWidget = project.reviewLink
    ? `<div class="review-widget">
        <div class="stars">★★★★★</div>
        <p style="color:#6b7280;margin:0.5rem 0;">Rated 5 stars by our customers</p>
        <a href="${project.reviewLink}" target="_blank" class="btn btn-primary" style="margin-top:0.5rem;">See Our Reviews</a>
       </div>`
    : ''

  const ctaLink = project.contactFormLink || project.bookingLink || '/contact'

  const body = `
<section class="hero">
  <div class="container">
    <h1>${project.businessName}</h1>
    <p>${project.businessDescription || `Professional ${services[0] || 'services'} you can trust. Serving ${(project.serviceAreas || []).slice(0, 3).join(', ')}.`}</p>
    <a href="${ctaLink}" class="btn btn-primary">Get a Free Quote</a>
    ${project.bookingLink ? `<a href="${project.bookingLink}" target="_blank" class="btn btn-outline">Book Online</a>` : ''}
  </div>
</section>

${services.length > 0 ? `
<section class="section">
  <div class="container">
    <div class="text-center" style="margin-bottom:3rem;">
      <h2 class="section-title">Our Services</h2>
      <p class="section-subtitle">Professional solutions tailored to your needs</p>
    </div>
    <div class="grid-3">${serviceCards}</div>
    <div class="text-center" style="margin-top:2rem;">
      <a href="/services" class="btn btn-primary">View All Services</a>
    </div>
  </div>
</section>` : ''}

${usps.length > 0 ? `
<section class="section bg-light">
  <div class="container">
    <div class="grid-2" style="align-items:center;gap:4rem;">
      <div>
        <h2 class="section-title">Why Choose ${project.businessName}?</h2>
        <p style="color:#6b7280;margin-bottom:1.5rem;">${project.yearsInBusiness ? `With ${project.yearsInBusiness} years of experience, ` : ''}we deliver exceptional results every time.</p>
        <ul class="usp-list">${uspItems}</ul>
      </div>
      <div>
        ${reviewWidget}
        <div class="card" style="margin-top:1.5rem;">
          <h3>Ready to get started?</h3>
          <p style="color:#6b7280;margin:0.75rem 0;">Contact us today for a free estimate on your project.</p>
          <a href="/contact" class="btn btn-primary" style="margin-top:0.5rem;">Contact Us</a>
        </div>
      </div>
    </div>
  </div>
</section>` : ''}

<section class="cta-section">
  <div class="container">
    <h2>Ready to Get Started?</h2>
    <p>Contact us today and let's discuss your project</p>
    ${project.phone ? `<p style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;">📞 ${project.phone}</p>` : ''}
    <a href="${ctaLink}" class="btn btn-primary">Get a Free Quote</a>
  </div>
</section>`

  return wrapPage(project, `${project.businessName} - Professional Services`, body, colors)
}

export function generateAboutPage(project: ProjectData): string {
  const colors = getColors(project.brandStyle)
  const usps = project.uniqueSellingPoints || []

  const body = `
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb"><a href="/">Home</a> / About Us</div>
    <h1>About ${project.businessName}</h1>
    <p>Your trusted local experts</p>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <div class="grid-2" style="gap:4rem;align-items:start;">
      <div>
        <h2 class="section-title">Our Story</h2>
        <p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem;">${project.businessDescription || `${project.businessName} has been providing exceptional services to our community. We pride ourselves on quality, integrity, and customer satisfaction.`}</p>
        ${project.yearsInBusiness ? `<p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem;">With over <strong>${project.yearsInBusiness} years of experience</strong>, our team has the knowledge and expertise to handle projects of any size.</p>` : ''}
        ${project.serviceAreas && project.serviceAreas.length > 0 ? `
        <p style="color:#4b5563;line-height:1.8;">We proudly serve: <strong>${project.serviceAreas.join(', ')}</strong>.</p>` : ''}
      </div>
      <div>
        ${usps.length > 0 ? `
        <div class="card">
          <h3>Why Our Clients Choose Us</h3>
          <ul class="usp-list" style="margin-top:1rem;">${usps.map((u) => `<li>${u}</li>`).join('')}</ul>
        </div>` : ''}
        ${project.yearsInBusiness ? `
        <div class="card" style="margin-top:1.5rem;text-align:center;">
          <div style="font-size:3rem;font-weight:800;color:var(--primary);">${project.yearsInBusiness}+</div>
          <p style="color:#6b7280;font-weight:600;">Years of Experience</p>
        </div>` : ''}
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <h2>Ready to Work with Us?</h2>
    <p>Contact us today for a free consultation</p>
    <a href="/contact" class="btn btn-primary">Get in Touch</a>
  </div>
</section>`

  return wrapPage(project, `About Us - ${project.businessName}`, body, colors)
}

export function generateServicePage(project: ProjectData, page: PageData): string {
  const colors = getColors(project.brandStyle)
  const desc = page.serviceDesc || `Professional ${page.service} services from ${project.businessName}. We deliver high-quality results with attention to detail.`
  const locations = project.serviceAreas || []

  const body = `
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb"><a href="/">Home</a> / <a href="/services">Services</a> / ${page.service}</div>
    <h1>${page.service}</h1>
    <p>Professional ${page.service} services you can trust</p>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <div class="grid-2" style="gap:4rem;align-items:start;">
      <div>
        <h2 class="section-title">${page.service} Services</h2>
        <p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem;">${desc}</p>
        <p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem;">At ${project.businessName}, we bring professionalism and expertise to every ${page.service.toLowerCase()} project. Our team is trained, licensed, and committed to your satisfaction.</p>
        ${(project.uniqueSellingPoints || []).length > 0 ? `
        <h3 style="font-size:1.25rem;font-weight:600;margin:1.5rem 0 1rem;">What Sets Us Apart</h3>
        <ul class="usp-list">${(project.uniqueSellingPoints || []).map((u) => `<li>${u}</li>`).join('')}</ul>` : ''}
      </div>
      <div>
        ${page.imageUrl || page.imageData ? `<img src="${page.imageUrl || page.imageData}" alt="${page.service}" style="width:100%;border-radius:12px;margin-bottom:1.5rem;" />` : ''}
        <div class="card">
          <h3>Get a Free Quote</h3>
          <p style="color:#6b7280;margin:0.75rem 0;">Ready to get started? Contact us today for a free, no-obligation estimate.</p>
          ${project.phone ? `<p style="font-weight:600;margin:0.5rem 0;">📞 <a href="tel:${project.phone}">${project.phone}</a></p>` : ''}
          <a href="${project.contactFormLink || '/contact'}" class="btn btn-primary" style="display:block;text-align:center;margin-top:1rem;">Request a Quote</a>
          ${project.bookingLink ? `<a href="${project.bookingLink}" target="_blank" class="btn btn-outline" style="display:block;text-align:center;margin-top:0.75rem;color:var(--primary);border-color:var(--primary);">Schedule Online</a>` : ''}
        </div>
      </div>
    </div>
  </div>
</section>

${locations.length > 0 ? `
<section class="section bg-light">
  <div class="container">
    <h2 class="section-title text-center">${page.service} Service Areas</h2>
    <p class="section-subtitle text-center">We provide ${page.service.toLowerCase()} services throughout the region</p>
    <div class="locations-grid">
      ${locations.map((l) => `<div class="location-card"><strong>${l}</strong><br><a href="/services/${slugify(page.service)}/${slugify(l)}" style="font-size:0.85rem;">View Details →</a></div>`).join('')}
    </div>
  </div>
</section>` : ''}

<section class="cta-section">
  <div class="container">
    <h2>Need ${page.service} Services?</h2>
    <p>Call us or request a free quote online</p>
    ${project.phone ? `<p style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;">📞 ${project.phone}</p>` : ''}
    <a href="${project.contactFormLink || '/contact'}" class="btn btn-primary">Get a Free Quote</a>
  </div>
</section>`

  return wrapPage(project, `${page.service} | ${project.businessName}`, body, colors)
}

export function generateLocationPage(project: ProjectData, page: PageData): string {
  const colors = getColors(project.brandStyle)
  const services = project.services || []

  const body = `
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb"><a href="/">Home</a> / <a href="/locations">Service Areas</a> / ${page.location}</div>
    <h1>${project.businessName} in ${page.location}</h1>
    <p>Professional services serving ${page.location} and surrounding areas</p>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <div class="grid-2" style="gap:4rem;align-items:start;">
      <div>
        <h2 class="section-title">Serving ${page.location}</h2>
        <p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem;">${project.businessName} is proud to serve ${page.location} and the surrounding community. Our local team understands the unique needs of residents and businesses in this area.</p>
        <p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem;">${project.businessDescription || ''}</p>
        ${services.length > 0 ? `
        <h3 style="font-size:1.25rem;font-weight:600;margin:1.5rem 0 1rem;">Services Available in ${page.location}</h3>
        <ul class="usp-list">${services.map((s) => `<li><a href="/services/${slugify(s)}/${slugify(page.location)}">${s}</a></li>`).join('')}</ul>` : ''}
      </div>
      <div class="card">
        <h3>Contact Us in ${page.location}</h3>
        ${project.phone ? `<p style="font-weight:600;margin:0.75rem 0;">📞 <a href="tel:${project.phone}">${project.phone}</a></p>` : ''}
        ${project.email ? `<p style="margin-bottom:0.75rem;">✉️ <a href="mailto:${project.email}">${project.email}</a></p>` : ''}
        ${project.address ? `<p style="color:#6b7280;margin-bottom:1rem;">📍 ${project.address}</p>` : ''}
        <a href="${project.contactFormLink || '/contact'}" class="btn btn-primary" style="display:block;text-align:center;margin-top:1rem;">Request a Quote</a>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <h2>Serving ${page.location}?</h2>
    <p>Get a free estimate from your local experts</p>
    <a href="${project.contactFormLink || '/contact'}" class="btn btn-primary">Get a Free Quote</a>
  </div>
</section>`

  return wrapPage(project, `${page.service || 'Services'} in ${page.location} | ${project.businessName}`, body, colors)
}

export function generateServiceLocationPage(project: ProjectData, page: PageData): string {
  const colors = getColors(project.brandStyle)
  const desc = page.serviceDesc || `Professional ${page.service} services in ${page.location}.`

  const body = `
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb"><a href="/">Home</a> / <a href="/services/${slugify(page.service)}">${page.service}</a> / ${page.location}</div>
    <h1>${page.service} in ${page.location}</h1>
    <p>Your local ${page.service.toLowerCase()} experts in ${page.location}</p>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <div class="grid-2" style="gap:4rem;align-items:start;">
      <div>
        <h2 class="section-title">${page.service} Services in ${page.location}</h2>
        <p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem;">${desc}</p>
        <p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem;">As ${page.location}'s trusted ${page.service.toLowerCase()} provider, ${project.businessName} delivers professional results backed by experience and a commitment to customer satisfaction.</p>
        ${(project.uniqueSellingPoints || []).length > 0 ? `
        <ul class="usp-list">${(project.uniqueSellingPoints || []).map((u) => `<li>${u}</li>`).join('')}</ul>` : ''}
      </div>
      <div>
        ${page.imageUrl || page.imageData ? `<img src="${page.imageUrl || page.imageData}" alt="${page.service}" style="width:100%;border-radius:12px;margin-bottom:1.5rem;" />` : ''}
        <div class="card">
          <h3>Get a Free Quote in ${page.location}</h3>
          ${project.phone ? `<p style="font-weight:600;margin:0.75rem 0;">📞 <a href="tel:${project.phone}">${project.phone}</a></p>` : ''}
          <a href="${project.contactFormLink || '/contact'}" class="btn btn-primary" style="display:block;text-align:center;margin-top:1rem;">Request a Quote</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <h2>Need ${page.service} in ${page.location}?</h2>
    <p>Call us now for a free estimate</p>
    ${project.phone ? `<p style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;">📞 ${project.phone}</p>` : ''}
    <a href="${project.contactFormLink || '/contact'}" class="btn btn-primary">Get a Free Quote</a>
  </div>
</section>`

  return wrapPage(project, `${page.service} in ${page.location} | ${project.businessName}`, body, colors)
}

export function generateContactPage(project: ProjectData): string {
  const colors = getColors(project.brandStyle)
  const social = project.socialLinks || {}

  const formHtml = project.useInternalForm
    ? `
    <form class="contact-form" onsubmit="handleSubmit(event)">
      <div class="form-group"><label>Full Name *</label><input type="text" required placeholder="John Smith" /></div>
      <div class="form-group"><label>Phone Number</label><input type="tel" placeholder="(555) 000-0000" /></div>
      <div class="form-group"><label>Email Address</label><input type="email" placeholder="john@example.com" /></div>
      <div class="form-group"><label>Service Needed</label>
        <select>
          <option value="">Select a service...</option>
          ${(project.services || []).map((s) => `<option>${s}</option>`).join('')}
          <option>Other</option>
        </select>
      </div>
      <div class="form-group"><label>Message</label><textarea placeholder="Tell us about your project..."></textarea></div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Send Message</button>
    </form>
    <script>function handleSubmit(e){e.preventDefault();alert('Thank you! We will be in touch shortly.');e.target.reset();}</script>`
    : project.contactFormLink
    ? `<div style="text-align:center;padding:2rem;"><p style="margin-bottom:1.5rem;color:#4b5563;">Click below to fill out our contact form</p><a href="${project.contactFormLink}" target="_blank" class="btn btn-primary" style="font-size:1.1rem;padding:1rem 2.5rem;">Open Contact Form</a></div>`
    : `<div class="contact-form"><p style="text-align:center;color:#6b7280;">Contact us directly using the information provided.</p></div>`

  const body = `
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb"><a href="/">Home</a> / Contact</div>
    <h1>Contact Us</h1>
    <p>Get in touch for a free quote or any questions</p>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <div class="grid-2" style="gap:4rem;">
      <div>
        <h2 class="section-title">Get in Touch</h2>
        ${formHtml}
      </div>
      <div>
        <div class="card">
          <h3>Contact Information</h3>
          ${project.phone ? `<p style="margin:1rem 0;"><strong>📞 Phone</strong><br><a href="tel:${project.phone}">${project.phone}</a></p>` : ''}
          ${project.email ? `<p style="margin:1rem 0;"><strong>✉️ Email</strong><br><a href="mailto:${project.email}">${project.email}</a></p>` : ''}
          ${project.address ? `<p style="margin:1rem 0;"><strong>📍 Address</strong><br>${project.address}</p>` : ''}
          ${project.bookingLink ? `<p style="margin:1.5rem 0 0;"><a href="${project.bookingLink}" target="_blank" class="btn btn-primary" style="display:block;text-align:center;">Book an Appointment</a></p>` : ''}
          ${project.reviewLink ? `<p style="margin:1rem 0;"><a href="${project.reviewLink}" target="_blank" class="btn btn-outline" style="display:block;text-align:center;color:var(--primary);border:2px solid var(--primary);">Leave a Review ⭐</a></p>` : ''}
        </div>
        ${Object.values(social).some(Boolean) ? `
        <div class="card" style="margin-top:1.5rem;">
          <h3>Follow Us</h3>
          <div class="social-links" style="margin-top:1rem;">
            ${Object.entries(social).filter(([,url]) => url).map(([platform, url]) => `<a href="${url}" target="_blank" style="color:var(--primary);border:1px solid var(--primary);padding:0.4rem 1rem;border-radius:6px;">${platform}</a>`).join('')}
          </div>
        </div>` : ''}
        <div class="card" style="margin-top:1.5rem;">
          <h3>Service Areas</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem;">
            ${(project.serviceAreas || []).map((l) => `<span style="background:#f3f4f6;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.85rem;">${l}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`

  return wrapPage(project, `Contact Us | ${project.businessName}`, body, colors)
}

export function generateSitemap(project: ProjectData, pages: PageData[]): string {
  const baseUrl = `https://${slugify(project.businessName)}.com`
  const urls = pages.map((p) => `
  <url>
    <loc>${baseUrl}${p.slug === '/' ? '' : p.slug}</loc>
    <changefreq>${p.pageType === 'home' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p.pageType === 'home' ? '1.0' : p.pageType === 'service' ? '0.8' : '0.6'}</priority>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export function generateAllPages(project: ProjectData, pages: PageData[]): Map<string, string> {
  const files = new Map<string, string>()

  for (const page of pages) {
    let html = ''
    let filename = ''

    switch (page.pageType) {
      case 'home':
        html = generateHomePage(project)
        filename = 'index.html'
        break
      case 'about':
        html = generateAboutPage(project)
        filename = 'about/index.html'
        break
      case 'contact':
        html = generateContactPage(project)
        filename = 'contact/index.html'
        break
      case 'service':
        html = generateServicePage(project, page)
        filename = `services/${slugify(page.service)}/index.html`
        break
      case 'location':
        html = generateLocationPage(project, page)
        filename = `locations/${slugify(page.location)}/index.html`
        break
      case 'service-location':
        html = generateServiceLocationPage(project, page)
        filename = `services/${slugify(page.service)}/${slugify(page.location)}/index.html`
        break
    }

    if (html && filename) {
      files.set(filename, html)
    }
  }

  files.set('sitemap.xml', generateSitemap(project, pages))

  return files
}
