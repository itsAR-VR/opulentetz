import type React from "react"
import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactSidebar } from "@/components/contact-sidebar"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Exclusive Time Zone | Luxury Pre-Owned Watches in Canada",
  description:
    "Canada's trusted destination for authenticated pre-owned luxury watches. Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Tudor and more. Serving Edmonton, Calgary, Kelowna, Winnipeg, Toronto, and Montreal.",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon-light-32x32.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="video" href="/hero_images/video_20230311002338.mp4" type="video/mp4" />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ContactSidebar />
        <Analytics />
      </body>
    </html>
  )
}
