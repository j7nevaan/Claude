'use client'

import type { ProjectData, PageData } from '@/lib/types'

interface Props {
  data: ProjectData
  pages: PageData[]
  onApprove: () => void
  approving: boolean
}

function InfoRow({ label, value }: { label: string; value: string | string[] | boolean | undefined }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 w-40 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">
        {Array.isArray(value) ? value.join(', ') : value === true ? '✅ Yes' : String(value)}
      </span>
    </div>
  )
}

export default function Step7Approval({ data, pages, onApprove, approving }: Props) {
  const servicePages = pages.filter((p) => p.pageType === 'service')
  const locationPages = pages.filter((p) => p.pageType === 'location')
  const comboPages = pages.filter((p) => p.pageType === 'service-location')
  const corePages = pages.filter((p) => ['home', 'about', 'contact'].includes(p.pageType))

  const hasEnoughData = data.businessName && data.services.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Approve</h2>
        <p className="text-gray-500 mt-1">Review all your information before we generate your website</p>
      </div>

      {/* Business Info Summary */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">🏢 Business Info</h3>
        </div>
        <div className="px-4 py-2">
          <InfoRow label="Business Name" value={data.businessName} />
          <InfoRow label="Industry" value={data.industry} />
          <InfoRow label="Years in Business" value={data.yearsInBusiness} />
          <InfoRow label="Services" value={data.services} />
          <InfoRow label="Service Areas" value={data.serviceAreas} />
          <InfoRow label="Brand Style" value={data.brandStyle} />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">📞 Contact Info</h3>
        </div>
        <div className="px-4 py-2">
          <InfoRow label="Phone" value={data.phone} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Address" value={data.address} />
        </div>
      </div>

      {/* Pages Summary */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">📄 Pages to be Created ({pages.length} total)</h3>
        </div>
        <div className="px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-bold text-blue-700 text-xl">{corePages.length}</div>
              <div className="text-xs text-blue-600">Core Pages</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-bold text-green-700 text-xl">{servicePages.length}</div>
              <div className="text-xs text-green-600">Service Pages</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-bold text-purple-700 text-xl">{locationPages.length}</div>
              <div className="text-xs text-purple-600">Location Pages</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-bold text-orange-700 text-xl">{comboPages.length}</div>
              <div className="text-xs text-orange-600">SEO Combos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">🔌 Integrations</h3>
        </div>
        <div className="px-4 py-2">
          <InfoRow label="Contact Form" value={data.useInternalForm ? 'Built-in form' : data.contactFormLink} />
          <InfoRow label="Review Link" value={data.reviewLink} />
          <InfoRow label="Booking Link" value={data.bookingLink} />
          <InfoRow label="Chat Widget" value={data.chatWidgetScript ? 'Included' : undefined} />
          <InfoRow label="Social Links" value={Object.values(data.socialLinks || {}).filter(Boolean).length > 0 ? `${Object.values(data.socialLinks || {}).filter(Boolean).length} platforms` : undefined} />
        </div>
      </div>

      {!hasEnoughData && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 font-medium">⚠️ Missing Required Information</p>
          <p className="text-sm text-yellow-600 mt-1">
            Please go back and add at minimum: Business Name and at least one Service.
          </p>
        </div>
      )}

      {/* Approve Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onApprove}
          disabled={!hasEnoughData || approving}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition
            ${hasEnoughData && !approving
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {approving ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Your Website...
            </span>
          ) : '🚀 Approve & Generate Website'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          This will generate all {pages.length} pages of your website
        </p>
      </div>
    </div>
  )
}
