'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Logo from '@/components/Logo'

export default function GalleryManager() {
  const router = useRouter()
  const { id } = useParams()
  const [gallery, setGallery] = useState(null)
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('photos')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: galleryData } = await supabase
        .from('galleries').select('*').eq('id', id).single()
      if (!galleryData) { router.push('/dashboard'); return }
      setGallery(galleryData)
      const { data: photosData } = await supabase
        .from('photos').select('*').eq('gallery_id', id)
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
    setUploadProgress(0)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('galleryId', id)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.photo) setPhotos(prev => [data.photo, ...prev])
      setUploadProgress(Math.round(((i + 1) / files.length) * 100))
    }
    setUploading(false)
    setUploadProgress(0)
  }

  const handleDelete = async (photo) => {
    if (!confirm('Delete this photo?')) return
    await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId: photo.id, b2Key: photo.b2_key })
    })
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  const setCover = async (photo) => {
    await fetch('/api/cover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryId: id, b2Key: photo.b2_key })
    })
    setGallery(prev => ({ ...prev, cover_image: photo.b2_key }))
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/g/${gallery.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#c9a84c] border-t-transparent animate-spin" />
    </main>
  )

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* Nav */}
      <nav className="relative z-10 border-b border-gray-900 px-4 md:px-8 py-4 sticky top-0 bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')}
              className="w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition">
              ←
            </button>
            <div>
              <h1 className="font-semibold text-sm md:text-base text-white truncate max-w-[150px] md:max-w-none">
                {gallery?.name}
              </h1>
              <p className="text-gray-600 text-xs">{photos.length} photos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={copyLink}
              className={`px-3 md:px-4 py-2 rounded-full text-xs font-semibold transition ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#c9a84c] text-black hover:bg-[#d4b460]'}`}>
              {copied ? '✅ Copied!' : '🔗 Share'}
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['photos', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition capitalize ${activeTab === tab ? 'bg-[#c9a84c] text-black' : 'glass text-gray-400 hover:text-white'}`}>
              {tab === 'photos' ? `📸 Photos (${photos.length})` : '⚙️ Settings'}
            </button>
          ))}
        </div>

        {activeTab === 'photos' && (
          <>
            {/* Upload Area */}
            <label className="block border-2 border-dashed border-gray-800 rounded-2xl p-6 md:p-10 text-center cursor-pointer hover:border-[#c9a84c]/40 transition mb-6 group">
              <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
              {uploading ? (
                <div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                    <div className="bg-[#c9a84c] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-gray-400 text-sm">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-3 group-hover:border-[#c9a84c]/40 transition">
                    <span className="text-xl">📁</span>
                  </div>
                  <p className="text-white text-sm font-medium mb-1">Click to upload photos</p>
                  <p className="text-gray-600 text-xs">Select multiple photos at once · JPG, PNG, WEBP</p>
                </>
              )}
            </label>

            {/* Photos Grid */}
            {photos.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
                <span className="text-4xl block mb-3">📷</span>
                <p className="text-gray-500 text-sm">No photos yet — upload some above</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-xs mb-3">
                  💡 Hover/tap a photo to set cover or delete
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                  {photos.map(photo => (
                    <div key={photo.id}
                      className="relative group rounded-xl overflow-hidden bg-[#111] aspect-square">
                      <img
                        src={`/api/photo?key=${photo.b2_key}`}
                        alt={photo.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {gallery.cover_image === photo.b2_key && (
                        <div className="absolute top-2 left-2 bg-[#c9a84c] text-black text-xs px-2 py-0.5 rounded-full font-bold">
                          ⭐
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-2">
                        <button onClick={() => setCover(photo)}
                          className="w-full bg-[#c9a84c] text-black text-xs py-1.5 rounded-lg font-semibold">
                          ⭐ Set Cover
                        </button>
                        <button onClick={() => handleDelete(photo)}
                          className="w-full bg-red-600/80 text-white text-xs py-1.5 rounded-lg">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-lg space-y-5">

            {/* Gallery Info */}
            <div className="glass rounded-2xl p-5">
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-4">Gallery Info</p>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Gallery Name</p>
                  <p className="text-white text-sm font-medium">{gallery?.name}</p>
                </div>
                {gallery?.event_date && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Event Date</p>
                    <p className="text-white text-sm">
                      {new Date(gallery.event_date).toLocaleDateString('en-KE', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500 text-xs mb-1">Client Password</p>
                  <p className="font-mono text-[#c9a84c] text-sm">{gallery?.client_password}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Client Link</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-xs font-mono truncate flex-1">
                      /g/{gallery?.slug}
                    </p>
                    <button onClick={copyLink}
                      className="text-[#c9a84c] text-xs hover:underline whitespace-nowrap">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Message */}
            <div className="glass rounded-2xl p-5">
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">💌 Message to Client</p>
              <textarea
                placeholder="Write a personal note to your client..."
                defaultValue={gallery?.message || ''}
                onBlur={async (e) => {
                  await fetch('/api/message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ galleryId: id, message: e.target.value })
                  })
                  setGallery(prev => ({ ...prev, message: e.target.value }))
                }}
                className="w-full bg-[#151515] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#c9a84c]/50 resize-none h-28 text-sm placeholder-gray-600"
              />
              <p className="text-gray-600 text-xs mt-2">Auto-saves when you click away</p>
            </div>

            {/* Share */}
            <button onClick={copyLink}
              className="w-full py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
              <span className="relative z-10">
                {copied ? '✅ Link Copied!' : '🔗 Copy Client Link'}
              </span>
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
