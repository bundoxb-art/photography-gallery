'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email address first')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      setError(error.message)
    } else {
      setResetSent(true)
    }
    setLoading(false)
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

          {resetSent ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-4">📬</p>
              <h2 className="text-xl font-bold mb-2">Check your email</h2>
              <p className="text-gray-400 text-sm">
                We sent a password reset link to <span className="text-white">{email}</span>
              </p>
              <button
                onClick={() => { setResetSent(false); setResetMode(false) }}
                className="mt-6 text-[#c9a84c] text-sm hover:underline">
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {resetMode ? 'Reset Password' : 'Welcome Back'}
              </h1>
              <p className="text-gray-500 text-sm mb-7">
                {resetMode ? 'Enter your email to receive a reset link' : 'Login to your photographer account'}
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

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
              {!resetMode && (
                <div className="mb-2">
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
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
              )}

              {/* Forgot password */}
              {!resetMode && (
                <div className="text-right mb-6">
                  <button
                    onClick={() => { setResetMode(true); setError('') }}
                    className="text-[#c9a84c] text-xs hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={resetMode ? handleForgotPassword : handleLogin}
                disabled={loading}
                className="w-full bg-[#c9a84c] text-black py-3 rounded-xl font-semibold hover:bg-[#d4b460] transition disabled:opacity-50 text-sm mt-2">
                {loading ? 'Please wait...' : resetMode ? 'Send Reset Link' : 'Login →'}
              </button>

              {resetMode && (
                <button
                  onClick={() => { setResetMode(false); setError('') }}
                  className="w-full mt-3 border border-gray-800 py-3 rounded-xl text-gray-400 hover:text-white hover:border-gray-600 transition text-sm">
                  Back to Login
                </button>
              )}

              {!resetMode && (
                <p className="text-center text-gray-500 text-sm mt-6">
                  No account yet?{' '}
                  <Link href="/auth/signup" className="text-[#c9a84c] hover:underline">
                    Sign Up Free
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