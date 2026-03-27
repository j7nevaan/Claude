'use client'

import { useState, useEffect } from 'react'
import type { ProjectData, PageData } from '@/lib/types'
import { slugify } from '@/lib/utils'

interface Props {
  data: ProjectData
  pages: PageData[]
  onPagesChange: (pages: PageData[]) => void
  onGenerate: () => Promise<void>
  generating: boolean
}

const PAGE_TYPE_ICONS: Record<string, string> = {
  home: '🏠',
  about: '👥',
  service: '🔧',
  location: '📍',
  'service-location': '🎯',
  contact: '📬',
  'services-index': '📋',
  'locations-index': '🗺️',
}

export default function Step5PageStructure({ data, pages, onPagesChange, onGenerate, generating }: Props) {
  const [editingPage, setEditingPage] = useState<PageData | null>(null)
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({})

  const services = data.services || []
  const locations = data.serviceAreas || []

  const handleImageUpload = (pageId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImagePreview((prev) => ({ ...prev, [pageId]: dataUrl }))
      onPagesChange(
        pages.map((p) =>
          p.id === pageId ? { ...p, imageData: dataUrl } : p
        )
      )
    }
    reader.readAsDataURL(file)
  }

  const updatePageDesc = (pageId: string, desc: string) => {
    onPagesChange(pages.map((p) => p.id === pageId ? { ...p, serviceDesc: desc } : p))
  }

  const servicePages = pages.filter((p) => p.pageType === 'service')
  const locationPages = pages.filter((p) => p.pageType === 'location')
  const comboPages = pages.filter((p) => p.pageType === 'service-location')
  const corePages = pages.filter((p) => ['home', 'about', 'contact', 'services-index', 'locations-index'].includes(p.pageType))

  const totalCount = pages.length
  const comboCount = comboPages.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Page Structure Builder</h2>
        <p className="text-gray-500 mt-1">Review and customize the pages we'll build for you</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Pages', value: totalCount, color: 'blue' },
          { label: 'Service Pages', value: servicePages.length, color: 'green' },
          { label: 'Location Pages', value: locationPages.length, color: 'purple' },
          { label: 'SEO Combo Pages', value: comboCount, color: 'orange' },
        ].map((stat) => (
          <div key={stat.label} className={`p-3 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100`}>
            <div className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</div>
            <div className={`text-xs text-${stat.color}-600 font-medium`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {totalCount === 0 && (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
          <p className="text-yellow-700 font-medium mb-2">⚠️ No pages generated yet</p>
          <p className="text-sm text-yellow-600">
            Go back to Step 1 and add at least one service or location to generate pages.
          </p>
        </div>
      )}

      {/* Core Pages */}
      {corePages.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">📌 Core Pages</h3>
          <div className="space-y-2">
            {corePages.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <span className="text-lg">{PAGE_TYPE_ICONS[p.pageType] || '📄'}</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{p.title}</span>
                  <span className="ml-2 text-xs text-gray-400">{p.slug}</span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.pageType}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Pages with image/desc upload */}
      {servicePages.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">🔧 Service Pages</h3>
          <div className="space-y-3">
            {servicePages.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setEditingPage(editingPage?.id === p.id ? null : p)}
                >
                  <span className="text-lg">🔧</span>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{p.title}</span>
                    <span className="ml-2 text-xs text-gray-400">{p.slug}</span>
                  </div>
                  <span className="text-xs text-gray-400">{editingPage?.id === p.id ? '▲ Close' : '▼ Edit'}</span>
                </div>

                {editingPage?.id === p.id && (
                  <div className="p-4 border-t border-gray-100 space-y-4 bg-gray-50">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
                      <div className="flex items-center gap-3">
                        {(imagePreview[p.id] || p.imageData) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imagePreview[p.id] || p.imageData}
                            alt={p.title}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        <label className="cursor-pointer px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition">
                          📷 Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(p.id, e)}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Description (optional override)
                      </label>
                      <textarea
                        value={p.serviceDesc}
                        onChange={(e) => updatePageDesc(p.id, e.target.value)}
                        placeholder={`Describe your ${p.service} service in detail...`}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Pages */}
      {locationPages.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">📍 Location Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {locationPages.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <span>📍</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">{p.title}</span>
                  <div className="text-xs text-gray-400">{p.slug}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Combo Pages */}
      {comboPages.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">🎯 SEO Combination Pages ({comboPages.length})</h3>
          <p className="text-xs text-gray-500 mb-3">These pages are automatically generated for maximum local SEO coverage.</p>
          <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-200 rounded-xl p-3 bg-gray-50">
            {comboPages.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-sm py-1">
                <span>🎯</span>
                <span className="text-gray-700 font-medium">{p.title}</span>
                <span className="text-gray-400 text-xs ml-auto">{p.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <p className="text-sm text-gray-500 mb-3">
          ✅ Reviewed everything? Proceed to the site structure preview.
        </p>
      </div>
    </div>
  )
}
