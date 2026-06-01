'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [galleries, setGalleries] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data } = await supabase
        .from('galleries')
        .select('*')
        .eq('photographer_id', user.id)
        .order('created_at', { ascending: false })
      setGalleries(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#c9a84c] border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading your galleries...</p>
      </div>
    </main>
  )

  const initials = user?.user_metadata?.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PG'

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

      {/* Top Nav */}
      <nav className="relative z-10 border-b border-gray-900 px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-xl font-bold">
            Pic<span className="text-[#c9a84c]">Delivr</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/gallery/new"
              className="relative overflow-hidden group bg-[#c9a84c] text-black px-5 py-2.5 rounded-full text-sm font-semibold transition">
              <span className="relative z-10">+ New Gallery</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center">
                <span className="text-[#c9a84c] text-xs font-bold">{initials}</span>
              </div>
              <button onClick={handleLogout}
                className="text-gray-600 hover:text-white transition text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="opacity-0 animate-fade-up flex justify-between items-end mb-10">
          <div>
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-2">
              Dashboard
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl font-bold">
              Good day, {user?.user_metadata?.name?.split(' ')[0]} 👋
            </h1>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="opacity-0 animate-fade-up delay-100 grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Galleries', value: galleries.length },
            { label: 'This Month', value: galleries.filter(g => new Date(g.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length },
            { label: 'Storage', value: 'B2 Cloud' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{stat.label}</p>
              <p style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Galleries */}
        {galleries.length === 0 ? (
          <div className="opacity-0 animate-fade-up delay-200 border border-dashed border-gray-800 rounded-3xl p-20 text-center">
            <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📸</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl font-bold mb-3">No galleries yet</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              Create your first gallery and start delivering photos like a professional
            </p>
            <Link href="/dashboard/gallery/new"
              className="inline-block bg-[#c9a84c] text-black px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#d4b460] transition">
              Create First Gallery →
            </Link>
          </div>
        ) : (
          <>
            <p className="opacity-0 animate-fade-up delay-200 text-gray-600 text-xs uppercase tracking-widest mb-5">
              Your Galleries
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {galleries.map((gallery, i) => (
                <Link key={gallery.id}
                  href={`/dashboard/gallery/${gallery.id}`}
                  className="opacity-0 animate-fade-up group block"
                  style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                  <div className="glass rounded-2xl overflow-hidden hover:border-[#c9a84c]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/5">

                    {/* Cover */}
                    <div className="aspect-video bg-[#111] overflow-hidden relative">
                      {gallery.cover_image ? (
                        <>
                          <img
                            src={`/api/photo?key=${gallery.cover_image}`}
                            alt={gallery.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                          <span className="text-4xl opacity-10">📷</span>
                          <span className="text-gray-700 text-xs">No cover set</span>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#c9a84c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-[#c9a84c] text-sm font-semibold tracking-wide">
                          Manage Gallery →
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="font-semibold text-white text-sm mb-1 group-hover:text-[#c9a84c] transition">
                            {gallery.name}
                          </h2>
                          <p className="text-gray-600 text-xs">
                            {new Date(gallery.created_at).toLocaleDateString('en-KE', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="w-7 h-7 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-[#c9a84c]/40 transition">
                          <span className="text-gray-600 group-hover:text-[#c9a84c] transition text-xs">→</span>
                        </div>
                      </div>

                      {/* Client link */}
                      <div className="mt-4 pt-4 border-t border-gray-900">
                        <p className="text-gray-700 text-xs font-mono truncate">
                          /g/{gallery.slug}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Add new */}
              <Link href="/dashboard/gallery/new"
                className="opacity-0 animate-fade-up group"
                style={{ animationDelay: `${0.2 + galleries.length * 0.08}s` }}>
                <div className="glass rounded-2xl border-dashed border border-gray-800 hover:border-[#c9a84c]/30 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] gap-4">
                  <div className="w-12 h-12 rounded-full border border-gray-800 group-hover:border-[#c9a84c]/40 flex items-center justify-center transition">
                    <span className="text-gray-600 group-hover:text-[#c9a84c] transition text-xl">+</span>
                  </div>
                  <p className="text-gray-600 group-hover:text-[#c9a84c] transition text-sm font-medium">
                    New Gallery
                  </p>
                </div>
              </Link>

            </div>
          </>
        )}
      </div>
    </main>
  )
}