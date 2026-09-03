import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Starting Ankara Demokrat Parti seed script...');

  // Clear existing records
  await db.candidate.deleteMany();
  await db.project.deleteMany();
  await db.event.deleteMany();
  await db.volunteer.deleteMany();
  await db.message.deleteMany();

  // 1. Seed Candidates (Gerçek DP Yöneticileri)
  const candidates = [
    {
      name: 'Gültekin Uysal',
      title: 'Ankara 1. Bölge 1. Sıra Milletvekili Adayı',
      region: '1. Bölge',
      photoUrl: 'https://ui-avatars.com/api/?name=Gultekin+Uysal&background=ce2029&color=fff&size=512&font-size=0.33',
      bio: 'Demokrat Parti Genel Başkanı. Afyonkarahisar doğumlu, Houston Üniversitesi Siyaset Bilimi mezunu. Türk siyasetinin genç ve dinamik liderlerinden biri olarak Demokrat Parti geleneğini geleceğe taşıyor.',
      profession: 'Siyaset Bilimci',
      expertise: 'Siyaset Bilimi, Kamu Yönetimi, Dış Politikalar',
      isFeatured: true,
      order: 1,
      twitter: 'https://twitter.com/DPGultekinUysal',
      instagram: 'https://instagram.com/dpgultekinuysal',
    },
    {
      name: 'Ali İhsan Aşur',
      title: 'Ankara 1. Bölge 2. Sıra Milletvekili Adayı',
      region: '1. Bölge',
      photoUrl: 'https://ui-avatars.com/api/?name=Ali+Ihsan+Asur&background=ce2029&color=fff&size=512&font-size=0.33',
      bio: 'Demokrat Parti Ankara İl Başkanı ve Genel Başkan Danışmanı. Ankara siyasetinin deneyimli isimlerinden, teşkilatın her kademesinde görev alarak Başkent teşkilatını güçlendirmiştir.',
      profession: 'Yönetici & Siyasetçi',
      expertise: 'Teşkilat Yönetimi, Yerel Yönetimler, Siyasi Organizasyon',
      isFeatured: true,
      order: 2,
    },
    {
      name: 'Ertan Küçükay',
      title: 'Ankara 2. Bölge 1. Sıra Milletvekili Adayı',
      region: '2. Bölge',
      photoUrl: 'https://ui-avatars.com/api/?name=Ertan+Kucukay&background=1a237e&color=fff&size=512&font-size=0.33',
      bio: 'Demokrat Parti Genel Sekreteri. Partinin idari ve teşkilat işleyişinde uzun yıllardır kilit rol oynayan, Demokrat kadroların tecrübeli kurmaylarından.',
      profession: 'Genel Sekreter',
      expertise: 'Parti İçi İletişim, Stratejik Planlama, İdare Hukuku',
      isFeatured: true,
      order: 1,
    },
    {
      name: 'İrem Taşpınar',
      title: 'Ankara 2. Bölge 2. Sıra Milletvekili Adayı',
      region: '2. Bölge',
      photoUrl: 'https://ui-avatars.com/api/?name=Irem+Taspinar&background=1a237e&color=fff&size=512&font-size=0.33',
      bio: 'Demokrat Parti Kadın Politikaları Başkanı. Kadınların sosyal ve ekonomik hayatta güçlenmesi, fırsat eşitliği ve siyasetteki temsil oranının artması için ulusal çapta projeler yürütmektedir.',
      profession: 'Siyasetçi',
      expertise: 'Kadın Hakları, Sosyal Politikalar, Fırsat Eşitliği',
      isFeatured: true,
      order: 2,
    },
    {
      name: 'Haydar Altıntaş',
      title: 'Ankara 3. Bölge 1. Sıra Milletvekili Adayı',
      region: '3. Bölge',
      photoUrl: 'https://ui-avatars.com/api/?name=Haydar+Altintas&background=ce2029&color=fff&size=512&font-size=0.33',
      bio: 'Demokrat Parti Sözcüsü ve Milletvekili. Türk tarımı, çiftçi sorunları ve milli ekonomi politikaları üzerine derin çalışmaları bulunmaktadır.',
      profession: 'Siyasetçi',
      expertise: 'Tarım Politikaları, Basın ve İletişim, Kamu Yönetimi',
      isFeatured: true,
      order: 1,
    },
    {
      name: 'Gürcan Dağdaş',
      title: 'Ankara 3. Bölge 2. Sıra Milletvekili Adayı',
      region: '3. Bölge',
      photoUrl: 'https://ui-avatars.com/api/?name=Gurcan+Dagdas&background=1a237e&color=fff&size=512&font-size=0.33',
      bio: 'Demokrat Parti Siyasi İşler Başkanı. Türk siyaset sahnesindeki tecrübesiyle Demokrat Parti’nin stratejik vizyonunu ve politik eksenini şekillendiren tecrübeli devlet adamı.',
      profession: 'Devlet Adamı & Siyasetçi',
      expertise: 'Siyasi Strateji, İç Politika, Devlet Yönetimi',
      isFeatured: false,
      order: 2,
    }
  ];

  for (const candidate of candidates) {
    await db.candidate.create({ data: candidate });
  }

  // 2. Seed Projects & Promises
  const projects = [
    {
      title: 'Ankara KOBİ & Sanayi Teknoloji Hamlesi',
      category: 'Ekonomi',
      summary: 'OSTİM, İVEDİK ve Sincan OSB’deki küçük ve orta ölçekli üreticilere faizsiz teknoloji yenileme kredisi ve ihracat desteği.',
      description: 'Demokrat Parti iktidarında Ankara üretimin başkenti olacak! OSTİM ve İVEDİK sanayi bölgelerindeki KOBİ’ler için yerli üretim teşviği, sıfır faizli ekipman kredisi ve gümrük kolaylıkları sunacağız. Başkent sanayisinin yıllık ihracat hedefi 25 milyar dolardır.',
      targetAudience: 'Sanayiciler, KOBİ’ler, İş İnsanları',
      icon: 'TrendingUp',
      isKeyPromise: true,
    },
    {
      title: 'Ankara Metro & Raylı Sistem Devrim Projesi',
      category: 'Ankara Yerel Projeler',
      summary: 'Esenboğa Havalimanı - Kızılay - Çayyolu kesintisiz hızlı metro hattı ve Dikmen - Mamak banliyö entegrasyonu.',
      description: 'Ankara’da ulaşım çilesine son veriyoruz! Esenboğa Havalimanı doğrudan metro ağına bağlanacak, Mamak ve Dikmen hattındaki aktarma yükü hafifletilerek tüm ilçeler 24 saat kesintisiz ve konforlu raylı ulaşıma kavuşacak.',
      targetAudience: 'Tüm Ankara Halkı, Öğrenciler, Çalışanlar',
      icon: 'Train',
      isKeyPromise: true,
    },
    {
      title: 'Genç Başkent Kampüs & Startup Fonu',
      category: 'Gençlik',
      summary: 'Ankara’daki 300.000 üniversite öğrencisine ücretsiz internet, ulaşım indirimi ve 500.000 TL hibe teknoloji girişim fonu.',
      description: 'Ankara Türkiye’nin üniversite başkentidir. Gençlerimizin beyin göçü yapmasını engellemek için Hacettepe, ODTÜ, Gazi, Bilkent teknoparklarında genç girişimcilere 500 bin TL’ye kadar geri ödemesiz çekirdek sermaye desteği sağlayacağız.',
      targetAudience: 'Üniversite Öğrencileri, Genç Girişimciler',
      icon: 'Zap',
      isKeyPromise: true,
    },
    {
      title: 'Polatlı, Ayaş & Çubuk Tarım Destek Seferberliği',
      category: 'Tarım',
      summary: 'Yerli tohum desteği, kapalı devre sulama sistemleri ve çiftçiye %50 mazot-gübre sübvansiyonu.',
      description: 'Ankara’nın bereketli toprakları Polatlı buğdayı, Ayaş domatesi ve Çubuk turşusu ile anılmaya devam edecek. Çiftçimizin girdi maliyetlerini düşürmek için tarımsal elektrik fiyatlarını yarıya indiriyor, mazotta ÖTV’yi kaldırıyoruz.',
      targetAudience: 'Çiftçiler, Üreticiler, Köy Muhtarları',
      icon: 'Sprout',
      isKeyPromise: false,
    },
    {
      title: 'Yeşil Başkent & Kentsel Dönüşüm Güvencesi',
      category: 'Ankara Yerel Projeler',
      summary: 'Depreme dayanıklı konut stoku, Altındağ ve Mamak’ta yerinde kentsel dönüşüm, %100 kira ve taşınma desteği.',
      description: 'Rantsal değil insanca kentsel dönüşüm! Eski konut stokunu yenilerken kimseyi mahallesinden koparmıyoruz. Hak sahiplerine inşaat süresince kesintisiz kira desteği ve deprem güvenliği sertifikalı konutlar sunuyoruz.',
      targetAudience: 'Hak Sahipleri, Mahalle Sakinleri',
      icon: 'Building2',
      isKeyPromise: false,
    },
    {
      title: 'Adil Ücret & Emekli Yaşam Merkezleri',
      category: 'Ekonomi',
      summary: 'Ankaralı emeklilerimiz için ücretsiz ulaşım kartı, yerel sosyal destek ödemeleri ve modern yaşam kulüpleri.',
      description: 'Demokrat Parti geleneğinde insana saygı esastır. Emeklilerimizin Başkent Ankara’da huzur ve gururla yaşaması için sosyal tesisler, sağlık takibi ve ek hayat desteği paketi yürürlüğe girecektir.',
      targetAudience: 'Emekliler, Kıdemli Vatandaşlar',
      icon: 'HeartHandshake',
      isKeyPromise: false,
    },
  ];

  for (const project of projects) {
    await db.project.create({ data: project });
  }

  // 3. Seed Events
  const events = [
    {
      title: 'Çankaya Büyük Ankara Mitingi ve Aday Tanıtımı',
      district: 'Çankaya',
      location: 'Kızılay Meydanı & Sakarya Caddesi Etkinlik Alanı',
      date: new Date('2026-08-20T17:00:00Z'),
      time: '17:00',
      description: 'Demokrat Parti Genel Başkanı ve Ankara Milletvekili Adaylarımızın katılımıyla dev Ankara buluşması!',
      speaker: 'Demokrat Parti Genel Başkanı & Ankara Adayları',
      type: 'Miting',
    },
    {
      title: 'OSTİM Sanayicileri ve Esnaf Buluşması',
      district: 'Yenimahalle',
      location: 'OSTİM OSB Konferans Salonu',
      date: new Date('2026-08-22T10:30:00Z'),
      time: '10:30',
      description: 'Ankara 1., 2. ve 3. Bölge adaylarımızın katılımıyla KOBİ teşvikleri ve sanayi projeleri istişare toplantısı.',
      speaker: 'Mustafa Kemal Arslan & Dr. Ahmet Yılmaz',
      type: 'Esnaf Ziyareti',
    },
    {
      title: 'Keçiören Gençlik ve Üniversiteler Paneli',
      district: 'Keçiören',
      location: 'Neşet Ertaş Kültür Merkezi',
      date: new Date('2026-08-25T14:00:00Z'),
      time: '14:00',
      description: 'Genç Başkent Projeleri ve İstihdam Vizyonu söylesisi.',
      speaker: 'Zeynep Aksoy & Av. Elif Kaya Demirel',
      type: 'Gençlik Buluşması',
    },
    {
      title: 'Polatlı Tarım ve Çiftçi İstişare Toplantısı',
      district: 'Polatlı',
      location: 'Polatlı Ticaret Borsası Salonu',
      date: new Date('2026-08-28T11:00:00Z'),
      time: '11:00',
      description: 'Tarım desteği vaatlerimizin açıklandığı Polatlı üretici buluşması.',
      speaker: 'Doç. Dr. Selin Öztürk & Mehmet Ali Şahin',
      type: 'Saha Çalışması',
    },
    {
      title: 'Mamak ve Altındağ Esnaf Ziyaret Turu',
      district: 'Mamak',
      location: 'Mamak Çarşı & Abidinpaşa Meydanı',
      date: new Date('2026-08-30T13:30:00Z'),
      time: '13:30',
      description: 'Esnaflarımızla birebir görüşmeler ve broşür dağıtım saha faaliyeti.',
      speaker: 'Ankara 1. Bölge Aday Kadrosu',
      type: 'Esnaf Ziyareti',
    },
  ];

  for (const event of events) {
    await db.event.create({ data: event });
  }

  // 4. Seed Volunteers
  const volunteers = [
    {
      fullName: 'Caner Özkan',
      email: 'caner.ozkan@example.com',
      phone: '0532 111 22 33',
      district: 'Çankaya',
      interests: 'Sosyal Medya & Dijital İletişim',
      note: 'Grafik tasarım ve video kurgu alanında destek verebilirim.',
      status: 'Aktif Gönüllü',
    },
    {
      fullName: 'Sibel Yıldırım',
      email: 'sibel.yildirim@example.com',
      phone: '0544 222 33 44',
      district: 'Keçiören',
      interests: 'Saha Çalışması & Broşür Dağıtımı',
      note: 'Hafta sonları saha ekiplerine katılmak istiyorum.',
      status: 'Yeni',
    },
    {
      fullName: 'Burak Demir',
      email: 'burak.demir@example.com',
      phone: '0555 333 44 55',
      district: 'Yenimahalle',
      interests: 'Sandık Güvenliği',
      note: 'Seçim günü sandık görevlisi olmak istiyorum.',
      status: 'İletişime Geçildi',
    },
  ];

  for (const vol of volunteers) {
    await db.volunteer.create({ data: vol });
  }

  // 5. Seed Messages
  const messages = [
    {
      fullName: 'Turgut Keskin',
      email: 'turgut.keskin@example.com',
      subject: 'Mamak Metro Hattı Projesi Hakkında',
      content: 'Mamak ilçesinde yaşayan bir mühendis olarak önerilen raylı sistem projenizi çok takdir ettim. Başarılar dilerim.',
      district: 'Mamak',
      isRead: true,
    },
    {
      fullName: 'Merve Korkmaz',
      email: 'merve.korkmaz@example.com',
      subject: 'Gençlik Fonu Başvuruları Ne Zaman Başlayacak?',
      content: 'Girişimci gençlere yönelik sunulan 500 bin TL hibe fonu detaylarını öğrenmek istiyorum.',
      district: 'Gölbaşı',
      isRead: false,
    },
  ];

  for (const msg of messages) {
    await db.message.create({ data: msg });
  }

  console.log('✅ Seed completed successfully! Veritabanı hazır.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
