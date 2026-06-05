'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import MobileNav from '@/components/MobileNav'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

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
        .from('galleries').select('*')
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
        <p className="text-gray-600 text-xs uppercase tracking-widest animate-pulse">Loading your workspace</p>
      </div>
    </main>
  )

  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'Photographer'
  const thisMonth = galleries.filter(g =>
    new Date(g.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* Ambient orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none animate-orb-1"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none animate-orb-2"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />

      {/* Top accent line */}
      <div className="h-0.5 w-full relative z-10"
        style={{ background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />

      {/* Nav */}
      <nav className="relative z-20 px-4 md:px-8 py-4 sticky top-0"
        style={{ background: 'rgba(8,8,8,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo href="/" size="sm" />

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/dashboard/gallery/new"
              className="relative overflow-hidden group px-5 py-2.5 rounded-full text-sm font-semibold text-black transition-all"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
              <span className="relative z-10">+ New Gallery</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </Link>

            {/* Avatar */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer hover:bg-white/5 transition"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-ping opacity-10"
                  style={{ background: '#c9a84c', animationDuration: '4s' }} />
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#c9a84c]/40 relative bg-[#111]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user_metadata?.avatar || 'Felix'}&backgroundColor=111111`}
                    alt="Avatar" className="w-full h-full" />
                </div>
              </div>
              <span className="text-gray-300 text-sm font-medium">{firstName}</span>
              <button onClick={handleLogout} className="text-gray-600 hover:text-white transition text-xs ml-1">
                Logout
              </button>
            </div>
          </div>

          <MobileNav user={user} onLogout={handleLogout} />
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">

        {/* Welcome Section */}
        <div className="opacity-0 animate-fade-up mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] mb-2 font-medium">
                {getGreeting()} ☀️
              </p>
              <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl md:text-5xl font-bold text-white mb-2">
                {firstName}
              </h1>
              <p className="text-gray-500 text-sm">
                {galleries.length === 0
                  ? 'Ready to deliver your first gallery?'
                  : `You have ${galleries.length} ${galleries.length === 1 ? 'gallery' : 'galleries'} — keep creating! 🔥`}
              </p>
            </div>
            <Link href="/dashboard/gallery/new"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
              <span>+</span> Create New Gallery
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 opacity-0 animate-fade-up delay-100">
          {[
            { icon: '📸', label: 'Total Galleries', value: galleries.length, color: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.2)', text: '#c9a84c' },
            { icon: '📅', label: 'This Month', value: thisMonth, color: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', text: '#8b5cf6' },
            { icon: '☁️', label: 'Storage', value: 'B2 Cloud', color: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: '#3b82f6' },
            { icon: '✨', label: 'Plan', value: 'Free', color: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10b981' },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-4 md:p-5 hover:scale-[1.02] transition-all duration-300"
              style={{ background: stat.color, border: `1px solid ${stat.border}`, backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{stat.icon}</span>
                <p className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</p>
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", color: stat.text }}
                className="text-2xl md:text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Galleries */}
        {galleries.length === 0 ? (
          <div className="opacity-0 animate-fade-up delay-200 text-center py-20 rounded-3xl"
            style={{ border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <span className="text-3xl">📸</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl font-bold mb-3">Start your first gallery</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              Create a professional photo gallery and deliver memories your clients will cherish forever.
            </p>
            <Link href="/dashboard/gallery/new"
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm text-black"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
              Create First Gallery →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-5 opacity-0 animate-fade-up delay-200">
              <p className="text-gray-600 text-xs uppercase tracking-[0.15em]">Your Galleries</p>
              <Link href="/dashboard/gallery/new"
                className="text-[#c9a84c] text-xs hover:underline font-medium lg:hidden">
                + New Gallery
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {galleries.map((gallery, i) => (
                <Link key={gallery.id} href={`/dashboard/gallery/${gallery.id}`}
                  className="group block opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.2 + i * 0.07}s` }}>
                  <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>

                    {/* Cover */}
                    <div className="aspect-[4/3] relative overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {gallery.cover_image ? (
                        <>
                          <img src={`/api/photo?key=${gallery.cover_image}`} alt={gallery.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <p className="text-white text-xs font-medium">Open Gallery →</p>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="text-2xl opacity-30">📷</span>
                          </div>
                          <p className="text-gray-700 text-xs">No cover set</p>
                        </div>
                      )}

                      {/* Gold shimmer on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(201,168,76,0.05) 50%, transparent 100%)' }} />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-white text-sm group-hover:text-[#c9a84c] transition-colors truncate flex-1 pr-2">
                          {gallery.name}
                        </h2>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#c9a84c] group-hover:text-black"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <span className="text-[10px] text-gray-500 group-hover:text-black">→</span>
                        </div>
                      </div>

                      {gallery.event_date && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-xs">📅</span>
                          <p className="text-[#c9a84c] text-xs">
                            {new Date(gallery.event_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <p className="text-gray-600 text-xs">
                          {new Date(gallery.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-gray-700 text-xs font-mono truncate max-w-[80px]">/g/{gallery.slug?.split('-')[0]}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Add new card */}
              <Link href="/dashboard/gallery/new"
                className="opacity-0 animate-fade-up group"
                style={{ animationDelay: `${0.2 + galleries.length * 0.07}s` }}>
                <div className="rounded-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col items-center justify-center min-h-[200px] gap-4"
                  style={{ border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:border-[#c9a84c]/50"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-gray-600 group-hover:text-[#c9a84c] transition-colors text-xl font-light">+</span>
                  </div>
                  <p className="text-gray-600 group-hover:text-[#c9a84c] transition-colors text-sm font-medium">New Gallery</p>
                </div>
              </Link>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pb-4">
          <p className="text-gray-800 text-xs">
            PicDelivr · Built by{' '}
            <span className="text-[#c9a84c]">BundoxxThe Bee</span> · Mombasa 🇰🇪
          </p>
        </div>
      </div>
    </main>
  )
}
