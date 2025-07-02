'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'

interface UserProfile {
  username: string
  password: string
  role: string
}

export default function UserProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile')
        setProfile(res.data)
      } catch (err) {
        console.error('❌ Gagal ambil data profil:', err)
      }
    }

    fetchProfile()
  }, [])

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Memuat profil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 font-sans">
      <div className="w-full max-w-md text-center px-6">
        <h1 className="text-xl font-semibold mb-8">User Profile</h1>

        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto text-xl font-medium text-gray-600 mb-6">
          {profile.username.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-left bg-gray-50 p-3 rounded-md border">
            <span className="text-gray-500 w-1/3">Username</span>
            <span className="w-2/3 text-right font-medium">{profile.username}</span>
          </div>
          <div className="flex justify-between text-left bg-gray-50 p-3 rounded-md border">
            <span className="text-gray-500 w-1/3">Password</span>
            <span className="w-2/3 text-right font-medium">*********</span>
          </div>
          <div className="flex justify-between text-left bg-gray-50 p-3 rounded-md border">
            <span className="text-gray-500 w-1/3">Role</span>
            <span className="w-2/3 text-right font-medium">{profile.role}</span>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => router.push('/user/articles')}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
