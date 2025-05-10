// app/[lang]/layout.tsx
import type React from "react"
import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { locales } from "@/middleware"
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    title: "TUDO - No strings. just joy.",
    description: "Your all-access pass to fitness, wellness & beauty",
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon.png' },
      ],
      apple: [
        { url: '/apple-icon.png' },
      ],
    },
  }
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  
  console.log("🔧 Layout rendering with lang:", lang);
  console.log("🔑 Clerk keys check:", {
    publishable: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
    secret: process.env.CLERK_SECRET_KEY ? "✅ Set" : "❌ Missing"
  });
  
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}