/**
 * src/app/layout.tsx
 *
 * Next.js kök layout bileşeni — tüm sayfalarda ortak çerçeveyi tanımlar.
 *
 * Görevleri:
 * - Tüm uygulama için SEO meta verilerini (başlık, açıklama, anahtar kelimeler)
 *   merkezi olarak tanımlar.
 * - Google Fonts'tan Inter ve Outfit yazı tiplerini preconnect ile hızlı yükler.
 * - Global CSS stillerini (`globals.css`) içe aktarır.
 * - `children` prop'u ile tüm alt sayfaları/bileşenleri sarar; bu sayede her
 *   sayfada tekrar layout yazmaya gerek kalmaz.
 */

import type { Metadata } from 'next'
import './globals.css'

/**
 * Tüm sayfalar için varsayılan SEO meta verileri.
 * Bireysel sayfalar bu değerleri geçersiz kılabilir (override).
 */
export const metadata: Metadata = {
  title: 'Demokrat Parti Ankara | Milletvekili Aday Tanıtım',
  description: 'Demokrat Parti Ankara ili 1., 2. ve 3. Bölge Milletvekili Adayları, Seçim Vaatleri, Projeler ve Saha Etkinlikleri.',
  keywords: 'Demokrat Parti, Ankara, Milletvekili, Aday, Seçim, Projeler, Saha Etkinlikleri',
}

/**
 * Kök layout bileşeni.
 * Tüm Next.js sayfa bileşenleri bu wrapper içinde render edilir.
 *
 * @param children - Aktif sayfanın içeriği (Next.js tarafından otomatik enjekte edilir)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Dil Türkçe olarak ayarlandı; ekran okuyucular ve SEO için önemli
    <html lang="tr">
      <head>
        {/* Google Fonts bağlantı ön yüklemesi — tarayıcı bağlantıyı erken kurar */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter: UI metinleri | Outfit: başlıklar ve vurgular */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
