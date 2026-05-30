export const dynamic = 'force-dynamic'

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
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

    const { photoId, b2Key } = await req.json()

    await b2Client.send(new DeleteObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: b2Key,
    }))

    await supabase.from('photos').delete().eq('id', photoId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}