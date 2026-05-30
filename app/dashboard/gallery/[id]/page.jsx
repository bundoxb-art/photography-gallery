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
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm mb-1">Client Access Password</p>
          <p className="font-mono text-white">{gallery?.client_password}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map(photo => (
              <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-gray-900 aspect-square">
                <img
                  src={`/api/photo?key=${photo.b2_key}`}
                  alt={photo.filename}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDelete(photo)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 text-xs opacity-0 group-hover:opacity-100 transition">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}