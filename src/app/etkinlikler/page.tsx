'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Calendar, MapPin, Clock, Megaphone, Filter, Search, X,
  Flag, Users, Coffee, Briefcase
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  district: string;
  location: string;
  date: string;
  time: string;
  description: string;
  speaker?: string;
  type: string;
}

const districts = ['Tümü', 'Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı', 'Polatlı'];
const eventTypes = ['Tümü', 'Miting', 'Esnaf Ziyareti', 'Gençlik Buluşması', 'Saha Çalışması'];

const typeConfig: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  'Miting': { color: 'text-red-300', bg: 'bg-dp-red/20', border: 'border-dp-red/30', icon: Flag },
  'Esnaf Ziyareti': { color: 'text-yellow-300', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: Coffee },
  'Gençlik Buluşması': { color: 'text-purple-300', bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: Users },
  'Saha Çalışması': { color: 'text-green-300', bg: 'bg-green-500/20', border: 'border-green-500/30', icon: Briefcase },
};

function EventCard({ event }: { event: Event }) {
  const date = new Date(event.date);
  const config = typeConfig[event.type] || { color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', icon: Calendar };
  const TypeIcon = config.icon;

  const isUpcoming = date > new Date();

  return (
    <div className={`glass-card-hover p-6 flex flex-col sm:flex-row gap-5 group ${isUpcoming ? 'border-l-2 border-l-dp-red' : 'opacity-80'}`}>
      {/* Date */}
      <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-1 shrink-0">
        <div className="w-16 h-16 rounded-2xl bg-dp-red/10 border border-dp-red/20 flex flex-col items-center justify-center group-hover:bg-dp-red/20 transition-all duration-300">
          <span className="font-heading font-bold text-white text-xl leading-none">{date.getDate()}</span>
          <span className="text-dp-red-light text-xs font-medium">
            {date.toLocaleString('tr-TR', { month: 'short' })}
          </span>
        </div>
        <span className="text-white/40 text-xs sm:text-center">
          {date.toLocaleString('tr-TR', { weekday: 'short' })}
        </span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-white/10" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}>
            <TypeIcon className="w-3 h-3" />
            {event.type}
          </span>
          {!isUpcoming && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/40 border border-white/10">
              Tamamlandı
            </span>
          )}
        </div>

        <h3 className="font-heading font-bold text-white text-xl mb-2 leading-tight">{event.title}</h3>

        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-3">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-dp-red-light shrink-0" />
            <span className="line-clamp-1">{event.location}, {event.district}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-dp-red-light shrink-0" />
            {event.time}
          </span>
        </div>

        <p className="text-white/60 text-sm leading-relaxed line-clamp-2">{event.description}</p>

        {event.speaker && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            <Megaphone className="w-3.5 h-3.5 text-dp-gold" />
            <span className="text-dp-gold/80 text-xs font-medium">{event.speaker}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EtkinliklerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('Tümü');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedDistrict !== 'Tümü') params.set('district', selectedDistrict);
    if (selectedType !== 'Tümü') params.set('type', selectedType);

    fetch(`/api/events?${params}`).then(r => r.json()).then(d => {
      setEvents(d);
      setLoading(false);
    });
  }, [selectedDistrict, selectedType]);

  const filtered = events.filter(ev =>
    search ? ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase()) ||
      ev.district.toLowerCase().includes(search.toLowerCase()) : true
  );

  // Group by month
  const grouped = filtered.reduce((acc, ev) => {
    const key = new Date(ev.date).toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="min-h-screen bg-dp-navy">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 relative overflow-hidden hero-bg">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-dp-red/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dp-red/10 border border-dp-red/20 text-dp-red-light text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Saha Etkinlikleri & Mitingler
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-black text-white mb-4">
            Etkinlik<br /><span className="text-gradient">Takvimi</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            Ankara'nın her ilçesinde, her mahallede sahada. Bize katılın!
          </p>
          <div className="gold-line w-20 mt-6" />
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-dp-navy-mid border-b border-white/5 sticky top-16 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              id="event-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Etkinlik, konum veya ilçe ara..."
              className="input-field pl-11 pr-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* District */}
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <MapPin className="w-4 h-4 text-white/40 shrink-0" />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {districts.map(d => (
                  <button
                    key={d}
                    id={`district-filter-${d}`}
                    onClick={() => setSelectedDistrict(d)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                      selectedDistrict === d
                        ? 'bg-dp-red text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/40 shrink-0" />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {eventTypes.map(t => {
                  const conf = typeConfig[t];
                  return (
                    <button
                      key={t}
                      id={`type-filter-${t.replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedType(t)}
                      className={`whitespace-nowrap flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                        selectedType === t
                          ? 'bg-dp-red text-white'
                          : conf
                            ? `${conf.bg} ${conf.color} border ${conf.border}`
                            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {conf && <conf.icon className="w-3 h-3" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card h-32 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="font-heading text-white text-xl font-bold mb-2">Etkinlik Bulunamadı</h3>
              <p className="text-white/50">Filtre kriterlerinizi değiştirin veya tümünü görün.</p>
              <button
                onClick={() => { setSelectedDistrict('Tümü'); setSelectedType('Tümü'); setSearch(''); }}
                className="btn-primary mt-6"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <p className="text-white/60 text-sm mb-2">
                <span className="text-white font-semibold">{filtered.length}</span> etkinlik listeleniyor
              </p>

              {Object.entries(grouped).map(([month, monthEvents]) => (
                <div key={month}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-heading text-lg font-bold text-white capitalize">{month}</h2>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/40 text-xs">{monthEvents.length} etkinlik</span>
                  </div>
                  <div className="space-y-4">
                    {monthEvents.map(ev => <EventCard key={ev.id} event={ev} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
