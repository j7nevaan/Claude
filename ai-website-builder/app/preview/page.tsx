'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { ProjectData, PageData } from '@/lib/types'
import { getProject } from '@/lib/store'
import { generateAllPages } from '@/lib/generator'

function PreviewInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') || ''

  const [project, setProject] = useState<ProjectData | null>(null)
  const [pages, setPages] = useState<PageData[]>([])
  const [selected, setSelected] = useState<PageData | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!id) { router.push('/'); return }
    const p = getProject(id)
    if (!p) { router.push('/'); return }
    setProject(p)
    setPages(p.pages || [])
    const home = p.pages?.find(pg => pg.pageType === 'home')
    if (home) setSelected(home)
  }, [id, router])

  const handleDownloadZip = async () => {
    if (!project) return
    setDownloading(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const files = generateAllPages(project, pages)
      for (const [path, content] of files.entries()) {
        zip.file(path, content)
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.businessName.replace(/\s+/g, '-').toLowerCase()}-website.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Download failed: ' + (err instanceof Error ? err.message : 'Unknown'))
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadPage = () => {
    if (!selected?.content) return
    const blob = new Blob([selected.content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selected.slug.replace(/\//g, '-').replace(/^-/, '') || 'index'}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const groups = {
    core: pages.filter(p => ['home', 'about', 'contact'].includes(p.pageType)),
    services: pages.filter(p => p.pageType === 'service'),
    locations: pages.filter(p => p.pageType === 'location'),
    combos: pages.filter(p => p.pageType === 'service-location'),
  }

  const icons: Record<string, string> = { home: '🏠', about: '👥', contact: '📬', service: '🔧', location: '📍', 'service-location': '🎯' }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-3 flex-wrap">
        <a href="/" className="text-sm font-bold text-blue-400">⚡ AI Website Builder</a>
        <span className="text-gray-600">/</span>
        <span className="text-sm text-gray-300 font-medium">{project.businessName}</span>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">✅ {pages.length} pages</span>
          <a href={`/onboarding?id=${id}`}
            className="px-3 py-1.5 text-xs text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition">
            ← Edit
          </a>
          <button onClick={handleDownloadZip} disabled={downloading}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {downloading ? 'Zipping...' : '⬇ Download ZIP'}
          </button>
          {selected?.content && (
            <button onClick={handleDownloadPage}
              className="px-3 py-1.5 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">
              ⬇ This Page
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0">
          <div className="p-3 space-y-4">
            {[
              { label: 'Core', items: groups.core },
              { label: `Services (${groups.services.length})`, items: groups.services },
              { label: `Locations (${groups.locations.length})`, items: groups.locations },
              { label: `SEO Combos (${groups.combos.length})`, items: groups.combos },
            ].map(({ label, items }) => items.length > 0 && (
              <div key={label}>
                <p className="text-xs text-gray-500 px-2 mb-1">{label}</p>
                {items.map(p => (
                  <button key={p.id} onClick={() => setSelected(p)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-0.5 truncate transition
                      ${selected?.id === p.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                    {icons[p.pageType] || '📄'} {p.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-gray-900 overflow-auto">
          {selected?.content ? (
            <iframe
              srcDoc={selected.content}
              title={selected.title}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-3">👈</div>
                <p>Select a page to preview</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PreviewInner />
    </Suspense>
  )
}
