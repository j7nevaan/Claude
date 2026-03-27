'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProgressBar from '@/components/ui/ProgressBar'
import Step1Business from '@/components/onboarding/Step1Business'
import Step2Contact from '@/components/onboarding/Step2Contact'
import Step3ExistingSite from '@/components/onboarding/Step3ExistingSite'
import Step4Integrations from '@/components/onboarding/Step4Integrations'
import Step5PageStructure from '@/components/onboarding/Step5PageStructure'
import Step6SitePreview from '@/components/onboarding/Step6SitePreview'
import Step7Approval from '@/components/onboarding/Step7Approval'
import type { ProjectData, PageData } from '@/lib/types'
import { getProject, updateProject, regeneratePages } from '@/lib/store'
import { generateAllPages } from '@/lib/generator'

const TOTAL_STEPS = 7

function OnboardingInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') || ''

  const [data, setData] = useState<ProjectData | null>(null)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'' | 'saved' | 'error'>('')
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    if (!id) { router.push('/'); return }
    const project = getProject(id)
    if (!project) { router.push('/'); return }
    setData(project)
    setStep(project.currentStep || 1)
  }, [id, router])

  const save = useCallback((updates: Partial<ProjectData>) => {
    if (!id || !data) return
    setSaving(true)
    try {
      const updated = updateProject(id, updates)
      setData(updated)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }, [id, data])

  const handleChange = useCallback((updates: Partial<ProjectData>) => {
    setData(prev => prev ? { ...prev, ...updates } : prev)
  }, [])

  const handleNext = () => {
    if (!data) return
    const nextStep = Math.min(step + 1, TOTAL_STEPS)

    if (step === 4) {
      // Generate page structure before moving to step 5
      setSaving(true)
      try {
        const updated = regeneratePages(id)
        const withStep = updateProject(id, { ...data, currentStep: nextStep, pages: updated.pages, sitemapData: updated.sitemapData })
        setData(withStep)
        setStep(nextStep)
      } catch {
        setSaveStatus('error')
      } finally {
        setSaving(false)
      }
    } else {
      save({ ...data, currentStep: nextStep })
      setStep(nextStep)
    }
  }

  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const handleStepClick = (s: number) => { if (s < step) setStep(s) }

  const handlePagesChange = (pages: PageData[]) => {
    setData(prev => prev ? { ...prev, pages } : prev)
  }

  const handleApprove = async () => {
    if (!data) return
    setApproving(true)
    try {
      // Save final page edits
      const saved = updateProject(id, { ...data, status: 'approved' })
      // Generate all HTML
      const files = generateAllPages(saved, saved.pages)
      // Store HTML in page records
      const updatedPages = saved.pages.map(page => {
        let filename = ''
        if (page.pageType === 'home') filename = 'index.html'
        else if (page.pageType === 'about') filename = 'about/index.html'
        else if (page.pageType === 'contact') filename = 'contact/index.html'
        else if (page.pageType === 'service') filename = `services/${page.service.toLowerCase().replace(/\s+/g, '-')}/index.html`
        else if (page.pageType === 'location') filename = `locations/${page.location.toLowerCase().replace(/\s+/g, '-')}/index.html`
        else if (page.pageType === 'service-location') filename = `services/${page.service.toLowerCase().replace(/\s+/g, '-')}/${page.location.toLowerCase().replace(/\s+/g, '-')}/index.html`
        return filename && files.has(filename) ? { ...page, content: files.get(filename)!, approved: true } : page
      })
      updateProject(id, { status: 'complete', pages: updatedPages })
      router.push(`/preview?id=${id}`)
    } catch (err) {
      alert('Generation failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
      setApproving(false)
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pages = data.pages || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-blue-600">⚡ AI Website Builder</a>
          <div className="flex items-center gap-3">
            {saveStatus === 'saved' && <span className="text-xs text-green-600">✓ Saved</span>}
            {saveStatus === 'error' && <span className="text-xs text-red-500">Save failed</span>}
            <button onClick={() => save({ ...data })} disabled={saving}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
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
              data={data} pages={pages}
              onPagesChange={handlePagesChange}
              onGenerate={async () => {
                const updated = regeneratePages(id)
                setData(prev => prev ? { ...prev, pages: updated.pages, sitemapData: updated.sitemapData } : prev)
              }}
              generating={saving}
            />
          )}
          {step === 6 && <Step6SitePreview data={data} pages={pages} />}
          {step === 7 && <Step7Approval data={data} pages={pages} onApprove={handleApprove} approving={approving} />}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={handleBack} disabled={step === 1}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
              ← Back
            </button>
            {step < TOTAL_STEPS && (
              <button onClick={handleNext} disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2">
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {step === 4 ? 'Generating pages...' : 'Saving...'}
                  </>
                ) : step === 4 ? '⚙️ Generate Page Structure' : 'Next →'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OnboardingInner />
    </Suspense>
  )
}
