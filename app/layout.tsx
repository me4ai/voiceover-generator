import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Voiceover Generator',
  description: 'A web-based voiceover generator using Web Speech API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
