/**
 * src/app/admin/page.tsx
 *
 * Yönetim paneli sayfası — içerik yönetimi için kapsamlı bir yönetim arayüzü.
 *
 * Sekmeler:
 * - Dashboard  : Özet istatistikler (toplam aday, etkinlik, proje, gönüllü, mesaj sayısı).
 * - Adaylar    : Milletvekili adaylarını görüntüle, ekle, düzenle ve sil.
 * - Etkinlikler: Saha etkinliklerini görüntüle, ekle, düzenle ve sil.
 * - Projeler   : Seçim projelerini ve vaatlerini görüntüle, ekle, düzenle ve sil.
 * - Gönüllüler : Gönüllü kayıtlarını görüntüle; durumlarını güncelle ve sil.
 * - Mesajlar   : İletişim formundan gelen mesajları görüntüle; okundu işaretle ve sil.
 *
 * Tüm veriler ilgili REST API endpoint'lerinden dinamik olarak çekilir.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Calendar, Target, MessageSquare, Heart,
  Plus, Edit2, Trash2, Eye, Check, X, ChevronRight, Star,
  RefreshCw, ArrowLeft, Bell, Mail, MailOpen
} from 'lucide-react';


// Types
interface Candidate { id: number; name: string; title: string; region: string; profession: string; isFeatured: boolean; }
interface Project { id: number; title: string; category: string; isKeyPromise: boolean; }
interface Event { id: number; title: string; district: string; type: string; date: string; time: string; location: string; description: string; speaker?: string; }
interface Volunteer { id: number; fullName: string; email: string; phone: string; district: string; interests: string; status: string; createdAt: string; }
interface Message { id: number; fullName: string; email: string; subject: string; content: string; district?: string; isRead: boolean; createdAt: string; }

type Tab = 'dashboard' | 'candidates' | 'events' | 'projects' | 'volunteers' | 'messages';

const statusColors: Record<string, string> = {
  'Yeni': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'İletişime Geçildi': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Aktif Gönüllü': 'bg-green-500/20 text-green-300 border-green-500/30',
};

// Candidate Form Modal
function CandidateFormModal({
  candidate,
  onClose,
  onSave,
}: {
  candidate?: Candidate | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: candidate?.name || '',
    title: candidate?.title || '',
    region: candidate?.region || '1. Bölge',
    profession: candidate?.profession || '',
    photoUrl: '',
    bio: '',
    expertise: '',
    isFeatured: candidate?.isFeatured || false,
    order: 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = candidate ? 'PUT' : 'POST';
      const url = candidate ? `/api/candidates/${candidate.id}` : '/api/candidates';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      onSave();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-lg glass-card p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-white text-xl">
            {candidate ? 'Aday Düzenle' : 'Yeni Aday Ekle'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Ad Soyad *</label>
            <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Dr. Ahmet Yılmaz" />
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Aday Unvanı *</label>
            <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Ankara 1. Bölge 1. Sıra" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-xs mb-1.5 block">Bölge *</label>
              <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="select-field">
                <option value="1. Bölge">1. Bölge</option>
                <option value="2. Bölge">2. Bölge</option>
                <option value="3. Bölge">3. Bölge</option>
              </select>
            </div>
            <div>
              <label className="text-white/70 text-xs mb-1.5 block">Sıra</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="input-field" min={0} />
            </div>
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Meslek / Unvan *</label>
            <input required type="text" value={form.profession} onChange={e => setForm({ ...form, profession: e.target.value })} className="input-field" placeholder="Ekonomist & Stratejist" />
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Uzmanlık Alanları</label>
            <input type="text" value={form.expertise} onChange={e => setForm({ ...form, expertise: e.target.value })} className="input-field" placeholder="Kamu Maliyesi, Yerel Kalkınma" />
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Fotoğraf URL</label>
            <input type="url" value={form.photoUrl} onChange={e => setForm({ ...form, photoUrl: e.target.value })} className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Biyografi</label>
            <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field resize-none" placeholder="Adayın kısa biyografisi..." />
          </div>
          <div className="flex items-center gap-3">
            <input id="is-featured" type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-dp-red" />
            <label htmlFor="is-featured" className="text-white/80 text-sm">Anasayfada Öne Çıkar</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">İptal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kaydediliyor...</> : <><Check className="w-4 h-4" /> Kaydet</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Event Form Modal
function EventFormModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ title: '', district: 'Çankaya', location: '', date: '', time: '10:00', description: '', speaker: '', type: 'Miting' });
  const [saving, setSaving] = useState(false);
  const districts = ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı', 'Polatlı'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: new Date(form.date).toISOString() }),
      });
      onSave();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-lg glass-card p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-white text-xl">Yeni Etkinlik Ekle</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Etkinlik Adı *</label>
            <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-xs mb-1.5 block">İlçe *</label>
              <select value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} className="select-field">
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/70 text-xs mb-1.5 block">Etkinlik Türü</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="select-field">
                <option value="Miting">Miting</option>
                <option value="Esnaf Ziyareti">Esnaf Ziyareti</option>
                <option value="Gençlik Buluşması">Gençlik Buluşması</option>
                <option value="Saha Çalışması">Saha Çalışması</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Konum / Mekan *</label>
            <input required type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-xs mb-1.5 block">Tarih *</label>
              <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-white/70 text-xs mb-1.5 block">Saat *</label>
              <input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Konuşmacı</label>
            <input type="text" value={form.speaker} onChange={e => setForm({ ...form, speaker: e.target.value })} className="input-field" placeholder="İsim ve unvan..." />
          </div>
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Açıklama</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">İptal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Kaydediliyor...</> : <><Plus className="w-4 h-4" />Ekle</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [c, p, e, v, m] = await Promise.all([
        fetch('/api/candidates').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/events').then(r => r.json()),
        fetch('/api/volunteers').then(r => r.json()),
        fetch('/api/messages').then(r => r.json()),
      ]);
      setCandidates(c);
      setProjects(p);
      setEvents(e);
      setVolunteers(v);
      setMessages(m);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteCandidate = async (id: number) => {
    if (!confirm('Bu adayı silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const deleteEvent = async (id: number) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const updateVolunteerStatus = async (id: number, status: string) => {
    await fetch(`/api/volunteers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const markMessageRead = async (id: number) => {
    await fetch(`/api/messages/${id}`, { method: 'PATCH' });
    fetchData();
  };

  const deleteMessage = async (id: number) => {
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  const navItems: { tab: Tab; icon: React.ElementType; label: string; badge?: number }[] = [
    { tab: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { tab: 'candidates', icon: Users, label: 'Adaylar', badge: candidates.length },
    { tab: 'events', icon: Calendar, label: 'Etkinlikler', badge: events.length },
    { tab: 'projects', icon: Target, label: 'Projeler', badge: projects.length },
    { tab: 'volunteers', icon: Heart, label: 'Gönüllüler', badge: volunteers.length },
    { tab: 'messages', icon: MessageSquare, label: 'Mesajlar', badge: unreadCount || undefined },
  ];

  return (
    <div className="min-h-screen bg-dp-navy flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dp-navy-mid border-r border-white/5 flex flex-col shrink-0 hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-dp-red rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-white text-sm">Yönetim Paneli</div>
              <div className="text-white/40 text-xs">Demokrat Parti Ankara</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ tab, icon: Icon, label, badge }) => (
            <button
              key={tab}
              id={`admin-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-dp-red text-white shadow-dp'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {label}
              </div>
              {badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab ? 'bg-white/20 text-white' :
                  tab === 'messages' && badge > 0 ? 'bg-dp-red text-white' : 'bg-white/10 text-white/60'
                }`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Back to site */}
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/50 hover:text-white text-sm transition-colors hover:bg-white/5">
            <ArrowLeft className="w-4 h-4" />
            Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="h-16 bg-dp-navy-mid border-b border-white/5 flex items-center px-6 gap-4 sticky top-0 z-20">
          <div className="flex-1">
            <h1 className="font-heading font-bold text-white">
              {navItems.find(n => n.tab === activeTab)?.label}
            </h1>
          </div>
          <button
            onClick={fetchData}
            className={`p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all ${loading ? 'animate-spin' : ''}`}
            title="Yenile"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dp-red/10 border border-dp-red/20">
              <Bell className="w-4 h-4 text-dp-red-light" />
              <span className="text-dp-red-light text-xs font-bold">{unreadCount} yeni mesaj</span>
            </div>
          )}
        </header>

        <div className="p-6 max-w-6xl">
          {/* Mobile nav */}
          <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2">
            {navItems.map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all shrink-0 ${
                  activeTab === tab ? 'bg-dp-red text-white' : 'bg-white/5 text-white/60 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Adaylar', val: candidates.length, icon: Users, color: 'text-blue-300', bg: 'bg-blue-500/10' },
                  { label: 'Etkinlikler', val: events.length, icon: Calendar, color: 'text-red-300', bg: 'bg-dp-red/10' },
                  { label: 'Projeler', val: projects.length, icon: Target, color: 'text-yellow-300', bg: 'bg-yellow-500/10' },
                  { label: 'Gönüllüler', val: volunteers.length, icon: Heart, color: 'text-green-300', bg: 'bg-green-500/10' },
                  { label: 'Okunmamış', val: unreadCount, icon: MessageSquare, color: 'text-purple-300', bg: 'bg-purple-500/10' },
                ].map(({ label, val, icon: Icon, color, bg }) => (
                  <div key={label} className="glass-card p-5 flex flex-col gap-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-white text-3xl">{val}</div>
                      <div className="text-white/50 text-xs mt-0.5">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="font-heading font-bold text-white text-xl mb-4">Hızlı İşlemler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Yeni Aday Ekle', desc: 'Adaylar listesine yeni isim ekle', icon: Users, action: () => { setShowCandidateForm(true); setEditingCandidate(null); } },
                    { label: 'Yeni Etkinlik Ekle', desc: 'Saha programına etkinlik ekle', icon: Calendar, action: () => setShowEventForm(true) },
                    { label: 'Mesajları Görüntüle', desc: `${unreadCount} okunmamış mesaj var`, icon: MessageSquare, action: () => setActiveTab('messages') },
                  ].map(({ label, desc, icon: Icon, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className="glass-card-hover p-5 flex items-center gap-4 text-left group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-dp-red/10 border border-dp-red/20 flex items-center justify-center group-hover:bg-dp-red/20 transition-all">
                        <Icon className="w-6 h-6 text-dp-red-light" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{label}</div>
                        <div className="text-white/50 text-xs mt-0.5">{desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-dp-red ml-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent volunteers */}
              <div>
                <h2 className="font-heading font-bold text-white text-xl mb-4">Son Gönüllü Kayıtları</h2>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left px-4 py-3 text-white/50 font-medium">Ad Soyad</th>
                          <th className="text-left px-4 py-3 text-white/50 font-medium hidden sm:table-cell">İlçe</th>
                          <th className="text-left px-4 py-3 text-white/50 font-medium">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers.slice(0, 5).map(v => (
                          <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-medium text-white">{v.fullName}</div>
                              <div className="text-white/40 text-xs">{v.email}</div>
                            </td>
                            <td className="px-4 py-3 text-white/70 hidden sm:table-cell">{v.district}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[v.status] || 'bg-white/10 text-white border-white/20'}`}>
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CANDIDATES ── */}
          {activeTab === 'candidates' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-sm"><span className="text-white font-semibold">{candidates.length}</span> aday</p>
                <button
                  id="add-candidate-btn"
                  onClick={() => { setShowCandidateForm(true); setEditingCandidate(null); }}
                  className="btn-primary flex items-center gap-2 text-sm py-2.5"
                >
                  <Plus className="w-4 h-4" /> Yeni Aday
                </button>
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-white/50 font-medium">Ad Soyad</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium hidden md:table-cell">Bölge</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium hidden md:table-cell">Meslek</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium">Öne Çıkan</th>
                        <th className="text-right px-4 py-3 text-white/50 font-medium">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map(c => (
                        <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white">{c.name}</div>
                            <div className="text-white/40 text-xs line-clamp-1">{c.title}</div>
                          </td>
                          <td className="px-4 py-3 text-white/70 hidden md:table-cell">{c.region}</td>
                          <td className="px-4 py-3 text-white/70 hidden md:table-cell line-clamp-1">{c.profession}</td>
                          <td className="px-4 py-3">
                            {c.isFeatured ? (
                              <span className="flex items-center gap-1 text-dp-gold text-xs"><Star className="w-3 h-3 fill-dp-gold" /> Evet</span>
                            ) : (
                              <span className="text-white/30 text-xs">Hayır</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setEditingCandidate(c); setShowCandidateForm(true); }}
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all"
                                title="Düzenle"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteCandidate(c.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── EVENTS ── */}
          {activeTab === 'events' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-sm"><span className="text-white font-semibold">{events.length}</span> etkinlik</p>
                <button
                  id="add-event-btn"
                  onClick={() => setShowEventForm(true)}
                  className="btn-primary flex items-center gap-2 text-sm py-2.5"
                >
                  <Plus className="w-4 h-4" /> Yeni Etkinlik
                </button>
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-white/50 font-medium">Etkinlik</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium hidden md:table-cell">Tarih</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium hidden md:table-cell">İlçe</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium">Tür</th>
                        <th className="text-right px-4 py-3 text-white/50 font-medium">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white line-clamp-1">{ev.title}</div>
                            <div className="text-white/40 text-xs line-clamp-1">{ev.location}</div>
                          </td>
                          <td className="px-4 py-3 text-white/70 hidden md:table-cell">
                            {new Date(ev.date).toLocaleDateString('tr-TR')} · {ev.time}
                          </td>
                          <td className="px-4 py-3 text-white/70 hidden md:table-cell">{ev.district}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-dp-red/20 text-red-300">{ev.type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => deleteEvent(ev.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {activeTab === 'projects' && (
            <div className="space-y-5">
              <p className="text-white/60 text-sm"><span className="text-white font-semibold">{projects.length}</span> proje & vaat</p>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-white/50 font-medium">Proje Adı</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium hidden md:table-cell">Kategori</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium">Ana Vaat</th>
                        <th className="text-right px-4 py-3 text-white/50 font-medium">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white line-clamp-1">{p.title}</div>
                          </td>
                          <td className="px-4 py-3 text-white/70 hidden md:table-cell">{p.category}</td>
                          <td className="px-4 py-3">
                            {p.isKeyPromise ? (
                              <span className="flex items-center gap-1 text-dp-gold text-xs"><Star className="w-3 h-3 fill-dp-gold" /> Evet</span>
                            ) : (
                              <span className="text-white/30 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => deleteProject(p.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── VOLUNTEERS ── */}
          {activeTab === 'volunteers' && (
            <div className="space-y-5">
              <p className="text-white/60 text-sm"><span className="text-white font-semibold">{volunteers.length}</span> gönüllü kaydı</p>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-white/50 font-medium">Gönüllü</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium hidden md:table-cell">İlçe</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium hidden lg:table-cell">İlgi Alanı</th>
                        <th className="text-left px-4 py-3 text-white/50 font-medium">Durum</th>
                        <th className="text-right px-4 py-3 text-white/50 font-medium">Güncelle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteers.map(v => (
                        <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white">{v.fullName}</div>
                            <div className="text-white/40 text-xs">{v.phone}</div>
                          </td>
                          <td className="px-4 py-3 text-white/70 hidden md:table-cell">{v.district}</td>
                          <td className="px-4 py-3 text-white/60 hidden lg:table-cell text-xs line-clamp-1">{v.interests}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[v.status] || 'bg-white/10 text-white border-white/20'}`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {['Yeni', 'İletişime Geçildi', 'Aktif Gönüllü'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateVolunteerStatus(v.id, s)}
                                  title={s}
                                  className={`w-2.5 h-2.5 rounded-full transition-all hover:scale-125 ${
                                    v.status === s ? (
                                      s === 'Yeni' ? 'bg-blue-400' :
                                      s === 'İletişime Geçildi' ? 'bg-yellow-400' : 'bg-green-400'
                                    ) : 'bg-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                <span className="text-white font-semibold">{messages.length}</span> mesaj · <span className="text-dp-red-light font-semibold">{unreadCount}</span> okunmamış
              </p>
              {messages.length === 0 ? (
                <div className="text-center py-16 glass-card">
                  <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50">Henüz mesaj yok.</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`glass-card overflow-hidden transition-all duration-200 ${!msg.isRead ? 'border-l-2 border-l-dp-red' : ''}`}>
                    <div
                      className="p-5 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => {
                        setExpandedMessage(expandedMessage === msg.id ? null : msg.id);
                        if (!msg.isRead) markMessageRead(msg.id);
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!msg.isRead ? 'bg-dp-red/20' : 'bg-white/5'}`}>
                            {msg.isRead ? <MailOpen className="w-4 h-4 text-white/40" /> : <Mail className="w-4 h-4 text-dp-red-light" />}
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${!msg.isRead ? 'text-white' : 'text-white/70'}`}>
                              {msg.fullName} · <span className="text-white/40 font-normal">{msg.email}</span>
                            </div>
                            <div className={`text-sm mt-0.5 ${!msg.isRead ? 'text-white font-semibold' : 'text-white/60'}`}>
                              {msg.subject}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-white/30 text-xs hidden sm:block">
                            {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); deleteMessage(msg.id); }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedMessage === msg.id && (
                      <div className="px-5 pb-5 pt-0 border-t border-white/10 mt-0">
                        <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-3 mt-4">
                          {msg.district && <span>📍 {msg.district}</span>}
                          <span>{new Date(msg.createdAt).toLocaleString('tr-TR')}</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showCandidateForm && (
        <CandidateFormModal
          candidate={editingCandidate}
          onClose={() => { setShowCandidateForm(false); setEditingCandidate(null); }}
          onSave={fetchData}
        />
      )}
      {showEventForm && (
        <EventFormModal
          onClose={() => setShowEventForm(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
}
