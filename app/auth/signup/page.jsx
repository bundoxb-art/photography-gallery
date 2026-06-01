'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

const avatarSeeds = ['Felix', 'Aneka', 'Jasper', 'Lumi', 'Zara', 'Milo']

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(avatarSeeds[0])
  const [step, setStep] = useState(1)

  const avatarUrl = (seed) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=0a0a0a&clothingColor=c9a84c`

  const handleNext = () => {
    if (!name || !email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    setStep(2)
  }

  const handleSignup = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, avatar: selectedAvatar } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#080808] flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111008 50%, #0d0b04 100%)' }}>

        <div className="absolute top-32 right-20 w-72 h-72 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)', animationDelay: '3s' }} />

        <div className="relative z-10">
          <Logo href="/" size="sm" />
        </div>

        <div className="relative z-10">
          <div className="w-12 h-px bg-[#c9a84c] mb-8" />
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-3xl font-bold text-white leading-tight mb-10">
            Everything you need<br />
            to <span className="text-[#c9a84c]">impress clients.</span>
          </h2>
          <div className="space-y-5">
            {[
              { icon: '🔒', title: 'Password Protected Galleries' },
              { icon: '⬇️', title: 'One-Click ZIP Download' },
              { icon: '❤️', title: 'Client Favourites' },
              { icon: '🖼️', title: 'Stunning Cover Images' },
              { icon: '💌', title: 'Personal Messages' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center text-sm">
                  {f.icon}
                </div>
                <p className="text-white text-sm font-medium">{f.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-600 text-xs">🔒 Free forever · No credit card required · Built in Kenya 🇰🇪</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative">
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

        <div className="lg:hidden mb-10 flex justify-center">
          <Logo href="/" size="md" />
        </div>

        <div className="relative z-10 w-full max-w-md">

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-[#c9a84c] text-black' : 'glass text-gray-500'}`}>1</div>
            <div className={`flex-1 h-px transition-all ${step >= 2 ? 'bg-[#c9a84c]' : 'bg-gray-800'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-[#c9a84c] text-black' : 'glass text-gray-500'}`}>2</div>
          </div>

          {step === 1 ? (
            <>
              <div className="opacity-0 animate-fade-up mb-8">
                <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl font-bold text-white mb-2">Create account</h1>
                <p className="text-gray-500 text-sm">Join photographers delivering stunning galleries powerd by ELITE</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4 opacity-0 animate-fade-up delay-100">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Full Name</label>
                  <input type="text" placeholder="John Kamau" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleNext()}
                      className="w-full glass rounded-2xl px-5 py-4 outline-none focus:border-[#c9a84c]/50 transition text-sm text-white placeholder-gray-600 pr-14" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#c9a84c] transition text-sm">
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="opacity-0 animate-fade-up delay-200 mt-8">
                <button onClick={handleNext}
                  className="w-full py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
                  <span className="relative z-10">Continue → Pick Your Avatar</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </div>

              <p className="text-center text-gray-600 text-sm mt-6">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#c9a84c] hover:underline font-medium">Sign in</Link>
              </p>
            </>
          ) : (
            <>
              <div className="opacity-0 animate-fade-up mb-8 text-center">
                <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl font-bold text-white mb-2">Pick your avatar</h1>
                <p className="text-gray-500 text-sm">Choose how you appear on PicDelivr</p>
              </div>

              {/* Selected avatar - animated */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: 'rgba(201,168,76,0.2)', animationDuration: '2s' }} />
                  {/* Rotating ring */}
                  <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#c9a84c]/40 animate-spin"
                    style={{ animationDuration: '8s' }} />
                  {/* Avatar */}
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#c9a84c] animate-float bg-[#111]">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}&backgroundColor=111111`}
                      alt="Selected Avatar"
                      className="w-full h-full"
                    />
                  </div>
                  {/* Name badge */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {name.split(' ')[0]} ✓
                  </div>
                </div>
              </div>

              {/* Avatar grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {avatarSeeds.map((seed) => (
                  <button key={seed} onClick={() => setSelectedAvatar(seed)}
                    className={`relative rounded-2xl p-2 border-2 transition-all duration-300 overflow-hidden group ${selectedAvatar === seed ? 'border-[#c9a84c] bg-[#c9a84c]/10 scale-105' : 'border-gray-800 hover:border-[#c9a84c]/40 bg-[#111]'}`}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=111111`}
                      alt={seed}
                      className="w-full aspect-square"
                    />
                    {selectedAvatar === seed && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#c9a84c] rounded-full flex items-center justify-center">
                        <span className="text-black text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl glass text-gray-400 hover:text-white text-sm transition">
                  ← Back
                </button>
                <button onClick={handleSignup} disabled={loading}
                  className="flex-1 py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
                  <span className="relative z-10">
                    {loading ? 'Creating...' : 'Create Account →'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
