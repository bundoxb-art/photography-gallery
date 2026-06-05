'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

const slides = [
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', category: 'Wedding', caption: 'Nairobi, Kenya' },
  { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80', category: 'Wedding', caption: 'Mombasa Coast' },
  { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', category: 'Wildlife', caption: 'Maasai Mara' },
  { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80', category: 'Wildlife', caption: 'Amboseli' },
  { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', category: 'Portrait', caption: 'Studio Session' },
]

function SlideshowPanel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => { setCurrent(prev => (prev + 1) % slides.length); setFading(false) }, 800)
    }, 5000)
    return () => clearInterval(timer)
  }, [])
  return (
    <>
      <div className="absolute inset-0 z-0 transition-opacity duration-[800ms]" style={{ opacity: fading ? 0 : 1 }}>
        <img src={slides[current].url} alt={slides[current].caption} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.95) 100%)' }} />
      </div>
      <div className="absolute top-6 right-6 z-20" style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.8s' }}>
        <div className="glass rounded-full px-3 py-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
          <span className="text-white text-xs">{slides[current].category} · {slides[current].caption}</span>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="transition-all duration-300 rounded-full"
            style={{ width: i === current ? '24px' : '6px', height: '6px', background: i === current ? '#c9a84c' : 'rgba(255,255,255,0.3)' }} />
        ))}
      </div>
    </>
  )
}

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
    setLoading(true); setError('')
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
    <main className="min-h-screen flex relative overflow-hidden">

      {/* Animated gradient background */}
      <div className="fixed inset-0 animate-gradient"
        style={{ background: 'linear-gradient(135deg, #0a0208, #080818, #0a0a0a, #120810, #080808)', backgroundSize: '400% 400%' }} />

      {/* Color orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full animate-orb-1 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 rounded-full animate-orb-2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
      <div className="fixed top-1/2 right-1/4 w-64 h-64 rounded-full animate-orb-3 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

      {/* LEFT PANEL — slideshow */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        <SlideshowPanel />
        <div className="relative z-20"><Logo href="/" size="sm" /></div>
        <div className="relative z-20">
          <div className="w-12 h-px bg-[#c9a84c] mb-8" />
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-bold text-white leading-tight mb-6">
            "Every photo tells<br /><span className="text-[#c9a84c]">a story worth</span><br />preserving."
          </h2>
          <p className="text-gray-400 text-sm max-w-sm">Trusted by photographers across Kenya.</p>
        </div>
        <div className="relative z-20 flex gap-8">
          {[{ value: '100%', label: 'Free' }, { value: 'HD', label: 'Quality' }, { value: 'KES', label: 'Local' }].map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#c9a84c]">{s.value}</p>
              <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — glassmorphism form */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 md:px-8 py-12 relative z-10">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex justify-center"><Logo href="/" size="md" /></div>

        <div className="w-full max-w-md">

          {resetSent ? (
            <div className="text-center animate-fade-up"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="text-2xl">📬</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-gray-500 text-sm mb-8">Reset link sent to <span className="text-white">{email}</span></p>
              <button onClick={() => { setResetSent(false); setResetMode(false) }} className="text-[#c9a84c] text-sm hover:underline">← Back to Login</button>
            </div>
          ) : (
            <div className="opacity-0 animate-fade-up"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px' }}>

              {/* Header */}
              <div className="mb-8">
                <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {resetMode ? 'Reset Password' : 'Welcome back'}
                </h1>
                <p className="text-gray-500 text-sm">
                  {resetMode ? 'Enter your email to receive a reset link' : 'Sign in to manage your galleries'}
                </p>
              </div>

              {error && (
                <div className="rounded-2xl px-4 py-3 mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-2xl px-5 py-4 outline-none text-sm text-white placeholder-gray-600 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>

                {!resetMode && (
                  <div>
                    <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        className="w-full rounded-2xl px-5 py-4 outline-none text-sm text-white placeholder-gray-600 pr-14 transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
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

              {/* Submit button */}
              <button onClick={resetMode ? handleForgotPassword : handleLogin} disabled={loading}
                className="w-full mt-8 py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460, #e8c97a)' }}>
                <span className="relative z-10">{loading ? 'Please wait...' : resetMode ? 'Send Reset Link →' : 'Sign In →'}</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              </button>

              {resetMode && (
                <button onClick={() => { setResetMode(false); setError('') }}
                  className="w-full mt-3 py-4 rounded-2xl text-gray-400 hover:text-white text-sm transition"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  ← Back to Login
                </button>
              )}

              {!resetMode && (
                <p className="text-center text-gray-500 text-sm mt-6">
                  New to PicDelivr?{' '}
                  <Link href="/auth/signup" className="text-[#c9a84c] hover:underline font-medium">Create free account</Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
