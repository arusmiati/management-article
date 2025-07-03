'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function withAuth(Component: any, allowedRoles: string[]) {
  return function AuthGuard(props: any) {
    const router = useRouter()
    const user = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {}

    useEffect(() => {
      const isTokenExpired = () => {
        const token = localStorage.getItem('token')
        return !token
      }

      if (!user || !allowedRoles.includes(user.role) || isTokenExpired()) {
        localStorage.removeItem('user')
        router.push('/login')
      }
    }, [user, allowedRoles, router])

    return <Component {...props} />
  }
}
