'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navbar() {
  const [username, setUsername] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const parsed = JSON.parse(user)
      setUsername(parsed.username)
    }
  }, [])

  const getInitial = (name: string) => name.charAt(0).toUpperCase()
  const currentSection = pathname.includes('categories') ? 'Category' : 'Articles'

  return (
    <nav className="bg-white text-black shadow-md py-4 px-6 flex flex-wrap md:flex-nowrap justify-between items-center relative gap-3">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold ml-[40px] md:ml-6">{currentSection}</span>
      </div>

      {username ? (
        <div className="relative flex items-center gap-3">
          <div
            className="w-8 h-8 bg-[#8bcef3] flex justify-center items-center rounded-full text-sm" style={{ color: '#005ac3' }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {getInitial(username)}
          </div>
          <button
            className="flex items-center gap-2 text-sm hover:text-gray-800"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="font-medium">{username}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 bg-white border rounded shadow-lg w-40 text-sm z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false)
                  router.push('/admin/profile')
                }}
              >
                Account
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="text-sm text-[#0029FF] font-medium">
          Login
        </Link>
      )}
    </nav>
  )
}
