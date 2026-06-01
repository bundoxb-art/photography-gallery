'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetMode, setResetMode] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email address first'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) setError(error.message)
    else setResetSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#080808] flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12"
        style={{ background: '#080808' }}>

        {/* Slideshow */}
        <SlideshowPanel />

        {/* Left panel logo */}
        <div className="relative z-20">
          <Logo href="/" size="sm" />
        </div>

        {/* Center quote */}
        <div className="relative z-20">
          <div className="w-12 h-px bg-[#c9a84c] mb-8" />
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-bold text-white leading-tight mb-6">
            "Every photo tells<br />
            <span className="text-[#c9a84c]">a story worth</span><br />
            preserving."
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Trusted by photographers across Kenya to deliver stunning galleries to their clients.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-20 flex gap-8">
          {[
            { value: '100%', label: 'Free to Start' },
            { value: 'HD', label: 'Full Quality' },
            { value: 'KES', label: 'Local Pricing' },
          ].map((stat, i) => (
            <div key={i}>
              <p style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl font-bold text-[#c9a84c]">{stat.value}</p>
              <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative">

        {/* Grain */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />

        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex justify-center">
          <Logo href="/" size="md" />
        </div>

        <div className="relative z-10 w-full max-w-md">

          {resetSent ? (
            <div className="text-center animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📬</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-gray-500 text-sm mb-8">
                Reset link sent to <span className="text-white">{email}</span>
              </p>
              <button onClick={() => { setResetSent(false); setResetMode(false) }}
                className="text-[#c9a84c] text-sm hover:underline">
                ← Back to Login
              </button>
            </div>
          ) : (
            <>
              <div className="opacity-0 animate-fade-up mb-8">
                <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl font-bold text-white mb-2">
                  {resetMode ? 'Reset Password' : 'Welcome back'}
                </h1>
                <p className="text-gray-500 text-sm">
                  {resetMode ? 'Enter your email to receive a reset link' : 'Sign in to manage your galleries'}
                </p>
              </div>

              {error && (
                <div className="opacity-0 animate-fade-up delay-100 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4 opacity-0 animate-fade-up delay-200">

                {/* Email */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600"
                  />
                </div>

                {/* Password */}
                {!resetMode && (
                  <div>
                    <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600 pr-14"
                      />
                      <button type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#c9a84c] transition text-sm">
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    <div className="text-right mt-2">
                      <button onClick={() => { setResetMode(true); setError('') }}
                        className="text-gray-600 hover:text-[#c9a84c] text-xs transition">
                        Forgot password?
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="opacity-0 animate-fade-up delay-300 mt-8 space-y-3">
                <button
                  onClick={resetMode ? handleForgotPassword : handleLogin}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-semibold text-sm transition disabled:opacity-50 relative overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
                  <span className="relative z-10 text-black">
                    {loading ? 'Please wait...' : resetMode ? 'Send Reset Link →' : 'Sign In →'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </button>

                {resetMode && (
                  <button onClick={() => { setResetMode(false); setError('') }}
                    className="w-full py-4 rounded-2xl glass text-gray-400 hover:text-white text-sm transition">
                    ← Back to Login
                  </button>
                )}
              </div>

              {!resetMode && (
                <p className="opacity-0 animate-fade-up delay-400 text-center text-gray-600 text-sm mt-8">
                  New to PicDelivr?{' '}
                  <Link href="/auth/signup" className="text-[#c9a84c] hover:underline font-medium">
                    Create free account
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    category: 'Wedding',
    caption: 'Nairobi, Kenya'
  },
  {
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    category: 'Wedding',
    caption: 'Mombasa Coast'
  },
  {
    url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    category: 'Wildlife',
    caption: 'Maasai Mara'
  },
  {
    url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    category: 'Wildlife',
    caption: 'Amboseli National Park'
  },
  {
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    category: 'Portrait',
    caption: 'Studio Session'
  },
  {
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    category: 'Wedding',
    caption: 'Lake Nakuru'
  },
]

function SlideshowPanel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length)
        setFading(false)
      }, 800)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Background image */}
      <div className="absolute inset-0 z-0 transition-opacity duration-[800ms]"
        style={{ opacity: fading ? 0 : 1 }}>
        <img
          src={slides[current].url}
          alt={slides[current].caption}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.5) 50%, rgba(8,8,8,0.85) 100%)' }} />
      </div>

      {/* Photo label */}
      <div className="absolute top-6 right-6 z-20"
        style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.8s' }}>
        <div className="glass rounded-full px-3 py-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
          <span className="text-white text-xs font-medium">{slides[current].category}</span>
          <span className="text-gray-400 text-xs">· {slides[current].caption}</span>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300"
            style={{
              width: i === current ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? '#c9a84c' : 'rgba(255,255,255,0.3)'
            }} />
        ))}
      </div>
    </>
  )
}
