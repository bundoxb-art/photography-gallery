export const dynamic = 'force-dynamic'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { b2Client, BUCKET_NAME } from '@/lib/b2'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
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