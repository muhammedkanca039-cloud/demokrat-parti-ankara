import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Demokrat Parti Ankara | Milletvekili Aday Tanıtım',
  description: 'Demokrat Parti Ankara ili 1., 2. ve 3. Bölge Milletvekili Adayları, Seçim Vaatleri, Projeler ve Saha Etkinlikleri.',
  keywords: 'Demokrat Parti, Ankara, Milletvekili, Aday, Seçim, Projeler, Saha Etkinlikleri',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
