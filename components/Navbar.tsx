'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logout from '@/components/ui/logout'

export default function Navbar() {
  const [username, setUsername] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const parsed = JSON.parse(user)
      setUsername(parsed.username)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getInitial = (name: string = '') => name.charAt(0).toUpperCase()

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-6 flex justify-between items-center ${
          scrolled
            ? 'bg-white text-black shadow-md'
            : 'bg-transparent text-white'
        }`}
      >
          <div className="flex items-center gap-2 transition-all duration-300">
  <Image
    src={scrolled ? '/assets/logo2.png' : '/assets/logo3.png'}
    alt="Logo"
    width={120}
    height={120}
    className="transition-all duration-300"
  />
</div>


        <div className="relative" ref={dropdownRef}>
          {username ? (
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="w-8 h-8 bg-[#8bcef3] flex justify-center items-center rounded-full text-sm" style={{ color: '#005ac3' }}>
                {getInitial(username)}
              </div>
              <span className="font-medium text-sm">{username}</span>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-white border rounded shadow-lg w-40 text-sm text-black z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false)
                      router.push('/user/profile')
                    }}
                  >
                    Account
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false)
                      setShowLogout(true)
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="font-medium">
              Login
            </Link>
          )}
        </div>
      </nav>

      {showLogout && (
        <Logout
          onCancel={() => setShowLogout(false)}
          onConfirm={() => {
            localStorage.removeItem('user')
            setShowLogout(false)
            router.push('/login')
          } } isOpen={showLogout}        />
      )}
    </>
  )
}
