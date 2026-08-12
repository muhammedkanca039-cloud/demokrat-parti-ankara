'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Search, Filter, X, Twitter, Instagram, Facebook, Linkedin,
  Users, MapPin, Award, ChevronRight, Star
} from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  title: string;
  region: string;
  photoUrl: string;
  bio: string;
  profession: string;
  expertise: string;
  isFeatured: boolean;
  order: number;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

const regions = ['Tümü', '1. Bölge', '2. Bölge', '3. Bölge'];

function CandidateModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const expertiseTags = candidate.expertise.split(',').map(e => e.trim());

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl glass-card overflow-hidden"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header photo */}
        <div className="relative h-60 overflow-hidden">
          <Image
            src={candidate.photoUrl}
            alt={candidate.name}
            fill
            className="object-cover object-top"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-dp-navy-mid" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          {candidate.isFeatured && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dp-gold/90 text-dp-navy text-xs font-bold">
              <Star className="w-3 h-3 fill-dp-navy" />
              Öne Çıkan Aday
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-dp-red/80 text-white mb-2">
              {candidate.region}
            </span>
            <h2 className="font-heading text-2xl font-bold text-white">{candidate.name}</h2>
            <p className="text-white/80 text-sm">{candidate.title}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-72 overflow-y-auto">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-dp-gold" />
            <span className="text-dp-gold font-semibold text-sm">{candidate.profession}</span>
          </div>

          <p className="text-white/80 text-sm leading-relaxed">{candidate.bio}</p>

          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-medium">Uzmanlık Alanları</p>
            <div className="flex flex-wrap gap-2">
              {expertiseTags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Social */}
          {(candidate.twitter || candidate.instagram || candidate.facebook || candidate.linkedin) && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
              {candidate.twitter && (
                <a href={candidate.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-all">
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </a>
              )}
              {candidate.instagram && (
                <a href={candidate.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 text-xs font-medium transition-all">
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </a>
              )}
              {candidate.facebook && (
                <a href={candidate.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-700/10 hover:bg-blue-700/20 text-blue-300 text-xs font-medium transition-all">
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </a>
              )}
              {candidate.linkedin && (
                <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 text-xs font-medium transition-all">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdaylarPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedRegion !== 'Tümü') params.set('region', selectedRegion);
    if (search) params.set('search', search);

    setLoading(true);
    fetch(`/api/candidates?${params}`).then(r => r.json()).then(d => {
      setCandidates(d);
      setLoading(false);
    });
  }, [selectedRegion, search]);

  const grouped = regions.slice(1).reduce((acc, region) => {
    const regionCandidates = candidates.filter(c => c.region === region);
    if (regionCandidates.length > 0) {
      acc[region] = regionCandidates;
    }
    return acc;
  }, {} as Record<string, Candidate[]>);

  const displayCandidates = selectedRegion === 'Tümü' ? candidates : candidates.filter(c => c.region === selectedRegion);

  return (
    <div className="min-h-screen bg-dp-navy">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 relative overflow-hidden hero-bg">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-dp-red/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-dp-red/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dp-red/10 border border-dp-red/20 text-dp-red-light text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Ankara Milletvekili Adayları
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-black text-white mb-4">
            Adaylarımız
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            Ankara'nın üç seçim bölgesinden demokrat, deneyimli ve ilkeli milletvekili adayları.
          </p>
          <div className="gold-line w-20 mt-6" />
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-dp-navy-mid border-b border-white/5 sticky top-16 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="candidate-search"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Aday ara: isim, meslek, uzmanlık..."
                className="input-field pl-11"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/50 shrink-0" />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {regions.map(r => (
                  <button
                    key={r}
                    id={`region-filter-${r}`}
                    onClick={() => setSelectedRegion(r)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedRegion === r
                        ? 'bg-dp-red text-white shadow-dp'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Candidates Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card h-80 animate-pulse">
                  <div className="h-48 bg-white/5 rounded-t-2xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="h-5 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-24">
              <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="font-heading text-white text-xl font-bold mb-2">Aday Bulunamadı</h3>
              <p className="text-white/50">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            </div>
          ) : (
            <div>
              {/* Results count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-white/60 text-sm">
                  <span className="text-white font-semibold">{candidates.length}</span> aday listeleniyor
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCandidates.map((c) => {
                  const tags = c.expertise.split(',').slice(0, 3).map(t => t.trim());
                  return (
                    <div
                      key={c.id}
                      className="glass-card-hover cursor-pointer overflow-hidden group"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      {/* Photo */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={c.photoUrl}
                          alt={c.name}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dp-navy-mid" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-dp-red/80 text-white backdrop-blur-sm">
                            {c.region}
                          </span>
                          {c.isFeatured && (
                            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-dp-gold/90 text-dp-navy flex items-center gap-1">
                              <Star className="w-3 h-3 fill-dp-navy" /> Öne Çıkan
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 right-3">
                          <div className="w-8 h-8 rounded-full bg-dp-red flex items-center justify-center shadow-dp opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <ChevronRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Award className="w-3.5 h-3.5 text-dp-gold" />
                          <span className="text-dp-gold text-xs font-medium">{c.profession}</span>
                        </div>
                        <h3 className="font-heading font-bold text-white text-xl mb-1">{c.name}</h3>
                        <p className="text-white/50 text-xs mb-3 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {c.title}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                        <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{c.bio}</p>

                        {/* Social icons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                          {c.twitter && <Twitter className="w-4 h-4 text-white/30 hover:text-blue-400 cursor-pointer transition-colors" />}
                          {c.instagram && <Instagram className="w-4 h-4 text-white/30 hover:text-pink-400 cursor-pointer transition-colors" />}
                          {c.facebook && <Facebook className="w-4 h-4 text-white/30 hover:text-blue-500 cursor-pointer transition-colors" />}
                          {c.linkedin && <Linkedin className="w-4 h-4 text-white/30 hover:text-blue-300 cursor-pointer transition-colors" />}
                          <span className="ml-auto text-white/30 text-xs flex items-center gap-1 group-hover:text-dp-red-light transition-colors">
                            Biyografi <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
