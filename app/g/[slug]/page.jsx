'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

function useSwipe(onLeft, onRight, onDown) {
  const [touch, setTouch] = useState(null)
  const onTouchStart = (e) => setTouch({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
  const onTouchEnd = (e) => {
    if (!touch) return
    const dx = touch.x - e.changedTouches[0].clientX
    const dy = touch.y - e.changedTouches[0].clientY
    if (Math.abs(dy) > 100) { onDown(); return }
    if (Math.abs(dx) > 50) dx > 0 ? onLeft() : onRight()
    setTouch(null)
  }
  return { onTouchStart, onTouchEnd }
}

function PhotoCard({ photo, isFav, onToggleFav, onClick }) {
  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#111] aspect-square cursor-pointer" onClick={onClick}>
      <img src={`/api/photo?key=${photo.b2_key}`} alt={photo.filename}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <button onClick={e => { e.stopPropagation(); onToggleFav() }}
        className="absolute top-2 right-2 text-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
        {isFav ? '❤️' : '🤍'}
      </button>
    </div>
  )
}

export default function ClientGallery() {
  const { slug } = useParams()
  const [gallery, setGallery] = useState(null)
  const [photos, setPhotos] = useState([])
  const [sets, setSets] = useState([])
  const [favourites, setFavourites] = useState([])
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [activeSet, setActiveSet] = useState('all')
  const [showFavs, setShowFavs] = useState(false)

  // ✅ ALL hooks defined before any returns
  const getDisplayPhotos = () => {
    if (showFavs) return photos.filter(p => favourites.includes(p.id))
    if (activeSet !== 'all') return photos.filter(p => p.set_id === activeSet)
    return photos
  }

  const displayedPhotos = getDisplayPhotos()
  const currentIndex = displayedPhotos.findIndex(p => p.id === selected?.id)

  const goNext = () => {
    if (currentIndex < displayedPhotos.length - 1)
      setSelected(displayedPhotos[currentIndex + 1])
  }
  const goPrev = () => {
    if (currentIndex > 0)
      setSelected(displayedPhotos[currentIndex - 1])
  }

  // ✅ Hook called before any conditional returns
  const swipeHandlers = useSwipe(goNext, goPrev, () => setSelected(null))

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('galleries').select('*').eq('slug', slug).single()
      setGallery(data)
      setLoading(false)
    }
    fetchGallery()
  }, [slug])

  const handleUnlock = async () => {
    if (password === gallery.client_password) {
      const { data: photosData } = await supabase
        .from('photos').select('*').eq('gallery_id', gallery.id)
        .order('created_at', { ascending: true })
      const { data: setsData } = await supabase
        .from('sets').select('*').eq('gallery_id', gallery.id)
        .order('order_index', { ascending: true })
      const { data: favsData } = await supabase
        .from('favourites').select('*').eq('gallery_id', gallery.id)
      setPhotos(photosData || [])
      setSets(setsData || [])
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
      body: JSON.stringify({ galleryId: gallery.id, photoId: photo.id, action: isFav ? 'remove' : 'add' })
    })
    setFavourites(prev => isFav ? prev.filter(id => id !== photo.id) : [...prev, photo.id])
  }

  // ✅ Conditional returns AFTER all hooks
  if (loading) return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center">
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
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🔒</span>
        </div>
        <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-2">Private Gallery</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-3xl md:text-4xl font-bold mb-2">{gallery.name}</h1>
        {gallery.event_date && (
          <p className="text-gray-500 text-sm mb-2">
            📅 {new Date(gallery.event_date).toLocaleDateString('en-KE', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        )}
        <p className="text-gray-500 mb-8 text-sm">Enter your password to view your photos</p>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-5">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <input type="password" placeholder="Enter password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUnlock()}
          className="w-full glass rounded-2xl px-5 py-4 mb-4 outline-none text-center text-white placeholder-gray-600 text-sm" />
        <button onClick={handleUnlock}
          className="w-full py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
          <span className="relative z-10">View My Photos →</span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
        </button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Cover Hero */}
      {gallery.cover_image && (
        <div className="relative w-full h-64 sm:h-80 md:h-[480px] overflow-hidden">
          <img src={`/api/photo?key=${gallery.cover_image}`} alt="Cover"
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/30 to-transparent" />
          <div className="absolute bottom-6 md:bottom-10 left-5 md:left-10 right-5">
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-2">Gallery</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold">{gallery.name}</h1>
            {gallery.event_date && (
              <p className="text-gray-300 mt-2 text-sm">
                📅 {new Date(gallery.event_date).toLocaleDateString('en-KE', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            )}
            <p className="text-gray-400 mt-1 text-sm">{photos.length} photos · {sets.length} sections</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">

        {!gallery.cover_image && (
          <div className="mb-8">
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-2">Gallery</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl md:text-5xl font-bold">{gallery.name}</h1>
            {gallery.event_date && (
              <p className="text-gray-400 mt-2 text-sm">
                📅 {new Date(gallery.event_date).toLocaleDateString('en-KE', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            )}
            <p className="text-gray-500 mt-1 text-sm">{photos.length} photos · {sets.length} sections</p>
          </div>
        )}

        {/* Message */}
        {gallery.message && (
          <div className="glass rounded-2xl p-5 md:p-6 mb-6">
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">💌 A message from your photographer</p>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{gallery.message}</p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex justify-between items-center gap-3 mb-6 flex-wrap">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            <button onClick={() => { setActiveSet('all'); setShowFavs(false) }}
              className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${activeSet === 'all' && !showFavs ? 'bg-[#c9a84c] text-black' : 'glass text-gray-400 hover:text-white'}`}>
              All ({photos.length})
            </button>
            {sets.map(set => (
              <button key={set.id} onClick={() => { setActiveSet(set.id); setShowFavs(false) }}
                className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${activeSet === set.id && !showFavs ? 'bg-[#c9a84c] text-black' : 'glass text-gray-400 hover:text-white'}`}>
                {set.name} ({photos.filter(p => p.set_id === set.id).length})
              </button>
            ))}
            <button onClick={() => { setShowFavs(true); setActiveSet('all') }}
              className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${showFavs ? 'bg-[#c9a84c] text-black' : 'glass text-gray-400 hover:text-white'}`}>
              ❤️ ({favourites.length})
            </button>
          </div>
          <a href={`/api/download-all?galleryId=${gallery.id}&galleryName=${encodeURIComponent(gallery.name)}`}
            className="glass px-3 py-2 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition whitespace-nowrap">
            ⬇️ Download All
          </a>
        </div>

        {/* Photos */}
        {displayedPhotos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm">
              {showFavs ? 'No favourites yet — heart some photos!' : 'No photos in this section'}
            </p>
          </div>
        ) : activeSet === 'all' && !showFavs && sets.length > 0 ? (
          <div className="space-y-10">
            {sets.map(set => {
              const setPhotos = photos.filter(p => p.set_id === set.id)
              if (setPhotos.length === 0) return null
              return (
                <div key={set.id}>
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif" }}
                        className="text-xl md:text-2xl font-bold">{set.name}</h2>
                      {set.description && <p className="text-gray-500 text-sm mt-0.5">{set.description}</p>}
                      <p className="text-[#c9a84c] text-xs mt-1">{setPhotos.length} photos</p>
                    </div>
                    <div className="flex-1 h-px bg-gray-800" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                    {setPhotos.map(photo => (
                      <PhotoCard key={photo.id} photo={photo}
                        isFav={favourites.includes(photo.id)}
                        onToggleFav={() => toggleFavourite(photo)}
                        onClick={() => setSelected(photo)} />
                    ))}
                  </div>
                </div>
              )
            })}
            {photos.filter(p => !p.set_id).length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif" }}
                      className="text-xl font-bold text-gray-400">More Photos</h2>
                    <p className="text-[#c9a84c] text-xs mt-1">{photos.filter(p => !p.set_id).length} photos</p>
                  </div>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                  {photos.filter(p => !p.set_id).map(photo => (
                    <PhotoCard key={photo.id} photo={photo}
                      isFav={favourites.includes(photo.id)}
                      onToggleFav={() => toggleFavourite(photo)}
                      onClick={() => setSelected(photo)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {displayedPhotos.map(photo => (
              <PhotoCard key={photo.id} photo={photo}
                isFav={favourites.includes(photo.id)}
                onToggleFav={() => toggleFavourite(photo)}
                onClick={() => setSelected(photo)} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 backdrop-blur-sm"
          {...swipeHandlers}>
          <button onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-[#c9a84c] transition z-10">✕</button>
          {currentIndex > 0 && (
            <button onClick={goPrev}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-[#c9a84c] transition z-10">←</button>
          )}
          <img src={`/api/photo?key=${selected.b2_key}`} alt={selected.filename}
            className="max-w-full max-h-full object-contain rounded-xl px-14 md:px-20" />
          {currentIndex < displayedPhotos.length - 1 && (
            <button onClick={goNext}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-[#c9a84c] transition z-10">→</button>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <div className="glass rounded-full px-4 py-2">
              <p className="text-white text-xs">{currentIndex + 1} / {displayedPhotos.length}</p>
            </div>
            <button onClick={() => toggleFavourite(selected)}
              className="glass rounded-full w-9 h-9 flex items-center justify-center text-lg hover:scale-110 transition">
              {favourites.includes(selected.id) ? '❤️' : '🤍'}
            </button>
          </div>
          <p className="absolute bottom-14 left-1/2 -translate-x-1/2 text-gray-700 text-xs md:hidden">Swipe to navigate</p>
        </div>
      )}
    </main>
  )
}