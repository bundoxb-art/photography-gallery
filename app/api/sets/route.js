export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { action, galleryId, name, description, setId } = await req.json()

    if (action === 'create') {
      const { data: existing } = await supabase
        .from('sets').select('order_index')
        .eq('gallery_id', galleryId)
        .order('order_index', { ascending: false })
        .limit(1)
      const nextOrder = existing?.[0]?.order_index + 1 || 0
      const { data, error } = await supabase
        .from('sets')
        .insert({ gallery_id: galleryId, name, description: description || null, order_index: nextOrder })
        .select().single()
      if (error) throw error
      return NextResponse.json({ set: data })
    }

    if (action === 'delete') {
      await supabase.from('photos').update({ set_id: null }).eq('set_id', setId)
      await supabase.from('sets').delete().eq('id', setId)
      return NextResponse.json({ success: true })
    }

    if (action === 'update') {
      const { data, error } = await supabase
        .from('sets').update({ name, description }).eq('id', setId).select().single()
      if (error) throw error
      return NextResponse.json({ set: data })
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}