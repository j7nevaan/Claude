'use client'

import { InputField } from '@/components/ui/FormField'
import { SelectField } from '@/components/ui/FormField'
import { BRAND_STYLES } from '@/lib/types'
import type { ProjectData } from '@/lib/types'
import { useState } from 'react'

interface Props {
  data: ProjectData
  onChange: (data: Partial<ProjectData>) => void
}

export default function Step2Contact({ data, onChange }: Props) {
  const [logoPreview, setLogoPreview] = useState<string>(data.logoUrl || '')

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setLogoPreview(dataUrl)
      onChange({ logoUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contact & Branding</h2>
        <p className="text-gray-500 mt-1">How can customers reach you, and what's your brand style?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Phone Number"
          value={data.phone}
          onChange={(v) => onChange({ phone: v })}
          placeholder="(555) 000-0000"
          type="tel"
        />
        <InputField
          label="Email Address"
          value={data.email}
          onChange={(v) => onChange({ email: v })}
          placeholder="hello@yourbusiness.com"
          type="email"
        />
      </div>

      <InputField
        label="Business Address"
        value={data.address}
        onChange={(v) => onChange({ address: v })}
        placeholder="123 Main St, City, State 12345"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo Upload</label>
        <p className="text-xs text-gray-500 mb-2">PNG, JPG, SVG (max 2MB). Will appear in the site header.</p>
        <div className="flex items-center gap-4">
          {logoPreview && (
            <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            </div>
          )}
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {logoPreview ? 'Change Logo' : 'Upload Logo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </label>
          {logoPreview && (
            <button
              type="button"
              onClick={() => { setLogoPreview(''); onChange({ logoUrl: '' }) }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {BRAND_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => onChange({ brandStyle: style.value })}
              className={`
                px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition
                ${data.brandStyle === style.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
