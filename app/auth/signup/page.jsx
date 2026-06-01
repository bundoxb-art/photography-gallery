'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#080808] flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111008 50%, #0d0b04 100%)' }}>

        {/* Floating orbs */}
        <div className="absolute top-32 right-20 w-72 h-72 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)', animationDelay: '3s' }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/"
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl font-bold text-white">
            Pic<span className="text-[#c9a84c]">Delivr</span>
          </Link>
        </div>

        {/* Features list */}
        <div className="relative z-10">
          <div className="w-12 h-px bg-[#c9a84c] mb-8" />
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-3xl font-bold text-white leading-tight mb-10">
            Everything you need<br />
            to <span className="text-[#c9a84c]">impress clients.</span>
          </h2>
          <div className="space-y-5">
            {[
              { icon: '🔒', title: 'Password Protected Galleries', desc: 'Private access for each client' },
              { icon: '⬇️', title: 'One-Click ZIP Download', desc: 'All photos downloaded instantly' },
              { icon: '❤️', title: 'Client Favourites', desc: 'Clients shortlist their best shots' },
              { icon: '🖼️', title: 'Stunning Cover Images', desc: 'Hero photo for every gallery' },
              { icon: '💌', title: 'Personal Messages', desc: 'Add a heartfelt note to each delivery' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0 text-sm">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{f.title}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="relative z-10">
          <p className="text-gray-600 text-xs">
            🔒 Free forever · No credit card required · Built in Kenya 🇰🇪
          </p>
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
        <div className="lg:hidden mb-10">
          <Link href="/"
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl font-bold text-white">
            Pic<span className="text-[#c9a84c]">Delivr</span>
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-md">

          <div className="opacity-0 animate-fade-up mb-8">
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">
              Join photographers delivering stunning galleries
            </p>
          </div>

          {error && (
            <div className="opacity-0 animate-fade-up delay-100 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4 opacity-0 animate-fade-up delay-200">

            {/* Name */}
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Kamau"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600"
              />
            </div>

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
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                  className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600 pr-14"
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#c9a84c] transition text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          <div className="opacity-0 animate-fade-up delay-300 mt-8 space-y-3">
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-sm transition disabled:opacity-50 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
              <span className="relative z-10 text-black">
                {loading ? 'Creating Account...' : 'Create Free Account →'}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </button>
          </div>

          <p className="opacity-0 animate-fade-up delay-400 text-center text-gray-600 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#c9a84c] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
