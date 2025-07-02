'use client'

import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles')
        setArticles(res.data.data)
        setFiltered(res.data.data)
      } catch (err) {
        console.error('❌ Gagal ambil artikel:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    const result = articles.filter(
      (a) => {
          const matchesSearch =
              a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)

          const matchesCategory =
              !selectedCategory || a.category?.name === selectedCategory

          return matchesSearch && matchesCategory
      })

      setFiltered(result)
  }, [search, selectedCategory, articles])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data.data)
      }catch(err){
        console.error('Gagal ambil kategori:', err)
      }
    }

    fetchCategories()
  }, [])
  

  return (
    <div className="bg-[#EDF0F7] min-h-screen flex flex-col">
      <Navbar/>
      <header  className="relative pt-24 pb-12 text-center text-white">
        <div className="header-overlay">
          <img src="/assets/logo-1.jpg" alt="bg" className="header-image" />
            <div className="header-overlay-color" />
            </div>
          <div className="header-content">
              <h2 className="text-sm mb-2">Blog general</h2>
              <h1 className="text-4xl font-bold mb-2">The Journal : Design Resources, <br />Interviews, and Industry News</h1>
              <p className="text-sm opacity-80 mb-6">Your daily dose of design insights!</p>
    
              <div className="filter-search-container flex flex-col sm:flex-row justify-center items-center gap-2 bg-[#5357ff] p-2">
                  <select
                    className="filter-search-input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="filter-search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

              </div>
          </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <p className="mb-4 text-sm text-gray-500">
          Showing: {filtered.length} of total articles
        </p>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Link
                key={article.id}
                href={`articles/${article.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-48 bg-gray-200">
                  <Image
                    src={article.imageUrl}
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
        )}
      </main>
      <Footer />
    </div>
  )
}
