'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function ClientGallery() {
  const { slug } = useParams()
  const [gallery, setGallery] = useState(null)
  const [photos, setPhotos] = useState([])
  const [favourites, setFavourites] = useState([])
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showFavs, setShowFavs] = useState(false)

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('galleries')
        .select('*')
        .eq('slug', slug)
        .single()
      setGallery(data)
      setLoading(false)
    }
    fetchGallery()
  }, [slug])

  const handleUnlock = async () => {
    if (password === gallery.client_password) {
      const { data: photosData } = await supabase
        .from('photos')
        .select('*')
        .eq('gallery_id', gallery.id)
        .order('created_at', { ascending: false })
      const { data: favsData } = await supabase
        .from('favourites')
        .select('*')
        .eq('gallery_id', gallery.id)
      setPhotos(photosData || [])
      setFavourites(favsData?.map(f => f.photo_id) || [])
      setUnlocked(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  const toggleFavourite = async (photo) => {
    const isFav = favourites.includes(photo.id)
    await fetch('/api/favourite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        galleryId: gallery.id,
        photoId: photo.id,
        action: isFav ? 'remove' : 'add'
      })
    })
    setFavourites(prev =>
      isFav ? prev.filter(id => id !== photo.id) : [...prev, photo.id]
    )
  }

  const displayedPhotos = showFavs
    ? photos.filter(p => favourites.includes(p.id))
    : photos

  if (loading) return (
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#c9a84c] border-t-transparent animate-spin" />
    </main>
  )

  if (!gallery) return (
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
      <p className="text-gray-500">Gallery not found.</p>
    </main>
  )

  if (!unlocked) return (
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}} />
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🔒</span>
        </div>
        <h1 style={{fontFamily:"'Playfair Display', serif"}} className="text-3xl font-bold mb-2">{gallery.name}</h1>
        <p className="text-gray-500 mb-8 text-sm">Enter your password to view your photos</p>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-5">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUnlock()}
          className="w-full glass rounded-2xl px-5 py-4 mb-4 outline-none text-center text-white placeholder-gray-600 text-sm"
        />
        <button onClick={handleUnlock}
          className="w-full py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group"
          style={{background:'linear-gradient(135deg, #c9a84c, #d4b460)'}}>
          <span className="relative z-10">View My Photos</span>
        </button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {gallery.cover_image && (
        <div className="relative w-full h-72 md:h-[480px] overflow-hidden">
          <img src={`/api/photo?key=${gallery.cover_image}`} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-2">Gallery</p>
            <h1 style={{fontFamily:"'Playfair Display', serif"}} className="text-5xl font-bold">{gallery.name}</h1>
            <p className="text-gray-400 mt-2 text-sm">{photos.length} photos</p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!gallery.cover_image && (
          <div className="mb-8">
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-2">Gallery</p>
            <h1 style={{fontFamily:"'Playfair Display', serif"}} className="text-4xl font-bold">{gallery.name}</h1>
            <p className="text-gray-500 mt-2 text-sm">{photos.length} photos</p>
          </div>
        )}
        {gallery.message && (
          <div className="glass rounded-2xl p-6 mb-6">
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">A message from your photographer</p>
            <p className="text-gray-300 leading-relaxed text-sm">{gallery.message}</p>
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button onClick={() => setShowFavs(false)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${!showFavs ? 'bg-[#c9a84c] text-black' : 'glass text-gray-400'}`}>
              All ({photos.length})
            </button>
            <button onClick={() => setShowFavs(true)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${showFavs ? 'bg-[#c9a84c] text-black' : 'glass text-gray-400'}`}>
              Favourites ({favourites.length})
            </button>
          </div>
          <a href={`/api/download-all?galleryId=${gallery.id}&galleryName=${encodeURIComponent(gallery.name)}`}
            className="glass px-4 py-2 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition">
            Download All
          </a>
        </div>
        {displayedPhotos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm">{showFavs ? 'No favourites yet' : 'No photos yet'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedPhotos.map(photo => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-[#111] aspect-square cursor-pointer"
                onClick={() => setSelected(photo)}>
                <img src={`/api/photo?key=${photo.b2_key}`} alt={photo.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button onClick={e => { e.stopPropagation(); toggleFavourite(photo) }}
                  className="absolute top-3 right-3 text-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {favourites.includes(photo.id) ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <img src={`/api/photo?key=${selected.b2_key}`} alt={selected.filename} className="max-w-full max-h-full object-contain rounded-2xl" />
          <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-[#c9a84c] transition">✕</button>
        </div>
      )}
    </main>
  )
}
