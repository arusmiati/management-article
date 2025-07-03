'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/app/admin/sidebar'
import Navbar from '@/app/admin/navbar'
import withAuth from '@/middlewares/withAuth'

interface Article {
  id: string
  title: string
  category: { name: string }
  imageUrl?: string
  createdAt: string
  content: string
}

interface Category {
  id: string
  name: string
}

function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [filtered, setFiltered] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 9
  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles')
        setArticles(res.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch articles:', err)
      }
    }

    fetchArticles()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories', {
          params: { page: 1, limit: 1000 },
        })
        setCategories(res.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }

    fetchCategories()
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

    const sorted = [...result].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFiltered(sorted)
    setCurrentPage(1)
  }, [search, selectedCategory, articles, sortBy])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/articles/${deleteId}`)
      setArticles((prev) => prev.filter((a) => a.id !== deleteId))
    } catch (err) {
      console.error('Failed to delete article:', err)
    } finally {
      setShowDeleteModal(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-white rounded border border-gray-200">
            <div className="flex justify-between items-center px-6 pt-6 flex-wrap gap-4">
              <h2 className="text-lg font-semibold">Total Articles: {totalItems}</h2>
              <div className="flex gap-2 items-center">
                <label htmlFor="sortBy" className="text-sm">Sort by:</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="createdAt">Created At (Newest)</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            <div className="flex flex-wrap items-center justify-between px-6 gap-4">
              <div className="flex flex-wrap gap-4 flex-1 min-w-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-64 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} title={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search by title"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <Link
                  href="/admin/articles/create"
                  className="flex items-center gap-2 bg-[#0029FF] text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Article
                </Link>
              </div>
            </div>

            <div className="overflow-auto mt-6">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={a.imageUrl || '/assets/default.jpg'}
                            alt="thumbnail"
                            fill
                            sizes="48px"
                            priority
                            className="object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="p-4 w-1/4">{a.title}</td>
                      <td className="p-4">{a.category.name}</td>
                      <td className="p-4">{new Date(a.createdAt).toLocaleString()}</td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <Link
                          href={`/admin/articles/preview/${a.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Preview
                        </Link>
                        <Link
                          href={`/admin/articles/edit/${a.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => {
                            setDeleteId(a.id)
                            setShowDeleteModal(true)
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center p-4 border-t text-sm text-gray-700 mt-4 gap-4">
              <button
                className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹ Previous
              </button>
              <div className="space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`px-3 py-1 rounded ${
                      currentPage === n ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next ›
              </button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Article
              </h2>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete this article? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteId(null)
                  }}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default withAuth(ArticlePage, ['Admin'])
