'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export function Select({
  children,
  className
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative w-full', className)}>
      {children}
    </div>
  )
}

export function SelectTrigger({
  onClick,
  children,
  className
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex justify-between items-center border rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
    >
      {children}
    </button>
  )
}

export function SelectValue({ value }: { value: string }) {
  return <span>{value || 'Pilih salah satu'}</span>
}

export function SelectContent({
  children,
  open,
  className
}: React.HTMLAttributes<HTMLDivElement> & { open: boolean }) {
  if (!open) return null
  return (
    <div
      className={cn(
        'absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-60 overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

export function SelectItem({
  children,
  onSelect
}: {
  children: React.ReactNode
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  )
}
