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
        .select('*, photos(count)')
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
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#c9a84c] text-sm animate-pulse">Loading your galleries...</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-5 border-b border-gray-900">
        <span style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-xl font-bold">
          Pic<span className="text-[#c9a84c]">Delivr</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm hidden md:block">
            👋 {user?.user_metadata?.name}
          </span>
          <Link href="/dashboard/gallery/new"
            className="bg-[#c9a84c] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#d4b460] transition">
            + New Gallery
          </Link>
          <button onClick={handleLogout}
            className="text-gray-500 hover:text-white transition text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-3xl font-bold mb-1">
            Your Galleries
          </h1>
          <p className="text-gray-500 text-sm">
            {galleries.length} {galleries.length === 1 ? 'gallery' : 'galleries'} created
          </p>
        </div>

        {/* Empty state */}
        {galleries.length === 0 ? (
          <div className="border border-dashed border-gray-800 rounded-3xl p-16 text-center">
            <p className="text-5xl mb-4">📸</p>
            <h2 className="text-xl font-semibold mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              No galleries yet
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Create your first gallery and start delivering photos professionally
            </p>
            <Link href="/dashboard/gallery/new"
              className="bg-[#c9a84c] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#d4b460] transition text-sm">
              Create First Gallery →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleries.map(gallery => (
              <Link key={gallery.id}
                href={`/dashboard/gallery/${gallery.id}`}
                className="group border border-gray-800 rounded-2xl overflow-hidden hover:border-[#c9a84c]/40 transition bg-[#0d0d0d]">

                {/* Cover or placeholder */}
                <div className="aspect-video bg-[#151515] overflow-hidden relative">
                  {gallery.cover_image ? (
                    <img
                      src={`/api/photo?key=${gallery.cover_image}`}
                      alt={gallery.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl opacity-20">📷</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h2 className="font-semibold text-white mb-1 group-hover:text-[#c9a84c] transition">
                    {gallery.name}
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-xs">
                      {new Date(gallery.created_at).toLocaleDateString('en-KE', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                    <span className="text-[#c9a84c] text-xs">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Add new card */}
            <Link href="/dashboard/gallery/new"
              className="border border-dashed border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#c9a84c]/40 transition group min-h-[180px]">
              <span className="text-3xl mb-3 group-hover:scale-110 transition">➕</span>
              <p className="text-gray-500 text-sm group-hover:text-[#c9a84c] transition font-medium">
                New Gallery
              </p>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
