'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  username: z.string().min(1, { message: 'Username field cannot be empty' }),
  password: z
    .string()
    .min(1, { message: 'Password field cannot be empty' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['Admin', 'User'], {
    required_error: 'Please select a valid role'
  })
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
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
      await api.post('/auth/register', data)
      router.push('/login')
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card
        className={`w-full max-w-md p-6 shadow-2xl transform transition-all duration-700 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <CardContent>
          <div className="flex justify-center mb-6">
            <img
              src="/assets/logo2.png"
              alt="Logo"
              width={150}
              className="transition-transform duration-500 hover:scale-105"
            />
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

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register('role')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              >
                <option value="">Select role</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register'}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-600 hover:underline transition-all duration-200"
            >
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
