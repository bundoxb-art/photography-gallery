'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewGallery() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [clientPassword, setClientPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (text) => {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleCreate = async () => {
    if (!name || !clientPassword) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const slug = generateSlug(name) + '-' + Date.now()

    const { data, error } = await supabase
      .from('galleries')
      .insert({
        photographer_id: user.id,
        name,
        slug,
        client_password: clientPassword
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/dashboard/gallery/${data.id}`)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">New Gallery</h1>
        <p className="text-gray-400 mb-8">Create a gallery for your client</p>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Gallery Name (e.g. John & Mary Wedding)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mb-4 outline-none focus:border-white"
        />

        <input
          type="text"
          placeholder="Client Password (they'll use this to access)"
          value={clientPassword}
          onChange={e => setClientPassword(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mb-6 outline-none focus:border-white"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Gallery'}
        </button>

        <button
          onClick={() => router.back()}
          className="w-full mt-3 border border-gray-700 py-3 rounded-lg hover:border-white transition">
          Cancel
        </button>
      </div>
    </main>
  )
}