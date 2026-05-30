export const dynamic = 'force-dynamic'

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const b2Client = new S3Client({
      endpoint: `https://${process.env.B2_ENDPOINT}`,
      region: process.env.B2_REGION,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APP_KEY,
      },
      forcePathStyle: true,
    })

    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
    })

    const signedUrl = await getSignedUrl(b2Client, command, {
      expiresIn: 3600
    })

    return NextResponse.redirect(signedUrl)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}