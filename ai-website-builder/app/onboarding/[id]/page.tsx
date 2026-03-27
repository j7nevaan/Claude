'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBar from '@/components/ui/ProgressBar'
import Step1Business from '@/components/onboarding/Step1Business'
import Step2Contact from '@/components/onboarding/Step2Contact'
import Step3ExistingSite from '@/components/onboarding/Step3ExistingSite'
import Step4Integrations from '@/components/onboarding/Step4Integrations'
import Step5PageStructure from '@/components/onboarding/Step5PageStructure'
import Step6SitePreview from '@/components/onboarding/Step6SitePreview'
import Step7Approval from '@/components/onboarding/Step7Approval'
import type { ProjectData, PageData } from '@/lib/types'

const TOTAL_STEPS = 7

const DEFAULT_PROJECT: ProjectData = {
  id: '',
  status: 'draft',
  currentStep: 1,
  businessName: '',
  industry: '',
  services: [],
  serviceAreas: [],
  businessDescription: '',
  uniqueSellingPoints: [],
  yearsInBusiness: '',
  phone: '',
  email: '',
  address: '',
  logoUrl: '',
  brandStyle: 'modern',
  hasExistingWebsite: false,
  existingWebsiteUrl: '',
  scrapedData: {},
  contactFormLink: '',
  useInternalForm: false,
  reviewLink: '',
  chatWidgetScript: '',
  bookingLink: '',
  socialLinks: {},
  sitemapData: { pages: [], navigation: [] },
  pages: [],
}

export default function OnboardingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [projectId, setProjectId] = useState<string>('')
  const [data, setData] = useState<ProjectData>(DEFAULT_PROJECT)
  const [pages, setPages] = useState<PageData[]>([])
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'' | 'saved' | 'saving' | 'error'>('')
  const [approving, setApproving] = useState(false)
  const [structureGenerated, setStructureGenerated] = useState(false)

  // Load project on mount
  useEffect(() => {
    params.then(({ id }) => {
      setProjectId(id)
      fetch(`/api/projects/${id}`)
        .then((r) => r.json())
        .then((project) => {
          setData(project)
          setPages(project.pages || [])
          setStep(project.currentStep || 1)
          if (project.pages?.length > 0) setStructureGenerated(true)
        })
        .catch(console.error)
    })
  }, [params])

  const save = useCallback(
    async (updates: Partial<ProjectData>, regenerate = false) => {
      if (!projectId) return
      setSaving(true)
      setSaveStatus('saving')
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...updates, _regeneratePages: regenerate }),
        })
        const updated = await res.json()
        if (res.ok) {
          setData(updated)
          setPages(updated.pages || [])
          if (regenerate) setStructureGenerated(true)
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus(''), 2000)
        } else {
          setSaveStatus('error')
        }
      } catch {
        setSaveStatus('error')
      } finally {
        setSaving(false)
      }
    },
    [projectId]
  )

  const handleChange = useCallback((updates: Partial<ProjectData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleNext = async () => {
    // On step 5 (page structure) -> generate pages before proceeding
    if (step === 4 && !structureGenerated) {
      await save({ ...data, currentStep: 5 }, true)
    } else {
      await save({ ...data, currentStep: step + 1 })
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleStepClick = (s: number) => {
    setStep(s)
  }

  const handlePagesChange = (updated: PageData[]) => {
    setPages(updated)
  }

  const handleGenerateStructure = async () => {
    await save({ ...data, currentStep: 5 }, true)
  }

  const handleApprove = async () => {
    setApproving(true)
    try {
      // Save final state first
      await save({ ...data, status: 'approved', currentStep: 7 })

      // Save page updates
      for (const page of pages) {
        if (page.serviceDesc || page.imageData) {
          await fetch(`/api/projects/${projectId}/pages`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageId: page.id, serviceDesc: page.serviceDesc, imageData: page.imageData }),
          })
        }
      }

      // Trigger generation
      const res = await fetch(`/api/generate/${projectId}`, { method: 'POST' })
      const result = await res.json()

      if (res.ok) {
        router.push(`/preview/${projectId}`)
      } else {
        alert('Generation failed: ' + result.error)
        setApproving(false)
      }
    } catch (err) {
      alert('An error occurred. Please try again.')
      setApproving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-blue-600">⚡ AI Website Builder</a>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && <span className="text-xs text-gray-400">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-xs text-green-600">✓ Saved</span>}
            {saveStatus === 'error' && <span className="text-xs text-red-500">Save failed</span>}
            <button
              onClick={() => save({ ...data })}
              disabled={saving}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Save Progress
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <ProgressBar currentStep={step} onStepClick={handleStepClick} />

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          {step === 1 && <Step1Business data={data} onChange={handleChange} />}
          {step === 2 && <Step2Contact data={data} onChange={handleChange} />}
          {step === 3 && <Step3ExistingSite data={data} onChange={handleChange} />}
          {step === 4 && <Step4Integrations data={data} onChange={handleChange} />}
          {step === 5 && (
            <Step5PageStructure
              data={data}
              pages={pages}
              onPagesChange={handlePagesChange}
              onGenerate={handleGenerateStructure}
              generating={saving}
            />
          )}
          {step === 6 && <Step6SitePreview data={data} pages={pages} />}
          {step === 7 && (
            <Step7Approval
              data={data}
              pages={pages}
              onApprove={handleApprove}
              approving={approving}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ← Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    {step === 4 ? '⚙️ Generate Page Structure' : 'Next →'}
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
