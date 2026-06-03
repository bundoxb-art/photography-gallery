import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-hidden">

      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* Floating orbs */}
      <div className="fixed top-20 left-10 w-48 md:w-96 h-48 md:h-96 rounded-full pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
      <div className="fixed bottom-20 right-10 w-32 md:w-64 h-32 md:h-64 rounded-full pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', animationDelay: '3s' }} />

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-5 md:px-8 py-5">
        <Logo href="/" size="sm" />
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/auth/login"
            className="text-gray-400 hover:text-white transition text-xs md:text-sm font-medium px-3 md:px-4 py-2">
            Login
          </Link>
          <Link href="/auth/signup"
            className="bg-[#c9a84c] text-black px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-[#d4b460] transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-5 pt-12 md:pt-20 pb-16 md:pb-32">
        <div className="inline-block border border-[#c9a84c]/30 rounded-full px-4 py-1 text-[#c9a84c] text-xs font-medium mb-6 md:mb-8 tracking-widest uppercase">
          Built for Kenyan Photographers powerd by  The Bee 🇰🇪
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-4 md:mb-6">
          Your photos deserve
          <span className="block text-[#c9a84c]">a better home.</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg max-w-xl mb-8 md:mb-10 leading-relaxed font-light px-4">
          Deliver stunning photo galleries to your clients.
          Password protected, beautifully presented,
          and made to impress.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto px-4 sm:px-0">
          <Link href="/auth/signup"
            className="bg-[#c9a84c] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#d4b460] transition text-sm tracking-wide text-center">
            Start For Free →
          </Link>
          <Link href="/auth/login"
            className="border border-gray-700 text-white px-8 py-4 rounded-full font-medium hover:border-gray-400 transition text-sm text-center">
            I have an account
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-6 md:gap-12 mt-12 md:mt-20 text-center">
          {[
            { value: '100%', label: 'Free to Start' },
            { value: 'HD', label: 'Full Quality' },
            { value: 'KES', label: 'Local Pricing' },
          ].map((stat, i) => (
            <div key={i}>
              <p style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 md:px-6 pb-16 md:pb-32">
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-8 md:mb-12">
          Everything your clients need
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: '🔒', title: 'Password Protected', desc: 'Private access for each client.' },
            { icon: '⬇️', title: 'One-Click Download', desc: 'Download all photos as ZIP.' },
            { icon: '❤️', title: 'Favourite Photos', desc: 'Clients heart their favourite shots.' },
            { icon: '💌', title: 'Personal Message', desc: 'Add a heartfelt note to clients.' },
            { icon: '🖼️', title: 'Cover Image', desc: 'Hero image for every gallery.' },
            { icon: '📱', title: 'Works on All Devices', desc: 'Mobile, tablet, desktop — all work perfectly.' },
          ].map((f, i) => (
            <div key={i}
              className="border border-gray-800 rounded-2xl p-5 md:p-6 hover:border-[#c9a84c]/40 transition group bg-[#0d0d0d]">
              <span className="text-2xl mb-3 md:mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-white mb-2 group-hover:text-[#c9a84c] transition text-sm md:text-base">
                {f.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-3xl mx-auto px-5 md:px-6 pb-16 md:pb-32 text-center">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-8 md:mb-12">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {[
            { step: '01', title: 'Create Gallery', desc: 'Sign up and create a gallery for your client in seconds.' },
            { step: '02', title: 'Upload Photos', desc: 'Upload full quality photos directly from your device.' },
            { step: '03', title: 'Share Link', desc: 'Send the private link to your client. They view and download.' },
          ].map((item, i) => (
            <div key={i} className="relative">
              {i < 2 && (
                <div className="hidden sm:block absolute top-6 left-full w-full h-px border-t border-dashed border-gray-800 z-0" />
              )}
              <div className="relative z-10">
                <p style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-4xl font-bold text-[#c9a84c]/20 mb-3">{item.step}</p>
                <h3 className="font-semibold text-white mb-2 text-sm md:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center px-5 md:px-6 pb-16 md:pb-20">
        <div className="border border-gray-800 rounded-2xl md:rounded-3xl max-w-2xl mx-auto p-8 md:p-12 bg-[#0d0d0d]">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Ready to impress your clients?
          </h2>
          <p className="text-gray-400 mb-6 md:mb-8 text-sm">
            Join photographers already delivering stunning galleries.
          </p>
          <Link href="/auth/signup"
            className="inline-block bg-[#c9a84c] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#d4b460] transition text-sm w-full sm:w-auto">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center text-gray-600 text-xs pb-8 px-4">
        <div className="flex justify-center mb-4">
          <Logo href="/" size="sm" />
        </div>
        <p>Built with ❤️ by <span className="text-[#c9a84c]">BundoxxBrian</span> · Mombasa, Kenya 🇰🇪</p>
      </footer>

    </main>
  )
}
