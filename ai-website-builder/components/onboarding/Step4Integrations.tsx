'use client'

import { InputField, TextareaField } from '@/components/ui/FormField'
import type { ProjectData, SocialLinks } from '@/lib/types'

interface Props {
  data: ProjectData
  onChange: (data: Partial<ProjectData>) => void
}

const SOCIAL_PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'] as const

export default function Step4Integrations({ data, onChange }: Props) {
  const social = data.socialLinks || {}

  const updateSocial = (platform: string, value: string) => {
    onChange({ socialLinks: { ...social, [platform]: value } as SocialLinks })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Integrations & Links</h2>
        <p className="text-gray-500 mt-1">Add links and widgets to enhance your website</p>
      </div>

      {/* Contact Form */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white space-y-4">
        <h3 className="font-semibold text-gray-800">📬 Contact Form</h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onChange({ useInternalForm: false })}
            className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition ${
              !data.useInternalForm ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
            }`}
          >
            External Form Link
          </button>
          <button
            type="button"
            onClick={() => onChange({ useInternalForm: true, contactFormLink: '' })}
            className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition ${
              data.useInternalForm ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
            }`}
          >
            Build-in Form
          </button>
        </div>
        {!data.useInternalForm && (
          <InputField
            label="Contact Form URL"
            value={data.contactFormLink}
            onChange={(v) => onChange({ contactFormLink: v })}
            placeholder="https://your-form-link.com"
            type="url"
          />
        )}
        {data.useInternalForm && (
          <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            ✅ A built-in contact form will be generated on your website.
          </p>
        )}
      </div>

      {/* Reviews */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white">
        <h3 className="font-semibold text-gray-800 mb-3">⭐ Review Link</h3>
        <InputField
          label="Google Reviews / Yelp / Other"
          value={data.reviewLink}
          onChange={(v) => onChange({ reviewLink: v })}
          placeholder="https://maps.google.com/..."
          type="url"
        />
      </div>

      {/* Booking */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white">
        <h3 className="font-semibold text-gray-800 mb-3">📅 Booking Link</h3>
        <InputField
          label="Calendly, Acuity, or other booking URL"
          value={data.bookingLink}
          onChange={(v) => onChange({ bookingLink: v })}
          placeholder="https://calendly.com/yourbusiness"
          type="url"
        />
      </div>

      {/* Chat Widget */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white">
        <h3 className="font-semibold text-gray-800 mb-3">💬 Chat Widget</h3>
        <TextareaField
          label="Embed Script"
          value={data.chatWidgetScript}
          onChange={(v) => onChange({ chatWidgetScript: v })}
          placeholder={`<script>/* Paste your chat widget script here */</script>`}
          rows={3}
          hint="Paste the HTML embed code from Tidio, Intercom, Drift, etc."
        />
      </div>

      {/* Social Media */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white space-y-4">
        <h3 className="font-semibold text-gray-800">🔗 Social Media Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform} className="flex items-center gap-3">
              <span className="text-lg w-6 text-center flex-shrink-0">
                {platform === 'facebook' ? '📘' : platform === 'instagram' ? '📷' : platform === 'twitter' ? '🐦' : platform === 'linkedin' ? '💼' : platform === 'youtube' ? '▶️' : '🎵'}
              </span>
              <div className="flex-1">
                <InputField
                  label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  value={social[platform] || ''}
                  onChange={(v) => updateSocial(platform, v)}
                  placeholder={`https://${platform}.com/yourpage`}
                  type="url"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
