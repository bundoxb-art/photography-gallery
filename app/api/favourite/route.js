export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { galleryId, photoId, action } = await req.json()

    if (action === 'add') {
      await supabase.from('favourites').insert({
        gallery_id: galleryId,
        photo_id: photoId,
      })
    } else {
      await supabase.from('favourites')
        .delete()
        .eq('gallery_id', galleryId)
        .eq('photo_id', photoId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}