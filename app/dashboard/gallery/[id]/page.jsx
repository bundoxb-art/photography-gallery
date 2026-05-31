'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function GalleryManager() {
  const router = useRouter()
  const { id } = useParams()
  const [gallery, setGallery] = useState(null)
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: galleryData } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single()

      if (!galleryData) { router.push('/dashboard'); return }
      setGallery(galleryData)

      const { data: photosData } = await supabase
        .from('photos')
        .select('*')
        .eq('gallery_id', id)
        .order('created_at', { ascending: false })

      setPhotos(photosData || [])
      setLoading(false)
    }
    init()
  }, [id])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('galleryId', id)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data.photo) {
        setPhotos(prev => [data.photo, ...prev])
      }
    }
    setUploading(false)
  }

  const handleDelete = async (photo) => {
    await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId: photo.id, b2Key: photo.b2_key })
    })
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  const copyLink = () => {
    const link = `${window.location.origin}/g/${gallery.slug}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white mb-2 text-sm">
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">{gallery?.name}</h1>
          </div>
          <button onClick={copyLink}
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
            {copied ? '✅ Copied!' : '🔗 Copy Client Link'}
          </button>
        </div>

        {/* Client Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <p className="text-gray-400 text-sm mb-1">Client Access Password</p>
          <p className="font-mono text-white">{gallery?.client_password}</p>
        </div>

        {/* Personal Message */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm mb-2">💌 Personal Message to Client</p>
          <textarea
            placeholder="Write a personal note to your client... (e.g. It was such a pleasure photographing your special day!)"
            defaultValue={gallery?.message || ''}
            onBlur={async (e) => {
              await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  galleryId: id,
                  message: e.target.value
                })
              })
              setGallery(prev => ({ ...prev, message: e.target.value }))
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white resize-none h-24 text-sm"
          />
          <p className="text-gray-600 text-xs mt-1">Auto-saves when you click away</p>
        </div>

        {/* Upload */}
        <label className="block border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-gray-500 transition mb-6">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          {uploading ? (
            <p className="text-gray-400">Uploading photos... please wait</p>
          ) : (
            <>
              <p className="text-2xl mb-2">📁</p>
              <p className="text-gray-400">Click to upload photos</p>
              <p className="text-gray-600 text-sm mt-1">You can select multiple at once</p>
            </>
          )}
        </label>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <p className="text-center text-gray-600">No photos yet — upload some above</p>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-3">
              💡 Hover a photo and click <strong>Set Cover</strong> to set gallery cover image
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.map(photo => (
                <div key={photo.id}
                  className="relative group rounded-lg overflow-hidden bg-gray-900 aspect-square">
                  <img
                    src={`/api/photo?key=${photo.b2_key}`}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />
                  {/* Cover badge */}
                  {gallery.cover_image === photo.b2_key && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
                      ⭐ Cover
                    </div>
                  )}
                  {/* Action buttons */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 opacity-0 group-hover:opacity-100 transition flex gap-2">
                    <button
                      onClick={async () => {
                        await fetch('/api/cover', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ galleryId: id, b2Key: photo.b2_key })
                        })
                        setGallery(prev => ({ ...prev, cover_image: photo.b2_key }))
                      }}
                      className="flex-1 bg-yellow-500 text-black text-xs py-1 rounded font-semibold">
                      ⭐ Set Cover
                    </button>
                    <button
                      onClick={() => handleDelete(photo)}
                      className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  )
}