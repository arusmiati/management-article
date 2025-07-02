'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Plus } from 'lucide-react'
import Sidebar from '@/app/admin/sidebar'
import Navbar from '@/app/admin/navbar'

interface Category {
  id: string
  name: string
  createdAt: string
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchData = async () => {
    try {
      const res = await api.get('/categories', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          sort: 'createdAt:desc',
        },
      })

      const data = res.data?.data || []
      const total = res.data.totalData > 0 ? res.data.totalData : data.length

      setCategories(data)
      setTotalItems(total)
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage])

  const handleSave = async () => {
    try {
      if (!name.trim()) return alert('Category name is required.')

      const payload = { name }

      if (editId) {
        await api.put(`/categories/${editId}`, payload)
      } else {
        await api.post('/categories', payload)
      }

      setModalOpen(false)
      setName('')
      setEditId(null)
      fetchData()
    } catch (err) {
      console.error('Failed to save category', err)
    }
  }

  const handleEdit = (category: Category) => {
    setEditId(category.id)
    setName(category.name)
    setModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/categories/${deleteId}`)
      setCategories((prev) => prev.filter((c) => c.id !== deleteId))
      setTotalItems((prev) => prev - 1)
    } catch (err) {
      console.error('Failed to delete category', err)
    } finally {
      setShowDeleteModal(false)
      setDeleteId(null)
    }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Navbar />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-white rounded border border-gray-200">
            <div className="flex justify-between items-center px-6 pt-6">
              <h2 className="text-lg font-semibold">Total Categories: {totalItems}</h2>
              
            </div>

            <hr className="my-4 border-none" />

            <div className="flex justify-between px-6 flex-wrap items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
              />
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-[#0029FF] text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{c.name}</td>
                      <td className="p-4">{new Date(c.createdAt).toLocaleString()}</td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(c.id)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:underline"
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

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                {editId ? 'Edit Category' : 'Add Category'}
              </h2>
              <input
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModalOpen(false)
                    setEditId(null)
                    setName('')
                  }}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-red-600">
                Confirm Delete
              </h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this category?
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
