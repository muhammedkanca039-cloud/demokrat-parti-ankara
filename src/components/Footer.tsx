import Link from 'next/link';
import { MapPin, Phone, Mail, Star, Facebook, Twitter, Instagram, Youtube, ChevronRight } from 'lucide-react';

const footerLinks = {
  hizli: [
    { href: '/', label: 'Anasayfa' },
    { href: '/adaylar', label: 'Adaylarımız' },
    { href: '/projeler', label: 'Projeler & Vaatler' },
    { href: '/etkinlikler', label: 'Etkinlik Takvimi' },
    { href: '/#iletisim', label: 'Bize Ulaşın' },
  ],
  kurumsal: [
    { href: '#', label: 'Hakkımızda' },
    { href: '#', label: 'Demokrat Parti Tüzüğü' },
    { href: '#', label: 'Genel Merkez' },
    { href: '/admin', label: 'Yönetim Paneli' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dp-navy border-t border-white/10 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-11 h-11 bg-dp-red rounded-xl flex items-center justify-center shadow-dp group-hover:shadow-dp-lg transition-all duration-300">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <div className="font-heading font-bold text-white text-lg">Demokrat Parti</div>
                <div className="text-dp-gold text-xs tracking-widest uppercase">Ankara İl Teşkilatı</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Başkent Ankara'nın geleceği için güçlü bir kadro, güçlü bir Türkiye. Demokrat Parti ile Ankara yeniden yükseliyor.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-dp-red/20 border border-white/10 hover:border-dp-red/30 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.hizli.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-dp-red group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Kurumsal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-dp-red group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              İletişim
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-dp-red mt-0.5 shrink-0" />
                <span className="text-sm text-white/60 leading-relaxed">
                  Kızılay Mah. Mithatpaşa Cad. No:12<br />
                  Çankaya / Ankara
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-dp-red shrink-0" />
                <a href="tel:+903121234567" className="text-sm text-white/60 hover:text-white transition-colors">
                  0312 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-dp-red shrink-0" />
                <a href="mailto:ankara@demokratparti.org.tr" className="text-sm text-white/60 hover:text-white transition-colors">
                  ankara@demokratparti.org.tr
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Demokrat Parti Ankara İl Teşkilatı. Tüm hakları saklıdır.
          </p>
          <p className="text-white/30 text-xs">
            Seçim mevzuatına uygun olarak hazırlanmıştır.
          </p>
        </div>
      </div>
    </footer>
  );
}
