import '../styles/globals.css'
import React, { ReactNode } from 'react'

export const metadata = {
  title: 'Frontend Artikel',
  description: 'Home Test Frontend Artikel App',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className="bg-white text-gray-900"
        suppressHydrationWarning={true}
      >
        {children}
      </body>

    </html>
  )
}
