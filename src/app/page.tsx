/**
 * src/app/page.tsx
 *
 * Anasayfa (/) — Demokrat Parti Ankara web sitesinin ana giriş sayfası.
 *
 * Bölümler:
 * - Hero         : Tam ekran açılış banneri, slogan ve CTA butonları.
 * - Öne Çıkan    : Öne çıkarılmış milletvekili adayları carousel/grid gösterimi.
 * - Projeler     : Ana seçim vaatlerinden öne çıkanların özet listesi.
 * - Etkinlikler  : Yaklaşan saha etkinlikleri takvimi.
 * - Gönüllü Formu: Ziyaretçilerin gönüllü olarak kaydolabileceği form.
 * - İletişim     : Mesaj gönderme formu (iletişim bilgileri ile birlikte).
 *
 * Tüm dinamik içerik (adaylar, projeler, etkinlikler) ilgili REST API
 * endpoint'lerinden çekilir. Gönüllü ve iletişim formları POST isteği gönderir.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ChevronRight, Star, Users, Calendar, Target, CheckCircle2,
  MapPin, Clock, Megaphone, X, Twitter, Instagram, Facebook, Linkedin,
  Zap, TrendingUp, Building2, Sprout, Train, HeartHandshake, ArrowRight,
  Phone, Mail, Award, Shield
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
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  summary: string;
  icon: string;
  isKeyPromise: boolean;
}

interface Event {
  id: number;
  title: string;
  district: string;
  location: string;
  date: string;
  time: string;
  type: string;
  speaker?: string;
}

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, Building2, Sprout, Train, Zap, HeartHandshake, Shield, Award
};

const categoryColors: Record<string, string> = {
  'Ekonomi': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Ankara Yerel Projeler': 'bg-dp-red/20 text-red-300 border-dp-red/30',
  'Gençlik': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Tarım': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Sanayi & Ulaşım': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

const eventTypeColors: Record<string, string> = {
  'Miting': 'bg-dp-red/20 text-red-300',
  'Esnaf Ziyareti': 'bg-yellow-500/20 text-yellow-300',
  'Gençlik Buluşması': 'bg-purple-500/20 text-purple-300',
  'Saha Çalışması': 'bg-green-500/20 text-green-300',
};

function CandidateModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const expertiseTags = candidate.expertise.split(',').map(e => e.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl glass-card p-0 overflow-hidden modal-content"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={candidate.photoUrl}
            alt={candidate.name}
            fill
            className="object-cover object-top"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-dp-navy-mid" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 p-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-dp-red/80 text-white mb-2">
              {candidate.region}
            </div>
            <h2 className="font-heading text-2xl font-bold text-white">{candidate.name}</h2>
            <p className="text-white/80 text-sm">{candidate.title}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-80 overflow-y-auto">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-dp-gold" />
            <span className="text-dp-gold font-medium text-sm">{candidate.profession}</span>
          </div>

          <p className="text-white/80 text-sm leading-relaxed">{candidate.bio}</p>

          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Uzmanlık Alanları</p>
            <div className="flex flex-wrap gap-2">
              {expertiseTags.map((tag) => (
                <span key={tag} className="tag text-xs">{tag}</span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 pt-2 border-t border-white/10">
            {candidate.twitter && (
              <a href={candidate.twitter} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm transition-all">
                <Twitter className="w-4 h-4" /> Twitter
              </a>
            )}
            {candidate.instagram && (
              <a href={candidate.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 text-sm transition-all">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            )}
            {candidate.linkedin && (
              <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-700/10 hover:bg-blue-700/20 text-blue-300 text-sm transition-all">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [volunteerForm, setVolunteerForm] = useState({
    fullName: '', email: '', phone: '', district: '', interests: '', note: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [counter, setCounter] = useState({ candidates: 0, events: 0, volunteers: 0, districts: 0 });

  useEffect(() => {
    fetch('/api/candidates?featured=true').then(r => r.json()).then(setCandidates);
    fetch('/api/projects?keyOnly=true').then(r => r.json()).then(setProjects);
    fetch('/api/events').then(r => r.json()).then(d => setEvents(d.slice(0, 3)));
  }, []);

  // Animated counters
  useEffect(() => {
    const targets = { candidates: 6, events: 12, volunteers: 340, districts: 25 };
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounter({
        candidates: Math.round(targets.candidates * progress),
        events: Math.round(targets.events * progress),
        volunteers: Math.round(targets.volunteers * progress),
        districts: Math.round(targets.districts * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  async function handleVolunteerSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerForm),
      });
      if (res.ok) {
        setFormStatus('success');
        setVolunteerForm({ fullName: '', email: '', phone: '', district: '', interests: '', note: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
    setTimeout(() => setFormStatus('idle'), 4000);
  }

  const districts = ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı', 'Polatlı', 'Beypazarı'];

  return (
    <div className="min-h-screen bg-dp-navy">
      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-bg">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-dp-red/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-dp-red/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-dp-red/5 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dp-red/10 border border-dp-red/30 text-dp-red-light text-sm font-medium mb-8">
              <Star className="w-4 h-4 fill-dp-red-light" />
              <span>2026 Milletvekili Seçimleri · Ankara</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-6">
              Ankara İçin
              <span className="block text-gradient mt-2">Yeni Bir Devir</span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Demokrat Parti'nin güçlü Ankara kadrosu, başkentin hak ettiği kalkınmayı, adaleti ve refahı gerçekleştirmek için sahada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/adaylar" className="btn-primary flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                <span>Adaylarımızı Keşfet</span>
              </Link>
              <Link href="/projeler" className="btn-secondary flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                <span>Seçim Vaatleri</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14">
              {[
                { val: counter.candidates, label: 'Güçlü Aday', suffix: '' },
                { val: counter.events, label: 'Saha Etkinliği', suffix: '+' },
                { val: counter.volunteers, label: 'Gönüllü', suffix: '+' },
                { val: counter.districts, label: 'İlçe', suffix: '' },
              ].map(({ val, label, suffix }) => (
                <div key={label} className="glass-card p-4 text-center">
                  <div className="font-heading text-2xl font-bold text-dp-red-light">
                    {val}{suffix}
                  </div>
                  <div className="text-white/60 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-96 h-96">
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border border-dp-red/20 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-dp-gold/20 animate-[spin_20s_linear_infinite_reverse]" />

              {/* Center DP emblem */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-dp-red-dark to-dp-red flex items-center justify-center shadow-dp-lg">
                <div className="text-center">
                  <Star className="w-16 h-16 text-white fill-white mx-auto mb-2" />
                  <div className="font-heading font-black text-white text-xl tracking-widest">DP</div>
                  <div className="text-white/70 text-xs">ANKARA</div>
                </div>
              </div>

              {/* Floating tags */}
              {[
                { label: 'Ekonomi', deg: 0, color: 'bg-blue-500' },
                { label: 'Gençlik', deg: 72, color: 'bg-purple-500' },
                { label: 'Tarım', deg: 144, color: 'bg-green-500' },
                { label: 'Ulaşım', deg: 216, color: 'bg-orange-500' },
                { label: 'Adalet', deg: 288, color: 'bg-dp-red' },
              ].map(({ label, deg, color }) => {
                const rad = (deg - 90) * (Math.PI / 180);
                const r = 170;
                const x = 192 + r * Math.cos(rad) - 36;
                const y = 192 + r * Math.sin(rad) - 16;
                return (
                  <div
                    key={label}
                    className={`absolute px-3 py-1.5 rounded-full text-xs font-medium text-white ${color}/80 backdrop-blur-sm border border-white/20 animate-float`}
                    style={{ left: x, top: y, animationDelay: `${deg / 100}s` }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/40 text-xs">Aşağı kaydır</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ===================== FEATURED CANDIDATES ===================== */}
      <section id="adaylar" className="py-24 bg-dp-navy-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dp-red/10 border border-dp-red/20 text-dp-red-light text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Öne Çıkan Adaylar
            </div>
            <h2 className="section-title mb-4">Güçlü Bir Kadro,<br /><span className="text-gradient">Güçlü Bir Ankara</span></h2>
            <p className="section-subtitle">Her bölgeden uzman, her alandan deneyim.</p>
            <div className="gold-line w-20 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((c) => {
              const tags = c.expertise.split(',').slice(0, 2).map(t => t.trim());
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
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-dp-red/80 text-white backdrop-blur-sm">
                        {c.region}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="w-8 h-8 rounded-full bg-dp-red flex items-center justify-center shadow-dp opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-3.5 h-3.5 text-dp-gold" />
                      <span className="text-dp-gold text-xs font-medium">{c.profession}</span>
                    </div>
                    <h3 className="font-heading font-bold text-white text-lg mb-1">{c.name}</h3>
                    <p className="text-white/50 text-xs mb-3 line-clamp-1">{c.title}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <p className="text-white/50 text-xs mt-3 line-clamp-2 leading-relaxed">{c.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/adaylar" className="btn-primary inline-flex items-center gap-2">
              <span>Tüm Adayları Gör</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== KEY PROJECTS ===================== */}
      <section id="projeler" className="py-24 bg-dp-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dp-gold/10 border border-dp-gold/20 text-dp-gold text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              Seçim Bildirgesi
            </div>
            <h2 className="section-title mb-4">Ankara'ya <span className="text-gradient-red">Söz Verdik</span></h2>
            <p className="section-subtitle">Somut projeler, ölçülebilir hedefler, hesap verebilir siyaset.</p>
            <div className="gold-line w-20 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => {
              const Icon = iconMap[p.icon] || TrendingUp;
              const colorClass = categoryColors[p.category] || 'bg-white/10 text-white border-white/20';
              return (
                <div key={p.id} className="glass-card-hover p-6 group">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-dp-red/10 border border-dp-red/20 flex items-center justify-center mb-4 group-hover:bg-dp-red/20 transition-all duration-300">
                    <Icon className="w-6 h-6 text-dp-red-light" />
                  </div>

                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mb-3 ${colorClass}`}>
                    {p.category}
                  </div>

                  <h3 className="font-heading font-bold text-white text-lg mb-3 leading-tight">{p.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{p.summary}</p>

                  {p.isKeyPromise && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                      <CheckCircle2 className="w-4 h-4 text-dp-gold" />
                      <span className="text-dp-gold text-xs font-medium">Ana Seçim Vaadi</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/projeler" className="btn-secondary inline-flex items-center gap-2">
              <span>Tüm Projeleri İncele</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== UPCOMING EVENTS ===================== */}
      <section id="etkinlikler" className="py-24 bg-dp-navy-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dp-red/10 border border-dp-red/20 text-dp-red-light text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              Saha Etkinlikleri
            </div>
            <h2 className="section-title mb-4">İlçe İlçe <span className="text-gradient">Ankara'dayız</span></h2>
            <p className="section-subtitle">Yaklaşan mitingler, esnaf ziyaretleri ve gençlik buluşmaları.</p>
            <div className="gold-line w-20 mx-auto mt-6" />
          </div>

          <div className="space-y-4">
            {events.map((ev) => {
              const date = new Date(ev.date);
              const typeColor = eventTypeColors[ev.type] || 'bg-white/10 text-white/70';
              return (
                <div key={ev.id} className="glass-card-hover p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center group">
                  {/* Date Box */}
                  <div className="w-16 h-16 rounded-2xl bg-dp-red/10 border border-dp-red/20 flex flex-col items-center justify-center shrink-0 group-hover:bg-dp-red/20 transition-all">
                    <span className="font-heading font-bold text-white text-lg leading-none">
                      {date.getDate()}
                    </span>
                    <span className="text-dp-red-light text-xs font-medium">
                      {date.toLocaleString('tr-TR', { month: 'short' })}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                        {ev.type}
                      </span>
                      <span className="flex items-center gap-1 text-white/50 text-xs">
                        <MapPin className="w-3 h-3" /> {ev.district}
                      </span>
                      <span className="flex items-center gap-1 text-white/50 text-xs">
                        <Clock className="w-3 h-3" /> {ev.time}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-white text-lg leading-tight">{ev.title}</h3>
                    <p className="text-white/50 text-sm mt-1 line-clamp-1">{ev.location}</p>
                    {ev.speaker && (
                      <p className="text-dp-gold/80 text-xs mt-1 flex items-center gap-1">
                        <Megaphone className="w-3 h-3" /> {ev.speaker}
                      </p>
                    )}
                  </div>

                  <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-dp-red transition-all shrink-0 hidden sm:block" />
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/etkinlikler" className="btn-primary inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Tüm Etkinlik Takvimine Git</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== VOLUNTEER SECTION ===================== */}
      <section id="gonullu" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
                <Star className="w-4 h-4 text-dp-gold fill-dp-gold" />
                Gönüllü Ol
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ankara'nın<br />Geleceğini Birlikte<br />
                <span className="text-gradient">Şekillendirelim</span>
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Demokrat Parti'nin Ankara ekibine katılın. Saha çalışmalarından sosyal medyaya, esnaf ziyaretlerinden sandık güvenliğine kadar her katkı değerlidir.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Users, text: 'Saha Kampanya Ekiplerine Katıl' },
                  { icon: Megaphone, text: 'Sosyal Medya & Dijital Gönüllüsü Ol' },
                  { icon: Shield, text: 'Sandık Görevlisi Kaydı Yap' },
                  { icon: MapPin, text: 'İlçende Gönüllü Koordinatör Ol' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-dp-gold" />
                    </div>
                    <span className="text-white/90 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="glass-card p-8">
              <h3 className="font-heading font-bold text-white text-2xl mb-6">Gönüllü Kayıt Formu</h3>

              {formStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-xl mb-2">Kaydınız Alındı!</h4>
                  <p className="text-white/70">Demokrat Parti Ankara ekibi en kısa sürede sizinle iletişime geçecektir.</p>
                </div>
              ) : (
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-xs mb-1.5 block">Ad Soyad *</label>
                      <input
                        id="volunteer-fullname"
                        type="text"
                        required
                        value={volunteerForm.fullName}
                        onChange={e => setVolunteerForm({ ...volunteerForm, fullName: e.target.value })}
                        placeholder="Ahmet Yılmaz"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-xs mb-1.5 block">Telefon *</label>
                      <input
                        id="volunteer-phone"
                        type="tel"
                        required
                        value={volunteerForm.phone}
                        onChange={e => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                        placeholder="0532 123 45 67"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-xs mb-1.5 block">E-posta *</label>
                    <input
                      id="volunteer-email"
                      type="email"
                      required
                      value={volunteerForm.email}
                      onChange={e => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                      placeholder="ornek@email.com"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-white/70 text-xs mb-1.5 block">İlçeniz *</label>
                    <select
                      id="volunteer-district"
                      required
                      value={volunteerForm.district}
                      onChange={e => setVolunteerForm({ ...volunteerForm, district: e.target.value })}
                      className="select-field"
                    >
                      <option value="">İlçe seçin...</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-white/70 text-xs mb-1.5 block">İlgi Alanı</label>
                    <select
                      id="volunteer-interests"
                      value={volunteerForm.interests}
                      onChange={e => setVolunteerForm({ ...volunteerForm, interests: e.target.value })}
                      className="select-field"
                    >
                      <option value="">Destek vermek istediğiniz alan...</option>
                      <option value="Saha Çalışması & Broşür Dağıtımı">Saha Çalışması & Broşür Dağıtımı</option>
                      <option value="Sosyal Medya & Dijital İletişim">Sosyal Medya & Dijital İletişim</option>
                      <option value="Sandık Güvenliği">Sandık Güvenliği</option>
                      <option value="Esnaf & Mahalle Ziyaretleri">Esnaf & Mahalle Ziyaretleri</option>
                      <option value="Genel Destek">Genel Destek</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/70 text-xs mb-1.5 block">Notunuz</label>
                    <textarea
                      id="volunteer-note"
                      rows={3}
                      value={volunteerForm.note}
                      onChange={e => setVolunteerForm({ ...volunteerForm, note: e.target.value })}
                      placeholder="Ek bilgi veya önerileriniz..."
                      className="input-field resize-none"
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="text-red-400 text-sm bg-red-500/10 px-4 py-3 rounded-xl">
                      Kayıt oluşturulurken hata oluştu. Lütfen tekrar deneyin.
                    </p>
                  )}

                  <button
                    id="volunteer-submit-btn"
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" />
                        <span>Gönüllü Kaydımı Tamamla</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONTACT SECTION ===================== */}
      <section id="iletisim" className="py-24 bg-dp-navy-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dp-red/10 border border-dp-red/20 text-dp-red-light text-sm font-medium mb-4">
              <Mail className="w-4 h-4" />
              Bize Ulaşın
            </div>
            <h2 className="section-title mb-4">Sorunlarınızı <span className="text-gradient">Dinliyoruz</span></h2>
            <p className="section-subtitle">Ankara'nın sorunlarını biliyoruz, çözümleri birlikte üretiyoruz. Bize yazın.</p>
            <div className="gold-line w-20 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="glass-card p-6 flex items-start gap-4 group hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-dp-red/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-dp-red-light" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white mb-2">İl Başkanlığı</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Kızılay Mah. Mithatpaşa Cad. No:12<br />
                    Çankaya / Ankara
                  </p>
                </div>
              </div>
              <div className="glass-card p-6 flex items-start gap-4 group hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-dp-red/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-dp-red-light" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white mb-2">Telefon</h4>
                  <p className="text-white/60 text-sm">0312 123 45 67</p>
                </div>
              </div>
              <div className="glass-card p-6 flex items-start gap-4 group hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-dp-red/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-dp-red-light" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white mb-2">E-posta</h4>
                  <p className="text-white/60 text-sm">ankara@demokratparti.org.tr</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8">
              <h3 className="font-heading font-bold text-white text-2xl mb-6">Mesaj Gönderin</h3>
              <form id="contact-form" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                const originalText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = 'Gönderiliyor...';
                
                try {
                  const res = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      fullName: (form.elements.namedItem('fullName') as HTMLInputElement).value,
                      email: (form.elements.namedItem('email') as HTMLInputElement).value,
                      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
                      district: (form.elements.namedItem('district') as HTMLSelectElement).value,
                      content: (form.elements.namedItem('content') as HTMLTextAreaElement).value,
                    })
                  });
                  if (res.ok) {
                    alert('Mesajınız başarıyla gönderildi!');
                    form.reset();
                  } else {
                    alert('Bir hata oluştu, lütfen tekrar deneyin.');
                  }
                } catch {
                  alert('Bir hata oluştu, lütfen tekrar deneyin.');
                }
                btn.disabled = false;
                btn.innerHTML = originalText;
              }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-xs mb-1.5 block">Ad Soyad *</label>
                    <input name="fullName" type="text" required placeholder="Adınız Soyadınız" className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-1.5 block">E-posta *</label>
                    <input name="email" type="email" required placeholder="E-posta adresiniz" className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-xs mb-1.5 block">Konu *</label>
                    <input name="subject" type="text" required placeholder="Mesajınızın konusu" className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-1.5 block">İlçe</label>
                    <select name="district" className="select-field">
                      <option value="">İlçe seçin...</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-white/70 text-xs mb-1.5 block">Mesajınız *</label>
                  <textarea name="content" required rows={4} placeholder="Bize iletmek istediğiniz mesaj..." className="input-field resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Mesajı Gönder</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Candidate Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
