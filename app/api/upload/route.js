export const dynamic = 'force-dynamic'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const b2Client = new S3Client({
      endpoint: `https://${process.env.B2_ENDPOINT}`,
      region: process.env.B2_REGION,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APP_KEY,
      },
      forcePathStyle: true,
    })

    const formData = await req.formData()
    const file = formData.get('file')
    const galleryId = formData.get('galleryId')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const b2Key = `galleries/${galleryId}/${Date.now()}-${file.name}`

    console.log('Uploading to B2:', { bucket: process.env.B2_BUCKET_NAME, key: b2Key })

    await b2Client.send(new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
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