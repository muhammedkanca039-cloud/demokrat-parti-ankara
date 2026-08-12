'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Star, ChevronRight } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Anasayfa' },
  { href: '/adaylar', label: 'Adaylarımız' },
  { href: '/projeler', label: 'Projeler & Vaatler' },
  { href: '/etkinlikler', label: 'Etkinlik Takvimi' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dp-navy/95 backdrop-blur-xl shadow-glass border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 bg-dp-red rounded-xl flex items-center justify-center shadow-dp group-hover:shadow-dp-lg transition-all duration-300 group-hover:scale-105">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="font-heading font-bold text-white text-lg leading-tight">
                  Demokrat Parti
                </div>
                <div className="text-dp-gold text-xs font-medium tracking-widest uppercase">
                  Ankara İl Teşkilatı
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm ${
                    pathname === link.href ? 'text-white after:w-full' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-full transition-all duration-200"
              >
                Yönetim Paneli
              </Link>
              <Link
                href="/#gonullu"
                className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
              >
                <span>Gönüllü Ol</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-200"
              aria-label="Menüyü aç/kapat"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-dp-navy-mid border-l border-white/10 shadow-2xl transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-dp-red rounded-xl flex items-center justify-center">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-heading font-bold text-white">Demokrat Parti</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="p-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-dp-red/20 text-white border border-dp-red/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="p-6 border-t border-white/10 space-y-3">
            <Link
              href="/#gonullu"
              className="btn-primary w-full text-center block"
            >
              Gönüllü Ol
            </Link>
            <Link
              href="/admin"
              className="btn-ghost w-full text-center block text-sm"
            >
              Yönetim Paneli
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
