'use client'

import { useEffect, useState } from 'react'
import { api, setAuthToken } from '@/services/api'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import withAuth from '@/middlewares/withAuth'

interface Article {
  id: string
  title: string
  content: string
  imageUrl: string
  category: {
    name: string
  }
  user: {
    username: string
  }
  createdAt: string
}

interface Category {
  id: string
  name: string
}

function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setAuthToken(token)
  }, [])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles')
        setArticles(res.data.data)
        setFiltered(res.data.data)
      } catch (err) {
        console.error('❌ Failed to fetch article:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    const result = articles.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      const matchesCategory =
        !selectedCategory || a.category?.name === selectedCategory
      return matchesSearch && matchesCategory
    })
    setCurrentPage(1)
    setFiltered(result)
  }, [search, selectedCategory, articles])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories', {
          params: { page: 1, limit: 1000 },
        })
        setCategories(res.data?.data || [])
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="bg-[#EDF0F7] min-h-screen flex flex-col animate-fade-in">
      <Navbar />

      <header className="relative pt-24 pb-12 text-center text-white">
        <div className="header-overlay">
          <img
            src="/assets/logo-1.jpg"
            alt="bg"
            className="header-image scale-100 transition-transform duration-1000 ease-in-out"
          />
          <div className="header-overlay-color" />
        </div>
        <div className="header-content transition-all duration-700 ease-in-out">
          <h2 className="text-sm mb-2 animate-fade-in">Blog general</h2>
          <h2 className="text-4xl mb-2 animate-slide-up">
            The Journal : Design Resources, <br />
            Interviews, and Industry News
          </h2>
          <p className="text-sm opacity-80 mb-6 animate-fade-in">
            Your daily dose of design insights!
          </p>

          <div className="filter-search-container flex flex-col sm:flex-row justify-center items-center gap-2 bg-[#5357ff] p-1 rounded-xl transition-all duration-500">
            <select
              className="filter-search-input text-gray-400 w-full sm:w-1/3 transition-all duration-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search articles..."
              className="filter-search-input w-full sm:w-2/3 transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 flex-1">
        <p className="mb-4 text-sm text-gray-500 animate-fade-in">
          Showing: {paginatedData.length} of {filtered.length} articles
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedData.map((article, idx) => (
                <Link
                  key={article.id}
                  href={`articles/${article.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                  style={{
                    animationDelay: `${idx * 80}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="h-48 bg-gray-200">
                    <Image
                      src={article.imageUrl || '/assets/default.jpg'}
                      alt="Thumbnail"
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(article.createdAt).toDateString()}
                    </p>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {article.content.replace(/<[^>]+>/g, '').slice(0, 120)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#EDF0F7] text-[#0029FF] px-3 py-1 rounded-full text-xs font-medium">
                        {article.category?.name}
                      </span>
                      <span className="bg-[#EDF0F7] text-[#0029FF] px-3 py-1 rounded-full text-xs font-medium">
                        {article.user?.username}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2 text-sm animate-fade-in">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-white border hover:bg-gray-100 disabled:opacity-50 transition-all duration-300"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded border transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-[#0029FF] text-white'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-white border hover:bg-gray-100 disabled:opacity-50 transition-all duration-300"
                >
                  Next ›
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default withAuth(ArticleList, ['User'])
