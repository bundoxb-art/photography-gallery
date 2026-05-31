import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-hidden">

      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px'
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6">
        <span style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-xl font-bold tracking-wide">
          Pic<span className="text-[#c9a84c]">Delivr</span>
        </span>
        <div className="flex gap-4">
          <Link href="/auth/login"
            className="text-gray-400 hover:text-white transition text-sm font-medium px-4 py-2">
            Login
          </Link>
          <Link href="/auth/signup"
            className="bg-[#c9a84c] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#d4b460] transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">

        <div className="inline-block border border-[#c9a84c]/30 rounded-full px-4 py-1 text-[#c9a84c] text-xs font-medium mb-8 tracking-widest uppercase">
          Built for Kenyan Photographers
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-6">
          Your photos deserve
          <span className="block text-[#c9a84c]">a better home.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed font-light">
          Deliver stunning photo galleries to your clients. 
          Password protected, beautifully presented, 
          and made to impress.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/signup"
            className="bg-[#c9a84c] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#d4b460] transition text-sm tracking-wide">
            Start For Free →
          </Link>
          <Link href="/auth/login"
            className="border border-gray-700 text-white px-8 py-4 rounded-full font-medium hover:border-gray-400 transition text-sm">
            I have an account
          </Link>
        </div>

        {/* Floating stats */}
        <div className="flex gap-12 mt-20 text-center">
          <div>
            <p className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}>100%</p>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Free to Start</p>
          </div>
          <div className="w-px bg-gray-800" />
          <div>
            <p className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}>HD</p>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Full Quality</p>
          </div>
          <div className="w-px bg-gray-800" />
          <div>
            <p className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}>KES</p>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Local Pricing</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-12">
          Everything your clients need
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🔒', title: 'Password Protected', desc: 'Each gallery is private. Only your client can access their photos.' },
            { icon: '⬇️', title: 'One-Click Download', desc: 'Clients download all their photos in one ZIP file instantly.' },
            { icon: '❤️', title: 'Favourite Photos', desc: 'Clients can heart their favourite shots from the gallery.' },
            { icon: '💌', title: 'Personal Message', desc: 'Add a personal note to each client gallery.' },
            { icon: '🖼️', title: 'Cover Image', desc: 'Set a stunning hero image for each gallery.' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Clients can view their gallery on any device.' },
          ].map((f, i) => (
            <div key={i}
              className="border border-gray-800 rounded-2xl p-6 hover:border-[#c9a84c]/40 transition group bg-[#0d0d0d]">
              <span className="text-2xl mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-white mb-2 group-hover:text-[#c9a84c] transition">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center px-6 pb-20">
        <div className="border border-gray-800 rounded-3xl max-w-2xl mx-auto p-12 bg-[#0d0d0d]">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-3xl font-bold mb-4">
            Ready to impress your clients?
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            Join photographers already delivering stunning galleries.
          </p>
          <Link href="/auth/signup"
            className="bg-[#c9a84c] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#d4b460] transition text-sm">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center text-gray-600 text-xs pb-8">
        Built by <span className="text-[#c9a84c]">BundoxxBrian</span> · Mombasa, Kenya 🇰🇪
      </footer>

    </main>
  )
}
