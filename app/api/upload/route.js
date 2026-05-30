import { PutObjectCommand } from '@aws-sdk/client-s3'
import { b2Client, BUCKET_NAME } from '@/lib/b2'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const galleryId = formData.get('galleryId')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const b2Key = `galleries/${galleryId}/${Date.now()}-${file.name}`

    console.log('Uploading to B2:', { bucket: BUCKET_NAME, key: b2Key })

    await b2Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: b2Key,
      Body: buffer,
      ContentType: file.type,
    }))

    console.log('B2 upload success!')

    const { data: photo, error: dbError } = await supabase
      .from('photos')
      .insert({
        gallery_id: galleryId,
        filename: file.name,
        b2_key: b2Key,
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ photo })
  } catch (error) {
    console.error('Upload error full:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}