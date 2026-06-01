import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ size = 'md', href = '/' }) {
  const sizes = { sm: 32, md: 40, lg: 80, xl: 120 }
  const px = sizes[size]
  return (
    <Link href={href} className="flex items-center gap-3 group">
      <Image src="/logo.svg" alt="PicDelivr" width={px} height={px}
        className="group-hover:opacity-80 transition" />
      <span style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-xl font-bold text-white">
        Pic<span className="text-[#c9a84c]">Delivr</span>
      </span>
    </Link>
  )
}
