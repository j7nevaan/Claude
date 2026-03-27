'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectData, PageData } from '@/lib/types'

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [projectId, setProjectId] = useState('')
  const [project, setProject] = useState<ProjectData | null>(null)
  const [pages, setPages] = useState<PageData[]>([])
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(({ id }) => {
      setProjectId(id)
      fetch(`/api/projects/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setProject(data)
          setPages(data.pages || [])
          const homePage = data.pages?.find((p: PageData) => p.pageType === 'home')
          if (homePage) setSelectedPage(homePage)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    })
  }, [params])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch(`/api/export/${projectId}`)
      const data = await res.json()

      if (!res.ok) {
        alert('Export not ready: ' + (data.error || 'Unknown error'))
        return
      }

      // Create a downloadable JSON bundle
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project?.businessName?.replace(/\s+/g, '-').toLowerCase() || 'website'}-bundle.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadHtml = () => {
    if (!selectedPage?.content) return
    const blob = new Blob([selectedPage.content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedPage.slug.replace(/\//g, '-').replace(/^-/, '') || 'index'}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const groupedPages = {
    core: pages.filter((p) => ['home', 'about', 'contact'].includes(p.pageType)),
    services: pages.filter((p) => p.pageType === 'service'),
    locations: pages.filter((p) => p.pageType === 'location'),
    combos: pages.filter((p) => p.pageType === 'service-location'),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your website...</p>
        </div>
      </div>
    )
  }

  if (!project || project.status !== 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Website Not Ready</h2>
          <p className="text-gray-500 mb-4">
            {project?.status === 'generating' ? 'Your website is being generated...' : 'Complete the onboarding process first.'}
          </p>
          <button
            onClick={() => router.push(`/onboarding/${projectId}`)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-4 flex-wrap">
        <a href="/" className="text-sm font-bold text-blue-400">⚡ AI Website Builder</a>
        <span className="text-gray-600">/</span>
        <span className="text-sm text-gray-300 font-medium">{project.businessName}</span>
        <span className="ml-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">✅ Generated</span>
          <span className="text-xs text-gray-400">{pages.length} pages</span>
          <button
            onClick={() => router.push(`/onboarding/${projectId}`)}
            className="px-3 py-1.5 text-xs text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
          >
            ← Edit
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {downloading ? 'Exporting...' : '⬇ Export Bundle'}
          </button>
          {selectedPage?.content && (
            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
            >
              ⬇ Download Page HTML
            </button>
          )}
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0">
          <div className="p-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Pages</p>

            {groupedPages.core.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 px-2 mb-1">Core</p>
                {groupedPages.core.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPage(p)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition mb-0.5 ${
                      selectedPage?.id === p.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {p.pageType === 'home' ? '🏠' : p.pageType === 'about' ? '👥' : '📬'} {p.title}
                  </button>
                ))}
              </div>
            )}

            {groupedPages.services.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 px-2 mb-1">Services ({groupedPages.services.length})</p>
                {groupedPages.services.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPage(p)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition mb-0.5 truncate ${
                      selectedPage?.id === p.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    🔧 {p.title}
                  </button>
                ))}
              </div>
            )}

            {groupedPages.locations.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 px-2 mb-1">Locations ({groupedPages.locations.length})</p>
                {groupedPages.locations.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPage(p)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition mb-0.5 truncate ${
                      selectedPage?.id === p.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    📍 {p.title}
                  </button>
                ))}
              </div>
            )}

            {groupedPages.combos.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 px-2 mb-1">SEO Combos ({groupedPages.combos.length})</p>
                {groupedPages.combos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPage(p)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition mb-0.5 truncate ${
                      selectedPage?.id === p.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    🎯 {p.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Preview iframe */}
        <main className="flex-1 bg-gray-900 overflow-auto">
          {selectedPage?.content ? (
            <iframe
              srcDoc={selectedPage.content}
              title={selectedPage.title}
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
