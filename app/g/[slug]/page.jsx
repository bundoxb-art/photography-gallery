'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function ClientGallery() {
  const { slug } = useParams()
  const [gallery, setGallery] = useState(null)
  const [photos, setPhotos] = useState([])
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

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
      const { data } = await supabase
        .from('photos')
        .select('*')
        .eq('gallery_id', gallery.id)
        .order('created_at', { ascending: false })
      setPhotos(data || [])
      setUnlocked(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

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
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">{gallery.name}</h1>
        <p className="text-gray-400 mb-8">{photos.length} photos</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelected(photo)}
              className="cursor-pointer rounded-lg overflow-hidden bg-gray-900 aspect-square hover:opacity-80 transition">
              <img
                src={`/api/photo?key=${photo.b2_key}`}
                alt={photo.filename}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
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