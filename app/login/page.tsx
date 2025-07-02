'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { api, setAuthToken } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setErrorMessage('')

    try {
      const res = await api.post('/auth/login', data)
      const token = res.data?.token

      if (!token) throw new Error('Token not found in login response')

      localStorage.setItem('token', token)
      localStorage.setItem('password', data.password)
      setAuthToken(token)

      const profileRes = await api.get('/auth/profile')
      const user = profileRes.data

      if (!user || !user.role) throw new Error('Failed to fetch user profile')

      localStorage.setItem('user', JSON.stringify(user))

      if (user.role === 'Admin') {
        router.push('/admin/articles/')
      } else if (user.role === 'User') {
        router.push('/user/articles')
      } else {
        throw new Error(`Unknown role "${user.role}"`)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          'Login failed. Please check your username and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <CardContent>
          <div className="flex justify-center mb-4">
            <img src="/assets/logo2.png" alt="Logo" width={150} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            {errorMessage && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
            </Button>
          </form>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
