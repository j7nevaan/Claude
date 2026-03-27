'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectData } from '@/lib/types'
import { getProjects, createProject, deleteProject } from '@/lib/store'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700' },
  generating: { label: 'Generating...', color: 'bg-yellow-100 text-yellow-700' },
  complete: { label: '✅ Complete', color: 'bg-green-100 text-green-700' },
}

export default function Dashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [mounted, setMounted] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProjects(getProjects())
  }, [])

  const handleCreate = () => {
    if (!newName.trim()) return
    setCreating(true)
    const project = createProject(newName.trim())
    router.push(`/onboarding?id=${project.id}`)
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    deleteProject(id)
    setProjects(getProjects())
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">⚡ AI Website Builder</h1>
              <p className="text-blue-200 text-lg max-w-xl">
                Generate complete, SEO-optimized websites for your clients in minutes.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
            >
              + New Project
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Projects', value: projects.length },
              { label: 'Complete', value: projects.filter(p => p.status === 'complete').length },
              { label: 'In Progress', value: projects.filter(p => p.status === 'draft').length },
              { label: 'Pages Built', value: projects.reduce((s, p) => s + (p.pages?.length || 0), 0) },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">New Client Project</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text" value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="e.g. Acme Painting Co." autoFocus
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowCreate(false); setNewName('') }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={!newName.trim() || creating}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
                {creating ? 'Creating...' : 'Create & Start →'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-10">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No projects yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Create your first client project and generate a complete website in minutes.
            </p>
            <button onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
              + Create Your First Project
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(project => {
                const status = STATUS_LABELS[project.status] || STATUS_LABELS.draft
                const stepLabels = ['Business Info','Contact & Brand','Existing Site','Integrations','Page Structure','Preview','Approve & Generate']
                const currentLabel = stepLabels[Math.min((project.currentStep || 1) - 1, 6)]
                const progress = Math.round(((project.currentStep || 1) / 7) * 100)
                return (
                  <div key={project.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
                          {project.businessName || 'Unnamed Project'}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2 ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      {project.industry && <p className="text-sm text-gray-500 mb-2">{project.industry}</p>}
                      {project.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.services.slice(0, 3).map(s => (
                            <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                          {project.services.length > 3 && <span className="text-xs text-gray-400">+{project.services.length - 3} more</span>}
                        </div>
                      )}
                      {project.status !== 'complete' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{currentLabel}</span>
                            <span>Step {project.currentStep || 1}/7</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}
                      {project.pages?.length > 0 && (
                        <p className="text-xs text-gray-400 mb-3">📄 {project.pages.length} pages generated</p>
                      )}
                    </div>
                    <div className="px-5 pb-5 flex gap-2">
                      {project.status === 'complete' ? (
                        <a href={`/preview?id=${project.id}`}
                          className="flex-1 text-center py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                          👁 View Website
                        </a>
                      ) : (
                        <a href={`/onboarding?id=${project.id}`}
                          className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                          {project.currentStep === 1 ? '▶ Start' : '✏️ Continue'}
                        </a>
                      )}
                      {project.status === 'complete' && (
                        <a href={`/onboarding?id=${project.id}`}
                          className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition">
                          Edit
                        </a>
                      )}
                      <button onClick={() => handleDelete(project.id, project.businessName)}
                        className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm transition">
                        🗑
                      </button>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => setShowCreate(true)}
                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 text-center hover:border-blue-300 hover:bg-blue-50/30 transition group min-h-[180px] flex flex-col items-center justify-center">
                <span className="text-3xl mb-2">+</span>
                <span className="font-semibold text-gray-600 group-hover:text-blue-600">New Project</span>
                <span className="text-xs text-gray-400 mt-1">Add a new client</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '📋', title: '7-Step Onboarding', desc: 'Guided form collects all client data: business info, branding, integrations, and more.' },
            { icon: '🤖', title: 'Auto Page Builder', desc: 'Generates service pages, location pages, and SEO combo pages automatically.' },
            { icon: '⚡', title: 'Instant ZIP Export', desc: 'Download a complete ZIP of HTML files ready to deploy anywhere.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
