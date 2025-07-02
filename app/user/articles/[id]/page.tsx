'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar2'
import Footer from '@/components/Footer'

interface Article {
  id: string
  title: string
  content: string
  imageUrl: string
  createdAt: string
  user: { username: string }
  category: { name: string }
}

export default function ArticleDetail() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`)
        setArticle(res.data.data || res.data)
      } catch (err) {
        console.error('❌ Gagal ambil detail artikel:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchArticle()
  }, [id])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/articles?limit=3')
        setRecommendations(res.data?.data?.filter((a: Article) => a.id !== id) || [])
      } catch (err) {
        console.error('❌ Gagal ambil rekomendasi artikel:', err)
      }
    }

    fetchRecommendations()
  }, [id])


  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    )
  }

  if (!article) {
    return <div className="text-center text-gray-500 py-20">Artikel tidak ditemukan</div>
  }

  return (
  <div className="flex flex-col min-h-screen bg-white text-[#222] font-sans">
    <Navbar />

    <main className="flex-grow">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 pt-16 text-center">
        <h2 className="text-sm text-[#6B7280] uppercase font-medium mb-2 tracking-wider">{article.category.name}</h2>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">{article.title}</h1>
        <p className="text-sm text-gray-500">
          {new Date(article.createdAt).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}{' '}
          • {article.user.username}
        </p>
      </div>

      {/* Cover image */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="relative w-full h-64 sm:h-[400px] rounded-xl overflow-hidden shadow-md">
          <Image
            src={article.imageUrl}
            alt="cover"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div
            className="prose prose-lg max-w-none text-gray-800 prose-headings:mt-8 prose-p:mt-4 text-justify"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-10">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Other Articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4 cursor-pointer"
                onClick={() => router.push(`/user/articles/${rec.id}`)}
              >
                <div className="relative w-full h-40 rounded-md overflow-hidden mb-3">
                  <Image
                    src={rec.imageUrl}
                    alt={rec.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {rec.category.name}
                </p>
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {rec.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>

    <Footer />
  </div>
)

}
