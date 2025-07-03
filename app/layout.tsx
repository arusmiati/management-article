import '../styles/globals.css'
import React, { ReactNode } from 'react'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata = {
  title: 'Frontend Artikel',
  description: 'Home Test Frontend Artikel App',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-white text-gray-900`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>

    </html>
  )
}
