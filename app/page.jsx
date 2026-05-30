import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      
      <h1 className="text-4xl font-bold mb-4 text-center">
        📸 PicDelivr
      </h1>
      
      <p className="text-gray-400 text-center max-w-md mb-8">
        Professional photo delivery for Kenyan photographers. 
        Share stunning galleries with your clients instantly.
      </p>

      <div className="flex gap-4">
        <Link href="/auth/signup"
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
          Get Started Free @2026
        </Link>
        <Link href="/auth/login"
          className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">
          Login
        </Link>
      </div>

    </main>
  )
}