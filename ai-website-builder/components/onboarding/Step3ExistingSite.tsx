'use client'

import { useState } from 'react'
import { InputField } from '@/components/ui/FormField'
import TagInput from '@/components/ui/TagInput'
import type { ProjectData } from '@/lib/types'

interface Props {
  data: ProjectData
  onChange: (data: Partial<ProjectData>) => void
}

export default function Step3ExistingSite({ data, onChange }: Props) {
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState('')
  const [scrapeSuccess, setScrapeSuccess] = useState(false)

  const handleScrape = async () => {
    if (!data.existingWebsiteUrl) return
    setScraping(true)
    setScrapeError('')
    setScrapeSuccess(false)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.existingWebsiteUrl }),
      })
      const result = await res.json()

      if (!res.ok) {
        setScrapeError(result.error || 'Failed to scrape site')
        return
      }

      const scraped = result.data
      const updates: Partial<ProjectData> = {
        scrapedData: scraped,
      }

      // Pre-fill fields if empty
      if (!data.businessDescription && scraped.description) {
        updates.businessDescription = scraped.description
      }
      if (!data.phone && scraped.phone) updates.phone = scraped.phone
      if (!data.email && scraped.email) updates.email = scraped.email
      if (!data.address && scraped.address) updates.address = scraped.address
      if (scraped.services?.length && data.services.length === 0) {
        updates.services = scraped.services
      }

      onChange(updates)
      setScrapeSuccess(true)
    } catch {
      setScrapeError('Network error. Please try again.')
    } finally {
      setScraping(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Existing Website</h2>
        <p className="text-gray-500 mt-1">Do you have a current website we can pull data from?</p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onChange({ hasExistingWebsite: true })}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition ${
            data.hasExistingWebsite
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          ✅ Yes, I have a website
        </button>
        <button
          type="button"
          onClick={() => onChange({ hasExistingWebsite: false, existingWebsiteUrl: '' })}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition ${
            !data.hasExistingWebsite
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          🚀 No, starting fresh
        </button>
      </div>

      {data.hasExistingWebsite && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1">
              <InputField
                label="Website URL"
                value={data.existingWebsiteUrl}
                onChange={(v) => onChange({ existingWebsiteUrl: v })}
                placeholder="https://yourwebsite.com"
                type="url"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleScrape}
                disabled={!data.existingWebsiteUrl || scraping}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-blue-700 transition whitespace-nowrap"
              >
                {scraping ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Scraping...
                  </span>
                ) : '🔍 Scrape Site'}
              </button>
            </div>
          </div>

          {scrapeError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ⚠️ {scrapeError}
            </div>
          )}

          {scrapeSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              ✅ Site scraped successfully! Data has been pre-filled below. Edit as needed.
            </div>
          )}

          {data.scrapedData && Object.keys(data.scrapedData).length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-gray-800">📋 Scraped Data (edit before saving)</h3>

              {data.scrapedData.services && data.scrapedData.services.length > 0 && (
                <TagInput
                  label="Services Found"
                  values={data.services}
                  onChange={(v) => onChange({ services: v })}
                  placeholder="Add more services..."
                />
              )}

              {(data.scrapedData.phone || data.scrapedData.email || data.scrapedData.address) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.scrapedData.phone && (
                    <InputField
                      label="Phone (scraped)"
                      value={data.phone}
                      onChange={(v) => onChange({ phone: v })}
                      type="tel"
                    />
                  )}
                  {data.scrapedData.email && (
                    <InputField
                      label="Email (scraped)"
                      value={data.email}
                      onChange={(v) => onChange({ email: v })}
                      type="email"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!data.hasExistingWebsite && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700">
            🎉 No problem! We'll build your website from scratch using the information you've provided.
          </p>
        </div>
      )}
    </div>
  )
}
