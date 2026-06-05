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
        className="absolute top-2 right-2 text-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-125 drop-shadow-lg">
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
  const [unlocking, setUnlocking] = useState(false)

  const getDisplayPhotos = () => {
    if (showFavs) return photos.filter(p => favourites.includes(p.id))
    if (activeSet !== 'all') return photos.filter(p => p.set_id === activeSet)
    return photos
  }

  const displayedPhotos = getDisplayPhotos()
  const currentIndex = displayedPhotos.findIndex(p => p.id === selected?.id)
  const goNext = () => { if (currentIndex < displayedPhotos.length - 1) setSelected(displayedPhotos[currentIndex + 1]) }
  const goPrev = () => { if (currentIndex > 0) setSelected(displayedPhotos[currentIndex - 1]) }
  const swipeHandlers = useSwipe(goNext, goPrev, () => setSelected(null))

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from('galleries').select('*').eq('slug', slug).single()
      setGallery(data)
      setLoading(false)
    }
    fetchGallery()
  }, [slug])

  const handleUnlock = async () => {
    if (password !== gallery.client_password) {
      setError('Incorrect password. Please try again.')
      return
    }
    setUnlocking(true)
    const [{ data: photosData }, { data: setsData }, { data: favsData }] = await Promise.all([
      supabase.from('photos').select('*').eq('gallery_id', gallery.id).order('created_at', { ascending: true }),
      supabase.from('sets').select('*').eq('gallery_id', gallery.id).order('order_index', { ascending: true }),
      supabase.from('favourites').select('*').eq('gallery_id', gallery.id)
    ])
    setPhotos(photosData || [])
    setSets(setsData || [])
    setFavourites(favsData?.map(f => f.photo_id) || [])
    setTimeout(() => { setUnlocked(true); setUnlocking(false) }, 600)
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

  if (loading) return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#c9a84c] border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-xs uppercase tracking-widest animate-pulse">Loading your gallery</p>
      </div>
    </main>
  )

  if (!gallery) return (
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-white font-semibold mb-2">Gallery not found</p>
        <p className="text-gray-500 text-sm">This gallery may have been removed or the link is incorrect.</p>
      </div>
    </main>
  )

  if (!unlocked) return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">

      {/* Background — blurred cover or gradient */}
      {gallery.cover_image ? (
        <div className="fixed inset-0 z-0">
          <img src={`/api/photo?key=${gallery.cover_image}`} alt="bg"
            className="w-full h-full object-cover scale-110"
            style={{ filter: 'blur(25px)', transform: 'scale(1.15)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.85), rgba(8,8,8,0.75), rgba(8,8,8,0.9))' }} />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 animate-gradient"
          style={{ background: 'linear-gradient(135deg, #0a0208, #080818, #0a0a0a, #120810)', backgroundSize: '400% 400%' }} />
      )}

      {/* Floating orbs */}
      <div className="fixed top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full animate-orb-1 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-48 md:w-80 h-48 md:h-80 rounded-full animate-orb-2 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />

      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* Lock Card */}
      <div className="relative z-10 w-full max-w-sm md:max-w-md opacity-0 animate-fade-up">
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '32px',
          padding: '40px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}>

          {/* Lock icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping opacity-10"
                style={{ background: '#c9a84c', animationDuration: '3s' }} />
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))', border: '1px solid rgba(201,168,76,0.3)' }}>
                <span className="text-2xl md:text-3xl">🔐</span>
              </div>
            </div>
          </div>

          {/* Label */}
          <div className="text-center mb-6">
            <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] mb-3">Private Gallery</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
              {gallery.name}
            </h1>
            {gallery.event_date && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="text-xs">📅</span>
                <span className="text-[#c9a84c] text-xs font-medium">
                  {new Date(gallery.event_date).toLocaleDateString('en-KE', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
            )}
            <p className="text-gray-500 text-sm leading-relaxed">
              Your exclusive gallery is ready. Enter your password to unlock your memories. ✨
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/40" />
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl px-4 py-3 mb-4"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Password input */}
          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              className="w-full rounded-2xl px-5 py-4 outline-none text-center text-white placeholder-gray-600 text-sm transition-all tracking-widest"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${password.length > 0 ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
                backdropFilter: 'blur(8px)',
                letterSpacing: password.length > 0 ? '0.2em' : 'normal'
              }}
            />
          </div>

          {/* Unlock button */}
          <button onClick={handleUnlock} disabled={!password || unlocking}
            className="w-full py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460, #e8c97a)' }}>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {unlocking ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>🔓 Unlock My Gallery</>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </button>

          {/* Footer */}
          <p className="text-center text-gray-700 text-xs mt-6">
            Delivered with ❤️ via{' '}
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-gray-500">
              Pic<span className="text-[#c9a84c]">Delivr</span>
            </span>
          </p>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* Cover Hero */}
      {gallery.cover_image && (
        <div className="relative w-full h-64 sm:h-80 md:h-[500px] overflow-hidden">
          <img src={`/api/photo?key=${gallery.cover_image}`} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,1) 100%)' }} />
          <div className="absolute bottom-6 md:bottom-10 left-5 md:left-10 right-5">
            <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] mb-2">Your Gallery</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold drop-shadow-2xl mb-2">{gallery.name}</h1>
            {gallery.event_date && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.25)', backdropFilter: 'blur(8px)' }}>
                <span className="text-xs">📅</span>
                <span className="text-[#c9a84c] text-xs font-medium">
                  {new Date(gallery.event_date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">

        {!gallery.cover_image && (
          <div className="mb-8 opacity-0 animate-fade-up">
            <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] mb-2">Your Gallery</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl md:text-5xl font-bold mb-2">{gallery.name}</h1>
            {gallery.event_date && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="text-xs">📅</span>
                <span className="text-[#c9a84c] text-xs font-medium">
                  {new Date(gallery.event_date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        {gallery.message && (
          <div className="rounded-2xl p-5 md:p-6 mb-6 opacity-0 animate-fade-up delay-100"
            style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(12px)' }}>
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">💌 A message from your photographer</p>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base italic">"{gallery.message}"</p>
          </div>
        )}

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6 opacity-0 animate-fade-up delay-200">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs">📸</span>
            <span className="text-gray-400 text-xs">{photos.length} photos</span>
          </div>
          {sets.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xs">🗂️</span>
              <span className="text-gray-400 text-xs">{sets.length} sections</span>
            </div>
          )}
          {favourites.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <span className="text-xs">❤️</span>
              <span className="text-[#c9a84c] text-xs">{favourites.length} favourited</span>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center gap-3 mb-6 flex-wrap opacity-0 animate-fade-up delay-300">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            <button onClick={() => { setActiveSet('all'); setShowFavs(false) }}
              className="px-3 md:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300"
              style={{ background: activeSet === 'all' && !showFavs ? 'linear-gradient(135deg, #c9a84c, #d4b460)' : 'rgba(255,255,255,0.04)', border: '1px solid', borderColor: activeSet === 'all' && !showFavs ? 'transparent' : 'rgba(255,255,255,0.06)', color: activeSet === 'all' && !showFavs ? '#000' : '#9ca3af' }}>
              All ({photos.length})
            </button>
            {sets.map(set => (
              <button key={set.id} onClick={() => { setActiveSet(set.id); setShowFavs(false) }}
                className="px-3 md:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300"
                style={{ background: activeSet === set.id && !showFavs ? 'linear-gradient(135deg, #c9a84c, #d4b460)' : 'rgba(255,255,255,0.04)', border: '1px solid', borderColor: activeSet === set.id && !showFavs ? 'transparent' : 'rgba(255,255,255,0.06)', color: activeSet === set.id && !showFavs ? '#000' : '#9ca3af' }}>
                {set.name} ({photos.filter(p => p.set_id === set.id).length})
              </button>
            ))}
            <button onClick={() => { setShowFavs(true); setActiveSet('all') }}
              className="px-3 md:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300"
              style={{ background: showFavs ? 'linear-gradient(135deg, #c9a84c, #d4b460)' : 'rgba(255,255,255,0.04)', border: '1px solid', borderColor: showFavs ? 'transparent' : 'rgba(255,255,255,0.06)', color: showFavs ? '#000' : '#9ca3af' }}>
              ❤️ ({favourites.length})
            </button>
          </div>
          <a href={`/api/download-all?galleryId=${gallery.id}&galleryName=${encodeURIComponent(gallery.name)}`}
            className="px-3 md:px-4 py-2 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition whitespace-nowrap"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
            ⬇️ Download All
          </a>
        </div>

        {/* Photos */}
        {displayedPhotos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-sm">{showFavs ? 'No favourites yet — heart some photos!' : 'No photos in this section'}</p>
          </div>
        ) : activeSet === 'all' && !showFavs && sets.length > 0 ? (
          <div className="space-y-12">
            {sets.map(set => {
              const setPhotos = photos.filter(p => p.set_id === set.id)
              if (setPhotos.length === 0) return null
              return (
                <div key={set.id} className="opacity-0 animate-fade-up">
                  <div className="flex items-center gap-4 mb-5">
                    <div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif" }}
                        className="text-xl md:text-2xl font-bold text-white">{set.name}</h2>
                      {set.description && <p className="text-gray-500 text-sm mt-0.5">{set.description}</p>}
                      <p className="text-[#c9a84c] text-xs mt-1 font-medium">{setPhotos.length} photos</p>
                    </div>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)' }} />
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
              <div className="opacity-0 animate-fade-up">
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif" }}
                      className="text-xl font-bold text-gray-400">More Photos</h2>
                    <p className="text-[#c9a84c] text-xs mt-1">{photos.filter(p => !p.set_id).length} photos</p>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)' }} />
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

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-gray-700 text-xs">
            Delivered with ❤️ via{' '}
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-gray-500">
              Pic<span className="text-[#c9a84c]">Delivr</span>
            </span>
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          {...swipeHandlers}>
          <button onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-[#c9a84c] transition z-10"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>✕</button>
          {currentIndex > 0 && (
            <button onClick={goPrev}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-[#c9a84c] transition z-10"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>←</button>
          )}
          <img src={`/api/photo?key=${selected.b2_key}`} alt={selected.filename}
            className="max-w-full max-h-full object-contain rounded-2xl px-14 md:px-20 opacity-0 animate-fade-up" />
          {currentIndex < displayedPhotos.length - 1 && (
            <button onClick={goNext}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-[#c9a84c] transition z-10"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>→</button>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <div className="rounded-full px-4 py-2" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
              <p className="text-white text-xs">{currentIndex + 1} / {displayedPhotos.length}</p>
            </div>
            <button onClick={() => toggleFavourite(selected)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:scale-125 transition"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              {favourites.includes(selected.id) ? '❤️' : '🤍'}
            </button>
          </div>
          <p className="absolute bottom-14 left-1/2 -translate-x-1/2 text-gray-700 text-xs md:hidden">Swipe to navigate</p>
        </div>
      )}
    </main>
  )
}