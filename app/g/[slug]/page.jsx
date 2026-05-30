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
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Loading...</p>
    </main>
  )

  if (!gallery) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400">Gallery not found.</p>
    </main>
  )

  if (!unlocked) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h1 className="text-3xl font-bold mb-2">{gallery.name}</h1>
        <p className="text-gray-400 mb-8">Enter your password to view your photos</p>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUnlock()}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mb-4 outline-none focus:border-white text-center"
        />
        <button
          onClick={handleUnlock}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
          View My Photos
        </button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Cover Image Hero */}
      {gallery.cover_image && (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <img
            src={`/api/photo?key=${gallery.cover_image}`}
            alt="Gallery Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl font-bold drop-shadow-lg">{gallery.name}</h1>
            <p className="text-gray-300 mt-1">{photos.length} photos</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">

        {!gallery.cover_image && (
          <h1 className="text-3xl font-bold mb-2">{gallery.name}</h1>
        )}

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6 mt-2">
          <div className="flex gap-2">
            <button
              onClick={() => setShowFavs(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!showFavs ? 'bg-white text-black' : 'border border-gray-700 text-gray-400'}`}>
              All ({photos.length})
            </button>
            <button
              onClick={() => setShowFavs(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${showFavs ? 'bg-white text-black' : 'border border-gray-700 text-gray-400'}`}>
              ❤️ Favourites ({favourites.length})
            </button>
          </div>
          
          <a
            href={`/api/download-all?galleryId=${gallery.id}&galleryName=${encodeURIComponent(gallery.name)}`}
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm">
            ⬇️ Download All
          </a>
        </div>

        {/* Photos Grid */}
        {displayedPhotos.length === 0 ? (
          <p className="text-center text-gray-600 py-20">
            {showFavs ? 'No favourites yet — heart some photos!' : 'No photos yet'}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {displayedPhotos.map(photo => (
              <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-gray-900 aspect-square">
                <img
                  src={`/api/photo?key=${photo.b2_key}`}
                  alt={photo.filename}
                  onClick={() => setSelected(photo)}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition"
                />
                <button
                  onClick={() => toggleFavourite(photo)}
                  className="absolute top-2 right-2 text-xl opacity-0 group-hover:opacity-100 transition">
                  {favourites.includes(photo.id) ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <img
            src={`/api/photo?key=${selected.b2_key}`}
            alt={selected.filename}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 text-white text-2xl">
            ✕
          </button>
        </div>
      )}
    </main>
  )
}

          <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
              <p className="text-4xl mb-4">🔒</p>
              <h1 className="text-3xl font-bold mb-2">{gallery.name}</h1>
              <p className="text-gray-400 mb-8">Enter your password to view your photos</p>
              {error && <p className="text-red-400 mb-4">{error}</p>}
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mb-4 outline-none focus:border-white text-center"
              />
              <button
                onClick={handleUnlock}
                className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                View My Photos
              </button>
            </div>
          </main>
        )

        return (
          <main className="min-h-screen bg-black text-white">

            {/* Cover Image Hero */}
            {gallery.cover_image && (
              <div className="relative w-full h-72 md:h-96 overflow-hidden">
                <img
                  src={`/api/photo?key=${gallery.cover_image}`}
                  alt="Gallery Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h1 className="text-4xl font-bold drop-shadow-lg">{gallery.name}</h1>
                  <p className="text-gray-300 mt-1">{photos.length} photos</p>
                </div>
              </div>
            )}

            <div className="max-w-5xl mx-auto px-4 py-8">

              {!gallery.cover_image && (
                <h1 className="text-3xl font-bold mb-2">{gallery.name}</h1>
              )}

              {/* Actions Bar */}
              <div className="flex justify-between items-center mb-6 mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFavs(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!showFavs ? 'bg-white text-black' : 'border border-gray-700 text-gray-400'}`}>
                    All ({photos.length})
                  </button>
                  <button
                    onClick={() => setShowFavs(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${showFavs ? 'bg-white text-black' : 'border border-gray-700 text-gray-400'}`}>
                    ❤️ Favourites ({favourites.length})
                  </button>
                </div>
          
                <a
                  href={`/api/download-all?galleryId=${gallery.id}&galleryName=${encodeURIComponent(gallery.name)}`}
                  className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm">
                  ⬇️ Download All
                </a>
              </div>

              {/* Photos Grid */}
              {displayedPhotos.length === 0 ? (
                <p className="text-center text-gray-600 py-20">
                  {showFavs ? 'No favourites yet — heart some photos!' : 'No photos yet'}
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {displayedPhotos.map(photo => (
                    <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-gray-900 aspect-square">
                      <img
                        src={`/api/photo?key=${photo.b2_key}`}
                        alt={photo.filename}
                        onClick={() => setSelected(photo)}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition"
                      />
                      <button
                        onClick={() => toggleFavourite(photo)}
                        className="absolute top-2 right-2 text-xl opacity-0 group-hover:opacity-100 transition">
                        {favourites.includes(photo.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lightbox */}
            {selected && (
              <div
                onClick={() => setSelected(null)}
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                <img
                  src={`/api/photo?key=${selected.b2_key}`}
                  alt={selected.filename}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-white text-2xl">
                  ✕
                </button>
              </div>
            )}
          </main>
        )
      }
