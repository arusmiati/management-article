'use client'

import { useRouter, usePathname } from 'next/navigation'
import { LayoutGrid, FolderKanban, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'
import Logout from '@/app/admin/logout'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [showLogout, setShowLogout] = useState(false)

  const navItems = [
    { label: 'Articles', icon: <LayoutGrid />, path: '/admin/articles' },
    { label: 'Category', icon: <FolderKanban />, path: '/admin/categories' },
  ]

  const handleConfirmLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('password')
    setShowLogout(false)
    router.push('/login')
  }

  return (
    <>
      <aside className="fixed top-0 left-0 w-64 h-screen bg-[#0029FF] text-white px-6 py-6 z-50">
        <div className="text-2xl font-bold mb-10">
          <img src="/assets/logo3.png" alt="" />
        </div>
        <nav className="space-y-2 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={clsx(
                "flex items-center gap-3 w-full px-4 py-2 rounded-md transition",
                pathname.startsWith(item.path) ? "bg-blue-900/70" : "hover:bg-blue-900/40"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md hover:bg-blue-900/40 transition"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Logout Modal */}
      <Logout
        isOpen={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  )
}
