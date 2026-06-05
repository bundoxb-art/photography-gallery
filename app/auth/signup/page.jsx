'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

const avatarSeeds = ['Felix', 'Aneka', 'Jasper', 'Lumi', 'Zara', 'Milo']

const glassStyle = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '24px',
  padding: '40px'
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(8px)'
}

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
    <main className="min-h-screen flex relative overflow-hidden">

      {/* Animated gradient background */}
      <div className="fixed inset-0 animate-gradient"
        style={{ background: 'linear-gradient(135deg, #080818, #0a0208, #080808, #0d0810, #0a0a08)', backgroundSize: '400% 400%' }} />

      {/* Color orbs */}
      <div className="fixed top-1/3 right-1/4 w-96 h-96 rounded-full animate-orb-1 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 rounded-full animate-orb-2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
      <div className="fixed top-1/2 left-1/2 w-64 h-64 rounded-full animate-orb-3 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12"
        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        <div className="absolute inset-0 animate-orb-1 opacity-30"
          style={{ background: 'radial-gradient(circle at 30% 50%, rgba(201,168,76,0.15) 0%, transparent 60%)' }} />

        <div className="relative z-10"><Logo href="/" size="sm" /></div>

        <div className="relative z-10">
          <div className="w-12 h-px bg-[#c9a84c] mb-8" />
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-3xl font-bold text-white leading-tight mb-10">
            Everything you need<br />to <span className="text-[#c9a84c]">impress clients.</span>
          </h2>
          <div className="space-y-4">
            {[
              { icon: '🔒', title: 'Password Protected Galleries', color: 'rgba(201,168,76,0.1)' },
              { icon: '⬇️', title: 'One-Click ZIP Download', color: 'rgba(59,130,246,0.1)' },
              { icon: '❤️', title: 'Client Favourites', color: 'rgba(239,68,68,0.1)' },
              { icon: '🗂️', title: 'Gallery Sections', color: 'rgba(139,92,246,0.1)' },
              { icon: '💌', title: 'Personal Messages', color: 'rgba(16,185,129,0.1)' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ background: f.color, border: '1px solid rgba(255,255,255,0.06)' }}>
                  {f.icon}
                </div>
                <p className="text-gray-300 text-sm">{f.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-600 text-xs">🔒 Free forever · No credit card required · Kenya 🇰🇪</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 md:px-8 py-12 relative z-10">

        <div className="lg:hidden mb-8 flex justify-center"><Logo href="/" size="md" /></div>

        <div className="w-full max-w-md">

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8 opacity-0 animate-fade-up">
            {[1, 2].map((s, i) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? 'text-black' : 'text-gray-500'}`}
                  style={{ background: step >= s ? 'linear-gradient(135deg, #c9a84c, #d4b460)' : 'rgba(255,255,255,0.06)', border: step >= s ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                  {s}
                </div>
                {i < 1 && <div className="flex-1 h-px transition-all duration-500"
                  style={{ background: step >= 2 ? '#c9a84c' : 'rgba(255,255,255,0.08)' }} />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <div className="opacity-0 animate-fade-up delay-100" style={glassStyle}>
              <div className="mb-8">
                <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-2xl md:text-3xl font-bold text-white mb-2">Create account</h1>
                <p className="text-gray-500 text-sm">Join photographers delivering stunning galleries</p>
              </div>

              {error && (
                <div className="rounded-2xl px-4 py-3 mb-6"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Full Name</label>
                  <input type="text" placeholder="John Kamau" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-2xl px-5 py-4 outline-none text-sm text-white placeholder-gray-600 transition-all"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-2xl px-5 py-4 outline-none text-sm text-white placeholder-gray-600 transition-all"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleNext()}
                      className="w-full rounded-2xl px-5 py-4 outline-none text-sm text-white placeholder-gray-600 pr-14 transition-all"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#c9a84c] transition text-sm">
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={handleNext}
                className="w-full mt-8 py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group transition-all"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460, #e8c97a)' }}>
                <span className="relative z-10">Continue → Pick Your Avatar</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              </button>

              <p className="text-center text-gray-500 text-sm mt-6">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#c9a84c] hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          ) : (
            <div className="opacity-0 animate-fade-up delay-100" style={glassStyle}>
              <div className="mb-8 text-center">
                <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-2xl md:text-3xl font-bold text-white mb-2">Pick your avatar</h1>
                <p className="text-gray-500 text-sm">Choose how you appear on PicDelivr</p>
              </div>

              {/* Selected avatar animated */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ background: '#c9a84c', animationDuration: '2s' }} />
                  <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#c9a84c]/40 animate-spin"
                    style={{ animationDuration: '8s' }} />
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#c9a84c] animate-float bg-[#111]">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}&backgroundColor=111111`}
                      alt="Selected Avatar" className="w-full h-full" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
                    {name.split(' ')[0]} ✓
                  </div>
                </div>
              </div>

              {/* Avatar grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {avatarSeeds.map(seed => (
                  <button key={seed} onClick={() => setSelectedAvatar(seed)}
                    className="relative rounded-2xl p-2 transition-all duration-300 overflow-hidden group"
                    style={{
                      border: `2px solid ${selectedAvatar === seed ? '#c9a84c' : 'rgba(255,255,255,0.06)'}`,
                      background: selectedAvatar === seed ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
                      transform: selectedAvatar === seed ? 'scale(1.05)' : 'scale(1)'
                    }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=111111`}
                      alt={seed} className="w-full aspect-square" />
                    {selectedAvatar === seed && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#c9a84c' }}>
                        <span className="text-black text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {error && (
                <div className="rounded-2xl px-4 py-3 mb-4"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl text-gray-400 hover:text-white text-sm transition"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  ← Back
                </button>
                <button onClick={handleSignup} disabled={loading}
                  className="flex-1 py-4 rounded-2xl font-semibold text-sm text-black relative overflow-hidden group disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #d4b460)' }}>
                  <span className="relative z-10">{loading ? 'Creating...' : 'Create Account →'}</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
