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
      if (!user) {
        router.push('/auth/login')
        return
      }
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
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">📸 Dashboard</h1>
            <p className="text-gray-400">Welcome, {user?.user_metadata?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/gallery/new"
              className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
              + New Gallery
            </Link>
            <button onClick={handleLogout}
              className="border border-gray-700 px-4 py-2 rounded-lg hover:border-white transition">
              Logout
            </button>
          </div>
        </div>

        {/* Galleries */}
        {galleries.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-400 mb-4">No galleries yet</p>
            <Link href="/dashboard/gallery/new"
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold">
              Create Your First Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleries.map(gallery => (
              <Link key={gallery.id} href={`/dashboard/gallery/${gallery.id}`}
                className="border border-gray-800 rounded-xl p-5 hover:border-gray-500 transition">
                <h2 className="text-xl font-semibold mb-1">{gallery.name}</h2>
                <p className="text-gray-400 text-sm mb-3">
                  {new Date(gallery.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm">
                  Client link: /g/{gallery.slug}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}