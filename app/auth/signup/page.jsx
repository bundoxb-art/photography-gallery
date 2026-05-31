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
    if (!name || !email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4">

      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/"
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl font-bold">
            Pic<span className="text-[#c9a84c]">Delivr</span>
          </Link>
        </div>

        <div className="border border-gray-800 rounded-3xl p-8 bg-[#0d0d0d]">

          <h1 className="text-2xl font-bold mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mb-7">
            Start delivering photos professionally
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Kamau"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#151515] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-[#c9a84c] transition text-sm"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#151515] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-[#c9a84c] transition text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                className="w-full bg-[#151515] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-[#c9a84c] transition text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition text-sm">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#c9a84c] text-black py-3 rounded-xl font-semibold hover:bg-[#d4b460] transition disabled:opacity-50 text-sm">
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#c9a84c] hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Trust note */}
        <p className="text-center text-gray-600 text-xs mt-6">
          🔒 Free forever · No credit card required
        </p>
      </div>
    </main>
  )
}