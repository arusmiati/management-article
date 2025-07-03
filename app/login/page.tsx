'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { api, setAuthToken } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [animate, setAnimate] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100)
  }, [])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setErrorMessage('')

    try {
      const res = await api.post('/auth/login', data)
      const token = res.data?.token
      if (!token) throw new Error('Token not found')

      localStorage.setItem('token', token)
      localStorage.setItem('password', data.password)
      setAuthToken(token)

      const profileRes = await api.get('/auth/profile')
      const user = profileRes.data

      if (!user?.role) throw new Error('User role not found')

      localStorage.setItem('user', JSON.stringify(user))

      if (user.role === 'Admin') {
        router.push('/admin/articles')
      } else if (user.role === 'User') {
        router.push('/user/articles')
      } else {
        throw new Error('Unknown role')
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 transition-all duration-1000 ease-in-out">
      <Card
        className={`w-full max-w-md p-6 m-4 shadow-2xl transform transition-all duration-700 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <CardContent>
          <div className="flex justify-center mb-6">
            <img src="/assets/logo2.png" alt="Logo" width={150} className="transition-all duration-500 hover:scale-105" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register('username')}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-300"
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-300"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}

            <Button
              type="submit"
              className="w-full transition-all duration-300 hover:scale-105"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-blue-600 hover:underline transition-all duration-200"
            >
              Register
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
