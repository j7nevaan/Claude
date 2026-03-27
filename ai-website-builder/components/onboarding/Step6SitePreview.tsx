'use client'

import type { ProjectData, PageData, NavItem, SitemapPage } from '@/lib/types'

interface Props {
  data: ProjectData
  pages: PageData[]
}

function NavTree({ items }: { items: NavItem[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100">
            <span className="text-gray-400">📄</span>
            <span className="text-sm text-gray-700 font-medium">{item.label}</span>
            <span className="text-xs text-gray-400">{item.href}</span>
          </div>
          {item.children && item.children.length > 0 && (
            <div className="ml-6 mt-1 border-l-2 border-gray-200 pl-3">
              <NavTree items={item.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

function SitemapTree({ pages }: { pages: SitemapPage[] }) {
  return (
    <ul className="space-y-1">
      {pages.map((p) => (
        <li key={p.slug}>
          <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100">
            <span className="text-gray-400 text-xs">
              {p.type === 'home' ? '🏠' : p.type === 'about' ? '👥' : p.type === 'service' ? '🔧' : p.type === 'location' ? '📍' : p.type === 'contact' ? '📬' : '🎯'}
            </span>
            <span className="text-sm text-gray-800">{p.title}</span>
            <span className="text-xs text-gray-400 ml-auto truncate max-w-[200px]">{p.slug}</span>
          </div>
          {p.children && p.children.length > 0 && (
            <div className="ml-6 mt-0.5 border-l-2 border-blue-100 pl-3">
              <SitemapTree pages={p.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function Step6SitePreview({ data, pages }: Props) {
  const sitemap = data.sitemapData
  const navItems = sitemap?.navigation || []
  const sitemapPages = sitemap?.pages || []

  const services = data.services || []
  const locations = data.serviceAreas || []

  const totalPages = pages.length
  const comboCount = pages.filter((p) => p.pageType === 'service-location').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Site Structure Preview</h2>
        <p className="text-gray-500 mt-1">Here's what your website will look like — {totalPages} pages total</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-blue-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-700">{totalPages}</div>
          <div className="text-xs text-blue-600">Total Pages</div>
        </div>
        <div className="p-3 bg-green-50 rounded-xl">
          <div className="text-2xl font-bold text-green-700">{services.length}</div>
          <div className="text-xs text-green-600">Services</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-xl">
          <div className="text-2xl font-bold text-purple-700">{locations.length}</div>
          <div className="text-xs text-purple-600">Locations</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-700">{comboCount}</div>
          <div className="text-xs text-orange-600">SEO Combos</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-800 text-white flex items-center gap-2">
          <span className="font-mono text-sm">{data.businessName || 'Your Business'}</span>
          <span className="ml-auto flex gap-3 text-xs text-gray-400">
            {navItems.map((n) => (
              <span key={n.href}>{n.label}</span>
            ))}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Navigation Menu</h3>
          {navItems.length > 0 ? <NavTree items={navItems} /> : <p className="text-sm text-gray-400">No navigation items yet</p>}
        </div>
      </div>

      {/* Sitemap */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Full Sitemap</h3>
        {sitemapPages.length > 0 ? (
          <SitemapTree pages={sitemapPages} />
        ) : (
          <p className="text-sm text-gray-400">No pages yet — add services and locations in Step 1</p>
        )}
      </div>

      {/* Integrations summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Integrations Included</h3>
        <div className="flex flex-wrap gap-2">
          {data.contactFormLink || data.useInternalForm ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">✅ Contact Form</span>
          ) : null}
          {data.reviewLink && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">⭐ Reviews Link</span>
          )}
          {data.bookingLink && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">📅 Booking Link</span>
          )}
          {data.chatWidgetScript && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">💬 Chat Widget</span>
          )}
          {Object.values(data.socialLinks || {}).some(Boolean) && (
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">🔗 Social Links</span>
          )}
          {data.logoUrl && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">🖼️ Logo</span>
          )}
        </div>
      </div>
    </div>
  )
}
