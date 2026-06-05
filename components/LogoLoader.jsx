'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function LogoLoader({ onComplete }) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true)
      setTimeout(onComplete, 800)
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080808] transition-opacity duration-700 ${hiding ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full animate-orb-1"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-orb-2"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full animate-orb-3 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 animate-logo-reveal flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: '#c9a84c', animationDuration: '2s' }} />
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#c9a84c]/50 relative bg-[#111] flex items-center justify-center">
            <Image src="/logo.svg" alt="PicDelivr" width={80} height={80} />
          </div>
        </div>
        <div className="text-center">
          <h1 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-bold text-white">
            Pic<span className="text-[#c9a84c]">Delivr</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">
            Professional Photo Delivery
          </p>
        </div>
        {/* Loading bar */}
        <div className="w-32 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#c9a84c] rounded-full animate-[loadBar_2s_ease_forwards]"
            style={{
              animation: 'loadBar 2s ease forwards',
            }} />
        </div>
      </div>

      <style>{`
        @keyframes loadBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}