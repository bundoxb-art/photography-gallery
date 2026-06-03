'use client'
import { useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

export default function MobileNav({ user, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger Button */}
      <button onClick={() => setOpen(true)}
        className="lg:hidden flex flex-col gap-1.5 p-2">
        <span className="w-6 h-0.5 bg-white transition-all" />
        <span className="w-4 h-0.5 bg-[#c9a84c] transition-all" />
        <span className="w-6 h-0.5 bg-white transition-all" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-[#0d0d0d] border-l border-gray-800 z-50 transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <Logo size="sm" />
          <button onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#c9a84c]/50 bg-[#111]">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user_metadata?.avatar || 'Felix'}&backgroundColor=111111`}
                alt="Avatar"
                className="w-full h-full"
              />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{user?.user_metadata?.name}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 p-6 space-y-2">
          <Link href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl glass text-gray-300 hover:text-white hover:border-[#c9a84c]/30 transition">
            <span>📸</span>
            <span className="text-sm font-medium">My Galleries</span>
          </Link>
          <Link href="/dashboard/gallery/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/20 transition">
            <span>➕</span>
            <span className="text-sm font-medium">New Gallery</span>
          </Link>
        </div>

        {/* Bottom */}
        <div className="p-6 border-t border-gray-800 safe-bottom">
          <button onClick={onLogout}
            className="w-full py-3 rounded-xl glass text-gray-400 hover:text-white text-sm transition">
            Logout
          </button>
        </div>
      </div>
    </>
  )
}