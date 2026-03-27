'use client'

import { InputField, TextareaField, SelectField } from '@/components/ui/FormField'
import TagInput from '@/components/ui/TagInput'
import { INDUSTRIES } from '@/lib/types'
import type { ProjectData } from '@/lib/types'

interface Props {
  data: ProjectData
  onChange: (data: Partial<ProjectData>) => void
}

export default function Step1Business({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
        <p className="text-gray-500 mt-1">Tell us about your business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Business Name"
          value={data.businessName}
          onChange={(v) => onChange({ businessName: v })}
          placeholder="Acme Services Co."
          required
        />
        <SelectField
          label="Industry"
          value={data.industry}
          onChange={(v) => onChange({ industry: v })}
          options={INDUSTRIES}
          placeholder="Select your industry..."
        />
      </div>

      <TagInput
        label="Services Offered"
        values={data.services}
        onChange={(v) => onChange({ services: v })}
        placeholder="e.g. Pressure Washing, Painting..."
        hint="Type a service and press Enter or comma to add"
      />

      <TagInput
        label="Service Areas"
        values={data.serviceAreas}
        onChange={(v) => onChange({ serviceAreas: v })}
        placeholder="e.g. Miami, FL, 33101..."
        hint="Add cities, states, or zip codes where you operate"
      />

      <TextareaField
        label="Business Description"
        value={data.businessDescription}
        onChange={(v) => onChange({ businessDescription: v })}
        placeholder="Describe what your business does and what makes it special..."
        rows={4}
      />

      <TagInput
        label="Unique Selling Points"
        values={data.uniqueSellingPoints}
        onChange={(v) => onChange({ uniqueSellingPoints: v })}
        placeholder="e.g. Licensed & Insured, 5-star rated..."
        hint="What makes your business stand out? Press Enter after each point"
      />

      <InputField
        label="Years in Business"
        value={data.yearsInBusiness}
        onChange={(v) => onChange({ yearsInBusiness: v })}
        placeholder="e.g. 10"
        type="number"
      />
    </div>
  )
}
