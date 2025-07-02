'use client'

import React from 'react'

interface LogoutProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function Logout({ isOpen, onCancel, onConfirm }: LogoutProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-left">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Logout</h2>
        <h5 className="text-lg text-gray-800 mb-6">Are you sure want to logout?</h5>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
