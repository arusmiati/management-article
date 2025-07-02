'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/app/admin/sidebar'
import Navbar from '@/app/admin/navbar'

interface Article {
  id: string
  title: string
  category: { name: string }
  imageUrl?: string
  createdAt: string
  content: string
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filtered, setFiltered] = useState<Article[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
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
        console.error('Gagal memuat artikel', err)
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
    setFiltered(result)
  }, [search, selectedCategory, articles])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/articles/${deleteId}`)
      setArticles((prev) => prev.filter((a) => a.id !== deleteId))
    } catch (err) {
      console.error('Gagal menghapus artikel', err)
    } finally {
      setShowDeleteModal(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-white rounded border border-gray-200">
            <div className="flex justify-between items-center px-6 pt-6">
              <h2 className="text-lg font-semibold ">Total Articles : {filtered.length}</h2>
              
            </div>

            <hr className="my-4 border-gray-200" />

            <div className="flex justify-between px-6 flex-wrap items-center gap-4">
              <div className="flex gap-4 items-center flex-wrap">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Category</option>
                  {[...new Set(articles.map((a) => a.category.name))].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search by title"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
                />
                
                
              </div>
              <Link
                href="/admin/articles/create"
                className="flex items-center gap-2 bg-[#0029FF] text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Articles
              </Link>
            </div>

            <div className="overflow-auto mt-6">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4">Thumbnails</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Created at</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={a.imageUrl || '/placeholder.jpg'}
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
                      <td className="p-4">
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
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

            {/* Pagination */}
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

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Article
              </h2>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete this article? This action cannot
                be undone.
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