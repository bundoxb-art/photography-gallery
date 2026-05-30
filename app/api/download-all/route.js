export const dynamic = 'force-dynamic'

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import JSZip from 'jszip'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const galleryId = searchParams.get('galleryId')
    const galleryName = searchParams.get('galleryName') || 'gallery'

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

    const { data: photos } = await supabase
      .from('photos')
      .select('*')
      .eq('gallery_id', galleryId)

    const zip = new JSZip()

    for (const photo of photos) {
      const command = new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: photo.b2_key,
      })

      const response = await b2Client.send(command)
      const chunks = []

      for await (const chunk of response.Body) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)
      zip.file(photo.filename, buffer)
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${galleryName}.zip"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}