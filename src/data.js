// UDS Group — udsgroup.uz ma'lumotlari asosida

export const HERO = {
  badge: 'Zamonaviy texnologik B2B ekotizim',
  title: 'UDS Group',
  text: "Hammasi bir platformada: ERP, qurilish materiallari marketplace'i, logistika va IT ta'lim.",
  hint: 'Pastga aylantiring',
}

// 3 ta yangi xona (UDS Soft, UDS Market, Logistika) uchun kartochkalar
export const ROOM_CARDS = {
  soft: {
    side: 'left',
    icon: '🏭',
    tag: 'UDS Soft',
    title: "Ishlab chiqarish uchun ERP",
    text: "Ombor, moliya va buyurtmalar bitta tizimda. Real vaqt hisobotlari va AI tavsiyalari.",
    bullets: ['Ombor va inventar nazorati', 'Moliya: daromad va xarajat', 'Buyurtmalar va savdo', '1C, SAP bilan API integratsiya'],
    stats: [{ value: '99.9%', label: 'tezlik (uptime)' }, { value: '92%', label: 'modul qamrovi' }],
    link: { href: 'https://udsgroup.uz/udssoft', label: 'UDS Soft haqida' },
  },
  supply: {
    side: 'right',
    icon: '🧱',
    tag: 'UDS Market',
    title: "Qurilish materiallari B2B marketplace",
    text: "O'zbekistonda qurilish materiallarini sotish va sotib olish uchun onlayn platforma.",
    bullets: ['Beton, armatura, metall', 'Bloklar, gipsokarton, kafel', 'Elektrotexnika va mebel', 'Isitish va sovutish tizimlari'],
    stats: [{ value: '340+', label: 'sotuvchi' }, { value: '1000+', label: 'mahsulot' }],
    link: { href: 'https://udsgroup.uz/udssupply', label: 'UDS Market haqida' },
  },
  logistics: {
    side: 'left',
    icon: '🚚',
    tag: 'Logistika',
    title: "Tezkor yetkazib berish",
    text: "Buyurtmalarni real vaqt tracking bilan kuzating. Hamma viloyatlarga yetkazib berish.",
    bullets: ["Yukni jonli kuzatish", 'Avtomatlashtirilgan kuryer xizmati', '24 soat ichida yetkazish', '14 viloyat, 24/7 qo\'llab-quvvatlash'],
    stats: [{ value: '14', label: 'viloyat' }, { value: '98.2%', label: 'yetkazish' }],
    link: { href: 'https://udsgroup.uz/directions', label: "Yo'nalishlar" },
  },
}

// 4-xona: UDS Academy (IT Hub, Guliston) — sinf sahnasi
export const COURSES = [
  { icon: '💻', title: 'Amaliy kurslar', text: "Nazariyadan ko'ra ko'proq amaliyot: har darsda o'zingiz kod yozasiz." },
  { icon: '🎯', title: 'Real loyihalar', text: "Kurs davomida haqiqiy loyiha ustida ishlab, portfolio yig'asiz." },
  { icon: '👨‍🏫', title: 'Tajribali ustozlar', text: 'Savollaringizga amaliyotchi mutaxassislar javob berishadi.' },
  { icon: '🚀', title: "IT'da birinchi qadam", text: "Noldan boshlovchilar ham qiynalmasdan o'rganishi mumkin." },
]

export const TEACHER = {
  avatar: '👨‍💻',
  name: 'Ustoz ismi',
  role: 'Web dasturlash ustozi',
  bio: "Bu yerga ustoz haqida 1-2 gap yoziladi: qancha yillik tajriba, qaysi loyihalarda ishlagan.",
  skills: ['HTML/CSS', 'JavaScript', 'React'],
  stats: [
    { value: '7', label: 'yillik tajriba' },
    { value: '100+', label: "o'quvchi" },
  ],
}

export const CONTACT = {
  instagram: 'uds_academy_',
  telegram: 'telegram_username', // @ belgisisiz
  phone: '+998 91 003 07 27',
  email: 'umarkhidirboev@gmail.com',
  site: 'https://udsgroup.uz',
  address: 'Sirdaryo viloyati, Yoshlar Texnoparki',
}
