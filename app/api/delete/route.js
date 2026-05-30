import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { b2Client, BUCKET_NAME } from '@/lib/b2'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { photoId, b2Key } = await req.json()

    await b2Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: b2Key,
    }))

    await supabase
      .from('photos')
      .delete()
      .eq('id', photoId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}