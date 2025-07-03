'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar2'
import Footer from '@/components/Footer'
import { api } from '@/services/api'
import withAuth from '@/middlewares/withAuth'

interface PreviewData {
  id?: string
  title: string
  content: string
  categoryId: string
  thumbnail: string
  source: 'create' | 'edit'
}

function ArticlePreview() {
  const [article, setArticle] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState<string>('Uncategorized')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem('preview-article')
    if (!data) {
      router.push('/admin/articles')
      return
    }

    try {
      const parsed: PreviewData = JSON.parse(data)
      setArticle(parsed)
      fetchCategoryName(parsed.categoryId)
    } catch {
      router.push('/admin/articles')
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchCategoryName = async (categoryId: string) => {
    try {
      const res = await api.get(`/categories/${categoryId}`)
      setCategoryName(res.data?.data?.name || 'Uncategorized')
    } catch {
      setCategoryName('Uncategorized')
    }
  }

  const handleBack = () => {
    if (!article) return
    if (article.source === 'create') {
      router.push('/admin/articles/create')
    } else if (article.source === 'edit' && article.id) {
      router.push(`/admin/articles/edit/${article.id}`)
    } else {
      router.back()
    }
  }

  const handleSubmit = async () => {
    if (!article) return
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      }

      const payload = {
        title: article.title,
        content: article.content,
        categoryId: article.categoryId,
        imageUrl: article.thumbnail,
      }

      await api.post('/articles', payload, config)
      sessionStorage.removeItem('preview-article')
      router.push('/admin/articles')
    } catch (err) {
      console.error('❌ Failed to submit article:', err)
      alert('Failed to submit article.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !article) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#222] font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 pt-6 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            ← Back to Edit
          </button>
        </div>

        {/* Header */}
        <div className="max-w-3xl mx-auto px-4 pt-12 text-center">
          <h2 className="text-sm text-[#6B7280] uppercase font-medium mb-2 tracking-wider">
            {categoryName}
          </h2>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-sm text-gray-500">Draft Preview • Just Now</p>
        </div>

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="relative w-full h-64 sm:h-[400px] rounded-xl overflow-hidden shadow-md">
              <Image
                src={article.thumbnail || '/assets/default.jpg'}
                alt="cover"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <div
            className="prose prose-lg max-w-none text-gray-800 prose-headings:mt-8 prose-p:mt-4 text-justify"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Submit Button */}
        {article.source === 'create' && (
          <div className="max-w-3xl mx-auto px-4 pb-12 text-center">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Article'}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default withAuth(ArticlePreview, ['Admin'])
