'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

export default function NewGallery() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [clientPassword, setClientPassword] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleCreate = async () => {
    if (!name || !clientPassword) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const slug = generateSlug(name) + '-' + Date.now()
    const { data, error } = await supabase
      .from('galleries')
      .insert({ photographer_id: user.id, name, slug, client_password: clientPassword, event_date: eventDate || null })
      .select().single()
    if (error) { setError(error.message); setLoading(false) }
    else router.push(`/dashboard/gallery/${data.id}`)
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col">

      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* Nav */}
      <nav className="relative z-10 border-b border-gray-900 px-4 md:px-8 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Logo href="/dashboard" size="sm" />
          <button onClick={() => router.push('/dashboard')}
            className="text-gray-500 hover:text-white text-sm transition">
            ← Back
          </button>
        </div>
      </nav>

      {/* Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          <div className="opacity-0 animate-fade-up mb-8">
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-2">New Gallery</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl md:text-4xl font-bold">Create a Gallery</h1>
            <p className="text-gray-500 text-sm mt-2">Set up a private gallery for your client</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4 opacity-0 animate-fade-up delay-100">

            {/* Gallery Name */}
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">
                Gallery Name
              </label>
              <input
                type="text"
                placeholder="e.g. John & Mary Wedding"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600"
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">
                Event Date <span className="text-gray-700 normal-case">(optional)</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Client Password */}
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">
                Client Access Password
              </label>
              <input
                type="text"
                placeholder="e.g. JohnMary2024"
                value={clientPassword}
                onChange={e => setClientPassword(e.target.value)}
                className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600"
              />
              <p className="text-gray-600 text-xs mt-2">
                Share this with your client so they can access the gallery
              </p>
            </div>
          </div>

          <div className="opacity-0 animate-fade-up delay-200 mt-8 space-y-3">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
              <span className="relative z-10">
                {loading ? 'Creating...' : 'Create Gallery →'}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 rounded-2xl glass text-gray-400 hover:text-white transition text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
