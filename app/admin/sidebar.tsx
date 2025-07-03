'use client'

import { useRouter, usePathname } from 'next/navigation'
import { FileText, LogOut, Tag, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import Logout from '@/app/admin/logout'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [showLogout, setShowLogout] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { label: 'Articles', icon: <FileText />, path: '/admin/articles' },
    { label: 'Category', icon: <Tag />, path: '/admin/categories' },
  ]

  const handleConfirmLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('password')
    setShowLogout(false)
    router.push('/login')
  }

  useEffect(() => {
    if (!isSidebarOpen || !isMobile) return

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('aside')
      const toggleBtn = document.querySelector('button[aria-label="Toggle sidebar"]')

      if (
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        toggleBtn &&
        !toggleBtn.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isSidebarOpen, isMobile])

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-4 md:hidden">
        <button
          aria-label="Toggle sidebar"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-[#0029FF] text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={clsx(
          "fixed top-0 left-0 w-64 h-screen bg-[#0029FF] text-white px-6 py-6 z-40 transition-transform duration-300",
          {
            "translate-x-0": !isMobile || isSidebarOpen,
            "-translate-x-full": isMobile && !isSidebarOpen,
          }
        )}
        style={{
          height:'-webkit-fill-available'
        }}
      >
        <div className="text-2xl font-bold mb-10">
          <img src="/assets/logo3.png" alt="Website Logo" />
        </div>
        <nav className="space-y-2 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                router.push(item.path)
                if (isMobile) setIsSidebarOpen(false)
              }}
              className={clsx(
                "flex items-center gap-3 w-full px-4 py-2 rounded-md transition",
                pathname.startsWith(item.path)
                  ? "bg-sky-500/70"
                  : "hover:bg-blue-900/40"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={() => {
              setShowLogout(true)
            }}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md hover:bg-blue-900/40 transition"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Content Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Logout Modal */}
      <Logout
        isOpen={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  )
}
