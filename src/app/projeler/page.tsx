/**
 * src/app/projeler/page.tsx
 *
 * "Projeler & Vaatler" sayfası — Demokrat Parti Ankara seçim projelerini listeler.
 *
 * Özellikler:
 * - Kategoriye göre filtreleme (Ekonomi, Gençlik, Tarım, Sanayi & Ulaşım, vb.).
 * - Ana seçim vaatleri (isKeyPromise=true) altın renkli rozet ve ring efektiyle öne çıkar.
 * - Her proje kartı genişletilebilir; tıklandığında tam açıklama görünür.
 * - Kategori bazlı renk kodlu ikonlar (Lucide ikon eşleme tablosu).
 * - API'dan dinamik olarak veri çeker (`/api/projects`).
 */

'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Target, Filter, ChevronDown, ChevronUp, CheckCircle2, Star,
  TrendingUp, Building2, Sprout, Train, Zap, HeartHandshake, Shield, Award,
  Users
} from 'lucide-react';


interface Project {
  id: number;
  title: string;
  category: string;
  summary: string;
  description: string;
  targetAudience?: string;
  icon: string;
  isKeyPromise: boolean;
}

const categories = ['Tümü', 'Ekonomi', 'Ankara Yerel Projeler', 'Gençlik', 'Tarım', 'Sanayi & Ulaşım'];

const categoryConfig: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  'Ekonomi': { color: 'text-blue-300', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: TrendingUp },
  'Ankara Yerel Projeler': { color: 'text-red-300', bg: 'bg-dp-red/15', border: 'border-dp-red/30', icon: Building2 },
  'Gençlik': { color: 'text-purple-300', bg: 'bg-purple-500/15', border: 'border-purple-500/30', icon: Zap },
  'Tarım': { color: 'text-green-300', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: Sprout },
  'Sanayi & Ulaşım': { color: 'text-orange-300', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: Train },
};

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, Building2, Sprout, Train, Zap, HeartHandshake, Shield, Award
};

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[project.icon] || TrendingUp;
  const config = categoryConfig[project.category] || { color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', icon: Target };

  return (
    <div className={`glass-card border border-white/10 hover:border-dp-red/30 transition-all duration-300 overflow-hidden ${project.isKeyPromise ? 'ring-1 ring-dp-gold/30' : ''}`}>
      {/* Key promise ribbon */}
      {project.isKeyPromise && (
        <div className="bg-gradient-to-r from-dp-gold/20 to-dp-gold/5 border-b border-dp-gold/20 px-5 py-2 flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-dp-gold fill-dp-gold" />
          <span className="text-dp-gold text-xs font-bold tracking-wider uppercase">Ana Seçim Vaadi</span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-2xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Category */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border} mb-3`}>
              {project.category}
            </span>

            <h3 className="font-heading font-bold text-white text-xl mb-3 leading-tight">{project.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{project.summary}</p>

            {/* Target audience */}
            {project.targetAudience && (
              <div className="flex items-center gap-2 mt-3">
                <Users className="w-3.5 h-3.5 text-white/40" />
                <span className="text-white/50 text-xs">{project.targetAudience}</span>
              </div>
            )}

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 mt-4 text-dp-red-light text-sm font-medium hover:text-white transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Daha Az Göster
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Detayları Gör
                </>
              )}
            </button>

            {/* Expanded description */}
            {expanded && (
              <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                <p className="text-white/80 text-sm leading-relaxed">{project.description}</p>
                {project.isKeyPromise && (
                  <div className="flex items-center gap-2 mt-4">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Bu vaat demokrat parti programına alınmıştır.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjelerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'Tümü') params.set('category', selectedCategory);

    fetch(`/api/projects?${params}`).then(r => r.json()).then(d => {
      setProjects(d);
      setLoading(false);
    });
  }, [selectedCategory]);

  const keyPromises = projects.filter(p => p.isKeyPromise);
  const otherProjects = projects.filter(p => !p.isKeyPromise);

  return (
    <div className="min-h-screen bg-dp-navy">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 relative overflow-hidden hero-bg">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-dp-red/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dp-gold/10 border border-dp-gold/20 text-dp-gold text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            Seçim Bildirgesi
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-black text-white mb-4">
            Projeler &<br /><span className="text-gradient">Vaatlerimiz</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            Ankara'ya somut taahhütler. Her proje ölçülebilir hedefler ve uygulama takvimi ile.
          </p>
          <div className="gold-line w-20 mt-6" />
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-dp-navy-mid border-b border-white/5 sticky top-16 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-white/40 shrink-0" />
            {categories.map(cat => {
              const config = cat === 'Tümü' ? null : categoryConfig[cat];
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-dp-red text-white shadow-dp'
                      : config
                        ? `${config.bg} ${config.color} border ${config.border} hover:bg-white/10`
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {config && <config.icon className="w-3.5 h-3.5" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card h-32 animate-pulse shimmer-bg" />
              ))}
            </div>
          ) : (
            <>
              {/* Result count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-white/60 text-sm">
                  <span className="text-white font-semibold">{projects.length}</span> proje & vaat
                </p>
              </div>

              {/* Key Promises */}
              {keyPromises.length > 0 && selectedCategory === 'Tümü' && (
                <div className="mb-10">
                  <h2 className="font-heading text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-dp-gold/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-dp-gold fill-dp-gold" />
                    </div>
                    Ana Seçim Vaatleri
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {keyPromises.map(p => <ProjectCard key={p.id} project={p} />)}
                  </div>
                </div>
              )}

              {/* Other Projects */}
              {otherProjects.length > 0 && (
                <div>
                  {selectedCategory === 'Tümü' && (
                    <h2 className="font-heading text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-dp-red/20 flex items-center justify-center">
                        <Target className="w-4 h-4 text-dp-red-light" />
                      </div>
                      Tüm Projeler & Taahhütler
                    </h2>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {(selectedCategory === 'Tümü' ? otherProjects : projects).map(p => (
                      <ProjectCard key={p.id} project={p} />
                    ))}
                  </div>
                </div>
              )}

              {projects.length === 0 && (
                <div className="text-center py-24">
                  <Target className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="font-heading text-white text-xl font-bold mb-2">Proje Bulunamadı</h3>
                  <p className="text-white/50">Bu kategoride henüz proje eklenmemiş.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
