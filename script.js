/**
 * ============================================================================
 * NUSANTARAGO - PEMESANAN PERJALANAN & PENGINAPAN
 * ============================================================================
 * Proyek Implementasi Struktur Data:
 * 1. STRUCT           : ItemServiceStruct (Acara/Layanan), OrderTransactionStruct (Tiket/Pesanan), UserAccountStruct (Akun)
 * 2. ARRAY OF STRUCT  : servicesArray[], ordersArray[], searchHistoryArray[]
 * 3. POINTER          : selectedItemPointer, selectedOrderPointer, currentUser, swapByPointer(), dereference()
 * 4. SORTING          : Bubble Sort & Selection Sort O(N²) dengan Live Activity Log
 * 5. SEARCHING        : Linear Search O(N) untuk multi-kriteria & validasi kode voucher
 * ============================================================================
 */

// ============================================================================
// 1. STRUCT IMPLEMENTATIONS (Struktur Data Komposit)
// ============================================================================

/**
 * Struct Layanan (ItemServiceStruct):
 * Merepresentasikan satu entitas layanan perjalanan.
 */
class ItemServiceStruct {
  constructor(id, kategori, nama, lokasi, jadwal, durasi, kelas, kuota, harga, rating, gambar, penyelenggara = "NusantaraGo Official", memOffset = 0) {
    this.id = id;                     // ID unik
    this.kategori = kategori;         // PESAWAT | HOTEL | KERETA | BUS | WISATA
    this.nama = nama;                 // Nama layanan perjalanan
    this.lokasi = lokasi;             // Lokasi hotel/wisata atau rute perjalanan
    this.jadwal = jadwal;             // Tanggal dan jam layanan
    this.durasi = durasi;             // Waktu perjalanan atau lama menginap
    this.kelas = kelas;               // Kelas perjalanan atau tipe kamar
    this.kuota = kuota;               // Sisa kuota tiket tersedia
    this.harga = harga;               // Nominal harga dasar tiket (Rupiah)
    this.rating = rating;             // Skala kepuasan 1.0 - 5.0
    this.gambar = gambar;             // URL gambar layanan
    this.penyelenggara = penyelenggara; // Provider layanan
    
    // Simulasi Alamat Memori Fisik Heksadesimal (Pointer Address)
    // Formula dasar simulasi: 0x7FFE0010 + (memOffset * 0x14)
    const baseAddr = 0x7ffe0010;
    this.memAddress = "0x" + (baseAddr + (memOffset * 0x14)).toString(16).toUpperCase();
  }

  // Metode dereferensi pointer (analogi *ptr pada bahasa C/C++)
  dereference() {
    return {
      address: this.memAddress,
      data: { ...this }
    };
  }
}

/**
 * Struct Transaksi Pesanan & E-Ticket (OrderTransactionStruct):
 * Merepresentasikan tiket resmi yang diterbitkan setelah checkout berhasil
 */
class OrderTransactionStruct {
  constructor(orderId, serviceId, namaLayanan, kategori, lokasi, jadwal, durasi, namaPemesan, email, telepon, nik, kelas, tanggal, qty, hargaSatuan, penyesuaianKelas, diskon, kodePromo, metodePembayaran, totalBayar, memOffset = 0) {
    this.orderId = orderId;                     // Kode booking tiket, misal: NTG-88219A
    this.serviceId = serviceId;                 // ID layanan terkait
    this.namaLayanan = namaLayanan;
    this.kategori = kategori;
    this.lokasi = lokasi;
    this.jadwal = jadwal;
    this.durasi = durasi;
    this.namaPemesan = namaPemesan;
    this.email = email;
    this.telepon = telepon;
    this.nik = nik;
    this.kelas = kelas;
    this.tanggal = tanggal;
    this.qty = qty;
    this.hargaSatuan = hargaSatuan;
    this.penyesuaianKelas = penyesuaianKelas;
    this.diskon = diskon;
    this.kodePromo = kodePromo;
    this.metodePembayaran = metodePembayaran;
    this.totalBayar = totalBayar;
    this.status = "TERBIT";                     // TERBIT | RESCHEDULED | REFUNDED
    this.createdAt = new Date().toLocaleString("id-ID");
    
    // Alamat Memori Simulasi untuk struct pesanan (0x7FFF1010 + offset * 0x20)
    const baseAddr = 0x7fff1010;
    this.memAddress = "0x" + (baseAddr + (memOffset * 0x20)).toString(16).toUpperCase();
  }

  dereference() {
    return {
      address: this.memAddress,
      data: { ...this }
    };
  }
}

/**
 * Struct Akun Pengguna (UserAccountStruct):
 * Merepresentasikan pengguna terdaftar di memori aplikasi
 */
class UserAccountStruct {
  constructor(id, fullName, email, password, role = "Member", memOffset = 0) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date().toLocaleString("id-ID");

    const baseAddr = 0x7ffe2000;
    this.memAddress = "0x" + (baseAddr + (memOffset * 0x18)).toString(16).toUpperCase();
  }

  dereference() {
    return {
      address: this.memAddress,
      data: { ...this }
    };
  }
}

// ============================================================================
// 2. DATA PERJALANAN (contoh untuk simulasi pemesanan)
// ============================================================================
const RAW_INITIAL_DATA = [
  // Pesawat
  {
    id: 1,
    kategori: "PESAWAT",
    nama: "Garuda Indonesia • Jakarta ke Bali",
    lokasi: "Jakarta (CGK) → Bali (DPS)",
    jadwal: "Setiap hari • 08:30 WIB",
    durasi: "1 jam 50 menit",
    kelas: "Ekonomi",
    kuota: 15,
    harga: 1750000,
    rating: 5.0,
    penyelenggara: "Garuda Indonesia",
    gambar: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&auto=format&fit=crop"
  },
  {
    id: 2,
    kategori: "PESAWAT",
    nama: "Citilink • Surabaya ke Jakarta",
    lokasi: "Surabaya (SUB) → Jakarta (CGK)",
    jadwal: "Setiap hari • 10:15 WIB",
    durasi: "1 jam 30 menit",
    kelas: "Ekonomi",
    kuota: 24,
    harga: 780000,
    rating: 4.9,
    penyelenggara: "Citilink",
    gambar: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=700&auto=format&fit=crop"
  },
  {
    id: 3,
    kategori: "PESAWAT",
    nama: "Batik Air • Jakarta ke Yogyakarta",
    lokasi: "Jakarta (CGK) → Yogyakarta (YIA)",
    jadwal: "Setiap hari • 13:00 WIB",
    durasi: "1 jam 15 menit",
    kelas: "Ekonomi",
    kuota: 18,
    harga: 890000,
    rating: 4.8,
    penyelenggara: "Batik Air",
    gambar: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=700&auto=format&fit=crop"
  },
  {
    id: 4,
    kategori: "PESAWAT",
    nama: "AirAsia • Bali ke Lombok",
    lokasi: "Bali (DPS) → Lombok (LOP)",
    jadwal: "Setiap hari • 11:20 WITA",
    durasi: "45 menit",
    kelas: "Ekonomi",
    kuota: 12,
    harga: 350000,
    rating: 4.9,
    penyelenggara: "AirAsia",
    gambar: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=700&auto=format&fit=crop"
  },

  // Kereta api
  {
    id: 5,
    kategori: "KERETA",
    nama: "Argo Bromo Anggrek",
    lokasi: "Jakarta (Gambir) → Surabaya (Pasarturi)",
    jadwal: "Setiap hari • 08:20 WIB",
    durasi: "8 jam 10 menit",
    kelas: "Eksekutif",
    kuota: 20,
    harga: 850000,
    rating: 4.8,
    penyelenggara: "Kereta Api Indonesia",
    gambar: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=700&auto=format&fit=crop"
  },
  {
    id: 6,
    kategori: "KERETA",
    nama: "Argo Wilis",
    lokasi: "Bandung → Surabaya (Gubeng)",
    jadwal: "Setiap hari • 07:40 WIB",
    durasi: "9 jam 50 menit",
    kelas: "Eksekutif",
    kuota: 16,
    harga: 320000,
    rating: 4.7,
    penyelenggara: "Kereta Api Indonesia",
    gambar: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=700&auto=format&fit=crop"
  },
  {
    id: 7,
    kategori: "KERETA",
    nama: "Taksaka",
    lokasi: "Jakarta (Gambir) → Yogyakarta (Tugu)",
    jadwal: "Setiap hari • 09:20 WIB",
    durasi: "6 jam 15 menit",
    kelas: "Eksekutif",
    kuota: 25,
    harga: 250000,
    rating: 4.8,
    penyelenggara: "Kereta Api Indonesia",
    gambar: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=700&auto=format&fit=crop"
  },

  // Aktivitas wisata
  {
    id: 8,
    kategori: "WISATA",
    nama: "Taman Mini Indonesia Indah",
    lokasi: "Cipayung, Jakarta Timur",
    jadwal: "Setiap hari • 09:00–17:00 WIB",
    durasi: "1 hari kunjungan",
    kelas: "Tiket masuk",
    kuota: 40,
    harga: 65000,
    rating: 4.8,
    penyelenggara: "Taman Mini Indonesia Indah",
    gambar: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=700&auto=format&fit=crop"
  },
  {
    id: 9,
    kategori: "WISATA",
    nama: "Candi Prambanan",
    lokasi: "Prambanan, Yogyakarta",
    jadwal: "Setiap hari • 06:30–17:00 WIB",
    durasi: "1 hari kunjungan",
    kelas: "Tiket masuk",
    kuota: 30,
    harga: 120000,
    rating: 4.9,
    penyelenggara: "Taman Wisata Candi",
    gambar: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=700&auto=format&fit=crop"
  },

  // Rute tambahan dan bus
  {
    id: 10,
    kategori: "PESAWAT",
    nama: "Garuda Indonesia • Bali ke Jakarta",
    lokasi: "Bali (DPS) → Jakarta (CGK)",
    jadwal: "Setiap Hari • 08:30 WIB",
    durasi: "1j 50m Terbang",
    kelas: "Ekonomi",
    kuota: 8,
    harga: 1650000,
    rating: 4.9,
    penyelenggara: "Garuda Indonesia Airlines",
    gambar: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=700&auto=format&fit=crop"
  },
  {
    id: 11,
    kategori: "KERETA",
    nama: "KA Argo Bromo Anggrek Luxury Sleeper",
    lokasi: "Surabaya (Pasarturi) → Jakarta (Gambir)",
    jadwal: "Setiap Hari • 09:00 WIB",
    durasi: "8j 10m Perjalanan",
    kelas: "Luxury Sleeper Suite",
    kuota: 10,
    harga: 850000,
    rating: 4.9,
    penyelenggara: "PT Kereta Api Indonesia (Persero)",
    gambar: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=700&auto=format&fit=crop"
  },
  {
    id: 12,
    kategori: "BUS",
    nama: "Sinar Jaya Suite Class Double Decker",
    lokasi: "Jakarta (Pulo Gebang) → Surabaya (Bungurasih)",
    jadwal: "Setiap Hari • 17:00 WIB",
    durasi: "10j 30m Perjalanan",
    kelas: "First Class Sleeper",
    kuota: 12,
    harga: 380000,
    rating: 4.8,
    penyelenggara: "PO Sinar Jaya Megah Langgeng",
    gambar: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&auto=format&fit=crop"
  },

  // 5. Kategori: HOTEL & PENGINAPAN
  {
    id: 13,
    kategori: "HOTEL",
    nama: "The Mulia Resort & Luxury Beachfront Villas",
    lokasi: "Kawasan Sawangan, Nusa Dua, Bali",
    jadwal: "Check-in 14:00 WITA",
    durasi: "1 Malam Menginap",
    kelas: "Bintang 5 Diamond",
    kuota: 5,
    harga: 3200000,
    rating: 4.9,
    penyelenggara: "The Mulia Hotels & Resorts",
    gambar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&auto=format&fit=crop"
  },
  {
    id: 14,
    kategori: "HOTEL",
    nama: "Padma Hotel Bandung: Hillside Premier Suite",
    lokasi: "Jl. Rancabentang, Ciumbuleuit, Bandung",
    jadwal: "Check-in 14:00 WIB",
    durasi: "1 Malam Menginap",
    kelas: "Premier Suite Nature View",
    kuota: 6,
    harga: 1850000,
    rating: 4.8,
    penyelenggara: "Padma Hotels Indonesia",
    gambar: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&auto=format&fit=crop"
  },

  // Bus dan wisata alam
  {
    id: 15,
    kategori: "BUS",
    nama: "Cititrans • Jakarta ke Bandung",
    lokasi: "Jakarta (Sudirman) → Bandung (Dipatiukur)",
    jadwal: "Setiap hari • 08:00 WIB",
    durasi: "3 jam perjalanan",
    kelas: "Executive Shuttle",
    kuota: 30,
    harga: 175000,
    rating: 4.9,
    penyelenggara: "Cititrans",
    gambar: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&auto=format&fit=crop"
  },
  {
    id: 16,
    kategori: "WISATA",
    nama: "Tegallalang Rice Terrace",
    lokasi: "Tegallalang, Ubud, Bali",
    jadwal: "Setiap hari • 08:00–18:00 WITA",
    durasi: "1 hari kunjungan",
    kelas: "Tiket masuk",
    kuota: 25,
    harga: 145000,
    rating: 4.8,
    penyelenggara: "Wisata Tegallalang",
    gambar: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&auto=format&fit=crop"
  },
  {
    id: 17,
    kategori: "HOTEL",
    nama: "Hotel Tugu Lombok",
    lokasi: "Pantai Sire, Lombok Utara",
    jadwal: "Check-in 14:00 WITA",
    durasi: "1 malam menginap",
    kelas: "Deluxe Garden",
    kuota: 20,
    harga: 1950000,
    rating: 4.9,
    penyelenggara: "Tugu Hotels",
    gambar: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&auto=format&fit=crop"
  },
  {
    id: 18,
    kategori: "HOTEL",
    nama: "Plataran Borobudur Resort & Spa: Heritage Villa",
    lokasi: "Dusun Tanjungan, Borobudur, Magelang",
    jadwal: "Check-in 14:00 WIB",
    durasi: "1 Malam Menginap",
    kelas: "Borobudur View Villa",
    kuota: 8,
    harga: 2850000,
    rating: 4.9,
    penyelenggara: "Plataran Indonesia Hotels",
    gambar: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&auto=format&fit=crop"
  }
];

// Array Kode Promo & Diskon Voucher
const PROMO_CODES_DATA = [
  {
    code: "NUSANTARA50",
    diskonPersen: 50,
    maxDiskon: 200000,
    diskonNominal: 0,
    minOrder: 100000,
    deskripsi: "Liburan makin dekat. Diskon 50% hingga Rp200.000 untuk semua perjalanan.",
    syarat: "Min. Transaksi Rp 100.000"
  },
  {
    code: "LIBURAN100",
    diskonPersen: 0,
    maxDiskon: 100000,
    diskonNominal: 100000,
    minOrder: 300000,
    deskripsi: "Potongan Rp100.000 untuk rencana liburanmu. Berlaku untuk semua layanan.",
    syarat: "Min. Transaksi Rp 300.000"
  },
  {
    code: "JALANHEMAT",
    diskonPersen: 25,
    maxDiskon: 100000,
    diskonNominal: 0,
    minOrder: 50000,
    deskripsi: "Pergi dekat atau jauh, hemat 25% hingga Rp100.000 untuk semua layanan.",
    syarat: "Min. Transaksi Rp 50.000"
  }
];

// ============================================================================
// 3. GLOBAL STATE & DATA STRUCTURE STORAGE
// ============================================================================
let servicesArray = [];              // Array of ItemServiceStruct (Array Utama)
let ordersArray = [];                // Array of OrderTransactionStruct (Pesanan/Tiket)
let searchHistoryArray = [];         // Array Riwayat Pencarian Terakhir (Cache Array)
let promoCodesArray = [...PROMO_CODES_DATA]; // Array Voucher
let usersArray = [];                 // Array of UserAccountStruct (Akun Pengguna)

// Pointer References (Simulasi Pointer Alamat Memori)
let selectedItemPointer = null;      // ItemService* selectedItemPtr = NULL
let selectedOrderPointer = null;     // OrderTransaction* selectedOrderPtr = NULL
let currentUser = null;              // UserAccount* currentUserPtr = NULL

// State Aplikasi
let currentLanguage = "ID";          // 'ID' | 'EN'
let activeFilterCategory = "ALL";
let searchResultIds = null;
let activeView = "catalog";          // 'catalog' | 'orders' | 'admin'
let isAlgorithmRunning = false;
let currentCheckoutStep = 1;
let appliedPromo = null;

// Counter Statistik Eksekusi Log
let statComparisonsCount = 0;
let statSwapsCount = 0;
let statIterationsCount = 0;
let totalLogSteps = 0;

// ============================================================================
// 4. MULTI-LANGUAGE TRANSLATION DICTIONARY (KAMUS BAHASA ID & EN)
// ============================================================================
const I18N_DICTIONARY = {
  ID: {
    top_tagline: "Ada banyak cerita di setiap perjalanan.",
    modal_verified_notice: "Periksa detail perjalanan sebelum memesan.",
    footer_all_events: "Semua perjalanan",
    nav_promo: "Promo & Diskon",
    nav_my_tickets: "Tiket Saya",
    nav_explore: "Beranda",
    brand_subtitle: "Teman perjalananmu",
    pill_all: "Jelajahi",
    pill_flights: "Pesawat",
    pill_trains: "Kereta Api",
    pill_buses: "Bus & Travel",
    pill_hotels: "Hotel",
    pill_activities: "Wisata",
    badge_hemat: "Hemat",
    btn_login: "Masuk",
    btn_register: "Daftar",
    user_greeting: "Halo,",
    hero_badge: "SEBENTAR LAGI, JADI CERITA.",
    hero_title: "Mau ke mana kali ini?",
    hero_subtitle: "Dari pulang kampung sampai liburan yang lama ditunggu. Mulai rencanakan di sini.",
    search_heading: "Perjalanan berikutnya mulai di sini",
    date_label: "Tanggal perjalanan",
    pass_label: "Jumlah pesanan",
    search_btn: "Cari Tiket",
    promo_strip_text: "Lebih hemat dengan potongan hingga Rp200.000. <strong>Cek promo &rarr;</strong>",
    history_label: "Pencarian Terakhir:",
    history_clear: "Hapus",
    promo_sub_badge: "Penawaran Eksklusif",
    promo_sec_title: "Jalan-jalan, lebih hemat",
    promo_hint_text: "Salin kodenya, pakai saat pesan.",
    dest_sub_badge: "Kota & Hub Populer",
    dest_sec_title: "Ke sini, yuk.",
    dest_hint_text: "Inspirasi untuk liburan berikutnya",
    catalog_title: "Pilihan untuk perjalananmu",
    showing_label: "Menampilkan",
    of_label: "dari",
    events_label: "Pilihan Tersedia",
    sort_label: "Urutkan:",
    card_buy_ticket: "Beli Tiket",
    card_book_now: "Pesan",
    card_seats_left: "Sisa Kuota",
    card_starts_from: "Mulai dari",
    step_1_buyer: "Data Pemesan",
    step_2_promo: "Voucher Diskon",
    step_3_payment: "Pembayaran",
    step_4_confirm: "Konfirmasi",
    orders_title: "Pesanan Saya & Tiket Aktif",
    orders_desc: "Semua rencana perjalananmu, tersimpan di sini. Lihat tiket, ubah jadwal, atau ajukan refund.",
    stat_active_tickets: "Tiket Aktif",
    stat_rescheduled: "Rescheduled",
    stat_refunded: "Refunded",
    order_filter_all: "Semua Pesanan",
    order_filter_active: "Tiket Terbit",
    order_filter_resched: "Rescheduled",
    order_filter_refund: "Refunded",
    auth_modal_tag: "AKUN NUSANTARAGO",
    auth_login_title: "Masuk ke Akun Anda",
    auth_register_title: "Daftar Akun Baru",
    auth_tab_login: "Masuk (Login)",
    auth_tab_register: "Daftar Akun Baru",
    auth_email_lbl: "Alamat Email",
    auth_pwd_lbl: "Kata Sandi (Password)",
    auth_btn_login: "Masuk Sekarang",
    auth_name_lbl: "Nama Lengkap",
    auth_new_pwd_lbl: "Kata Sandi Baru",
    auth_btn_register: "Buat Akun Baru",
    auth_footer_note: "Data akun tersimpan aman di runtime browser NusantaraGo."
  },
  EN: {
    top_tagline: "Every journey has a story.",
    modal_verified_notice: "Review your travel details before booking.",
    footer_all_events: "All journeys",
    nav_promo: "Promos & Discounts",
    nav_my_tickets: "My Tickets",
    nav_explore: "Home",
    brand_subtitle: "Your travel companion",
    pill_all: "Explore",
    pill_flights: "Flights",
    pill_trains: "Trains",
    pill_buses: "Bus & Shuttle",
    pill_hotels: "Hotels",
    pill_activities: "Things to do",
    badge_hemat: "Save",
    btn_login: "Sign In",
    btn_register: "Sign Up",
    user_greeting: "Hello,",
    hero_badge: "YOUR NEXT STORY STARTS HERE.",
    hero_title: "Where to this time?",
    hero_subtitle: "A trip back home or that long-awaited holiday. Start planning right here.",
    search_heading: "Your next journey starts here",
    date_label: "Travel date",
    pass_label: "Booking quantity",
    search_btn: "Find Tickets",
    promo_strip_text: "Save up to IDR 200,000 on your next trip. <strong>See offers &rarr;</strong>",
    history_label: "Recent Searches:",
    history_clear: "Clear",
    promo_sub_badge: "Exclusive Offers",
    promo_sec_title: "A little less on your next trip",
    promo_hint_text: "Click \"Copy Code\" to apply discounts during checkout",
    dest_sub_badge: "Popular Cities & Hubs",
    dest_sec_title: "How about here?",
    dest_hint_text: "A little inspiration for your next holiday",
    catalog_title: "Find your next getaway",
    showing_label: "Showing",
    of_label: "of",
    events_label: "Available Options",
    sort_label: "Sort by:",
    card_buy_ticket: "Buy Tickets",
    card_book_now: "Book Now",
    card_seats_left: "Tickets Left",
    card_starts_from: "Starts from",
    step_1_buyer: "Buyer Info",
    step_2_promo: "Promo Voucher",
    step_3_payment: "Payment",
    step_4_confirm: "Confirmation",
    orders_title: "My Tickets & Bookings",
    orders_desc: "All your travel plans in one place. View tickets, change dates, or request a refund.",
    stat_active_tickets: "Active Tickets",
    stat_rescheduled: "Rescheduled",
    stat_refunded: "Refunded",
    order_filter_all: "All Orders",
    order_filter_active: "Issued Tickets",
    order_filter_resched: "Rescheduled",
    order_filter_refund: "Refunded",
    auth_modal_tag: "NUSANTARAGO ACCOUNT",
    auth_login_title: "Sign In to Your Account",
    auth_register_title: "Create a New Account",
    auth_tab_login: "Sign In",
    auth_tab_register: "Create Account",
    auth_email_lbl: "Email Address",
    auth_pwd_lbl: "Password",
    auth_btn_login: "Sign In Now",
    auth_name_lbl: "Full Name",
    auth_new_pwd_lbl: "New Password",
    auth_btn_register: "Create Account",
    auth_footer_note: "Account session stored safely in NusantaraGo browser runtime."
  }
};

function setLanguage(lang) {
  if (lang !== "ID" && lang !== "EN") lang = "ID";
  currentLanguage = lang;

  const currentLangFlag = document.getElementById("currentLangFlag");
  const currentLangCode = document.getElementById("currentLangCode");
  if (currentLangFlag) currentLangFlag.textContent = lang === "ID" ? "🇮🇩" : "🇬🇧";
  if (currentLangCode) currentLangCode.textContent = lang;

  const langOptId = document.getElementById("langOptId");
  const langOptEn = document.getElementById("langOptEn");
  if (langOptId) langOptId.classList.toggle("active", lang === "ID");
  if (langOptEn) langOptEn.classList.toggle("active", lang === "EN");

  const dict = I18N_DICTIONARY[lang];

  // Update elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      if (key === "promo_strip_text") {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Update input placeholders
  const filterOrigin = document.getElementById("filterOrigin");
  const filterDest = document.getElementById("filterDestination");
  const navQuickSearch = document.getElementById("navQuickSearch");
  const searchInput = document.getElementById("searchInput");

  if (filterOrigin) filterOrigin.placeholder = lang === "ID" ? "Jakarta, Bali, Surabaya..." : "Jakarta, Bali, Surabaya...";
   if (navQuickSearch) navQuickSearch.placeholder = lang === "ID" ? "Mau ke mana?" : "Where to?";
   if (searchInput) searchInput.placeholder = lang === "ID" ? "Cari destinasi atau layanan" : "Search destinations or services";
   document.documentElement.lang = lang === "ID" ? "id" : "en";
   updateCategoryIndicatorText();

  renderCatalog();
  renderPromoCards();
}

// ============================================================================
// 5. MEMORY & DATA INITIALIZATION
// ============================================================================
function initializeArray() {
  servicesArray = RAW_INITIAL_DATA.map((item, index) => {
    return new ItemServiceStruct(
      item.id,
      item.kategori,
      item.nama,
      item.lokasi,
      item.jadwal,
      item.durasi,
      item.kelas,
      item.kuota,
      item.harga,
      item.rating,
      item.gambar,
      item.penyelenggara,
      index
    );
  });
}

/**
  * Simulasi Penukaran Referensi / Pointer (swapByPointer):
 * Menukar elemen pada arr[idxA] dan arr[idxB] via referensi objek
 */
function swapByPointer(arr, idxA, idxB) {
  const tempPtr = arr[idxA];
  arr[idxA] = arr[idxB];
  arr[idxB] = tempPtr;
}

// ============================================================================
// 6. VISUAL EXECUTION LOGGER (PANEL TERMINAL DRAWER)
// ============================================================================
const logStreamEl = document.getElementById("logStream");
const statComparisonsEl = document.getElementById("statComparisons");
const statSwapsEl = document.getElementById("statSwaps");
const statIterationsEl = document.getElementById("statIterations");
const logStepCounterEl = document.getElementById("logStepCounter");
const logOperationStatusEl = document.getElementById("logOperationStatus");
const inlineLogEl = document.getElementById("inlineAlgorithmLog");
let currentAlgorithmKind = "sort";
let algorithmLockedControls = [];

function showAlgorithmPanel() {
  document.getElementById("inlineLogDetails").open = true;
  document.getElementById("algorithmPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderAlgorithmSnapshot(id, items) {
  const list = document.getElementById(id);
  list.replaceChildren();
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "Tidak ada data yang cocok.";
    list.appendChild(li);
  }
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `[${servicesArray.indexOf(item)}] ${item.nama} · Rp ${item.harga.toLocaleString("id-ID")} · rating ${item.rating} · kuota ${item.kuota}`;
    list.appendChild(li);
  });
}

function beginAlgorithm(name, kind, scope) {
  if (isAlgorithmRunning) return false;
  clearLogTerminal();
  currentAlgorithmKind = kind;
  isAlgorithmRunning = true;
  document.body.classList.add("algorithm-running");
  document.getElementById("inlineAlgorithmStatus").textContent = `${name} sedang berjalan…`;
  document.getElementById("inlineAlgorithmScope").textContent = scope;
  renderAlgorithmSnapshot("algorithmBefore", servicesArray);
  document.getElementById("algorithmAfter").replaceChildren();
  const waiting = document.createElement("li");
  waiting.textContent = "Proses berjalan. Hasil akan muncul setelah selesai.";
  document.getElementById("algorithmAfter").appendChild(waiting);
  const selectors = ".algorithm-panel button, .algorithm-panel input, .algorithm-panel select, .cat-pill-btn, .nav-tab-btn, .nav-orders-btn, .card-order-btn, #sortCriterion, #btnResetSearch, #btnResetData, #btnClearLog, #btnRunSort, #btnDrawerSearch, #btnTiketSearch, #btnAdminRefresh";
  algorithmLockedControls = [...document.querySelectorAll(selectors)].filter(el => "disabled" in el && !el.disabled);
  algorithmLockedControls.forEach(el => el.disabled = true);
  updateStatsDisplay();
  showAlgorithmPanel();
  return true;
}

function finishAlgorithm(message, items) {
  document.getElementById("inlineAlgorithmStatus").textContent = message;
  renderAlgorithmSnapshot("algorithmAfter", items);
  updateStatsDisplay();
  isAlgorithmRunning = false;
  document.body.classList.remove("algorithm-running");
  algorithmLockedControls.forEach(el => el.disabled = false);
  algorithmLockedControls = [];
}

function algorithmValue(item, criterion) {
  if (criterion.includes("RATING")) return `rating ${item.rating}`;
  if (criterion.includes("KUOTA")) return `kuota ${item.kuota}`;
  if (criterion === "RECOMMENDED") return `skor ${item.rating * 1000 + item.kuota} (rating × 1000 + kuota)`;
  return `Rp ${item.harga.toLocaleString("id-ID")}`;
}

function resetLogStats() {
  statComparisonsCount = 0;
  statSwapsCount = 0;
  statIterationsCount = 0;
  totalLogSteps = 0;
  updateStatsDisplay();
}

function updateStatsDisplay() {
  if (statComparisonsEl) statComparisonsEl.textContent = statComparisonsCount;
  if (statSwapsEl) statSwapsEl.textContent = statSwapsCount;
  if (statIterationsEl) statIterationsEl.textContent = statIterationsCount;
  if (logStepCounterEl) logStepCounterEl.textContent = `${totalLogSteps} Langkah`;
  if (isAlgorithmRunning) {
    document.getElementById("inlineAlgorithmStats").textContent = `${statComparisonsCount} perbandingan · ${statSwapsCount} ${currentAlgorithmKind === "search" ? "kecocokan" : "pertukaran"} · ${statIterationsCount} iterasi`;
    document.getElementById("inlineLogCount").textContent = `${totalLogSteps} langkah`;
  }
}

function clearLogTerminal() {
  if (isAlgorithmRunning) return;
  if (!logStreamEl) return;
  logStreamEl.innerHTML = `
    <div class="log-welcome">
      <i class="fa-solid fa-laptop-code welcome-icon"></i>
      <p><strong>Terminal Log Telah Dibersihkan</strong></p>
      <p class="text-muted">Siap mencatat eksekusi operasi Sorting atau Searching berikutnya.</p>
    </div>
  `;
  resetLogStats();
  inlineLogEl.innerHTML = '<p class="algorithm-log-empty">Belum ada proses. Klik Urutkan atau Cari untuk menampilkan langkah eksekusi.</p>';
  document.getElementById("inlineAlgorithmStatus").textContent = "Siap dijalankan";
  document.getElementById("inlineAlgorithmStats").textContent = "0 perbandingan · 0 pertukaran · 0 iterasi";
  document.getElementById("inlineLogCount").textContent = "0 langkah";
  document.getElementById("inlineAlgorithmScope").textContent = "Sorting mengurutkan seluruh array layanan. Searching mengikuti kategori aktif.";
  document.getElementById("algorithmBefore").innerHTML = "<li>Belum ada proses.</li>";
  document.getElementById("algorithmAfter").innerHTML = "<li>Hasil akan muncul setelah proses selesai.</li>";
  if (logOperationStatusEl) {
    logOperationStatusEl.innerHTML = `<i class="fa-solid fa-circle-dot text-emerald"></i> Sistem Siap`;
  }
}

function appendLogEntry(type, title, message) {
  if (!logStreamEl) return;
  const welcome = logStreamEl.querySelector(".log-welcome");
  if (welcome) welcome.remove();

  totalLogSteps++;
  const entry = document.createElement("div");
  entry.className = `log-entry log-${type}`;

  let tagClass = `log-tag-${type}`;
  let icon = "fa-info";

  switch (type) {
    case "iter": icon = "fa-arrows-rotate"; break;
    case "compare": icon = "fa-code-compare"; break;
    case "swap": icon = "fa-right-left"; break;
    case "match": icon = "fa-circle-check"; break;
    case "mismatch": icon = "fa-circle-xmark"; break;
    case "pointer": icon = "fa-arrow-pointer"; break;
    case "done": icon = "fa-flag-checkered"; break;
  }

  entry.innerHTML = `
    <div>
      <span class="log-tag ${tagClass}"><i class="fa-solid ${icon}"></i> ${title}</span>
      <span>${message}</span>
    </div>
  `;

  logStreamEl.appendChild(entry);
  logStreamEl.scrollTop = logStreamEl.scrollHeight;
  if (isAlgorithmRunning) {
    inlineLogEl.querySelector(".algorithm-log-empty")?.remove();
    const copy = entry.cloneNode(true);
    const number = document.createElement("span");
    number.className = "algorithm-step-number";
    number.textContent = `#${totalLogSteps}`;
    copy.firstElementChild.prepend(number);
    const followLatest = inlineLogEl.scrollHeight - inlineLogEl.scrollTop - inlineLogEl.clientHeight < 50;
    inlineLogEl.appendChild(copy);
    if (followLatest) inlineLogEl.scrollTop = inlineLogEl.scrollHeight;
  }
  updateStatsDisplay();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getExecutionSpeed() {
  if (!document.getElementById("dsLogDrawer").classList.contains("open")) return 0;
  const speedSelect = document.getElementById("algoSpeed");
  return speedSelect ? parseInt(speedSelect.value, 10) : 500;
}

// ============================================================================
// 7. SORTING ALGORITHMS (BUBBLE SORT & SELECTION SORT)
// ============================================================================
function shouldSwap(itemA, itemB, criterion) {
  switch (criterion) {
    case "PRICE_ASC": return itemA.harga > itemB.harga;
    case "PRICE_DESC": return itemA.harga < itemB.harga;
    case "RATING_DESC": return itemA.rating < itemB.rating;
    case "RATING_ASC": return itemA.rating > itemB.rating;
    case "KUOTA_DESC": return itemA.kuota < itemB.kuota;
    case "RECOMMENDED": default: return (itemA.rating * 1000 + itemA.kuota) < (itemB.rating * 1000 + itemB.kuota);
  }
}

function formatCriterionLabel(crit) {
  switch (crit) {
    case "PRICE_ASC": return "Harga Termurah (Ascending)";
    case "PRICE_DESC": return "Harga Termahal (Descending)";
    case "RATING_DESC": return "Rating Tertinggi (Descending)";
    case "KUOTA_DESC": return "Sisa Kuota Terbanyak (Descending)";
    case "RECOMMENDED": default: return "Rekomendasi Terpopuler";
  }
}

/**
 * BUBBLE SORT ALGORITHM O(N²)
 */
async function runBubbleSort(criterion, speedOverride = null) {
  if (!beginAlgorithm("Bubble Sort", "sort", `${servicesArray.length} layanan dalam seluruh array · ${formatCriterionLabel(criterion)} · O(n²)`)) return;
  clearCardHighlights();
  if (logOperationStatusEl) {
    logOperationStatusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-amber"></i> Memproses Bubble Sort...`;
  }

  appendLogEntry(
    "iter",
    "START BUBBLE SORT",
    `Mulai pengurutan ${servicesArray.length} elemen array berdasarkan <strong>${formatCriterionLabel(criterion)}</strong>.`
  );

  const n = servicesArray.length;
  const speed = speedOverride ?? getExecutionSpeed();

  for (let i = 0; i < n - 1; i++) {
    statIterationsCount++;
    appendLogEntry("iter", `PASS ${i + 1}`, `Evaluasi index 0 s/d ${n - i - 1}`);

    let swappedInThisPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      statComparisonsCount++;
      const itemA = servicesArray[j];
      const itemB = servicesArray[j + 1];

      highlightCards([itemA.id, itemB.id], "highlight-inspect");

      const valA = algorithmValue(itemA, criterion);
      const valB = algorithmValue(itemB, criterion);

      appendLogEntry(
        "compare",
        `COMPARE [${j}] & [${j + 1}]`,
        `Bandingkan: <code>[${j}] ${itemA.nama.slice(0, 22)}...</code> (${valA}) vs <code>[${j + 1}] ${itemB.nama.slice(0, 22)}...</code> (${valB})`
      );

      if (speed > 0) await sleep(speed);

      if (shouldSwap(itemA, itemB, criterion)) {
        statSwapsCount++;
        swappedInThisPass = true;

        highlightCards([itemA.id, itemB.id], "highlight-swap");

        appendLogEntry(
          "swap",
          `SWAP POINTER`,
          `Tukar referensi <code>&amp;arr[${j}] (${itemA.memAddress})</code> ↔ <code>&amp;arr[${j + 1}] (${itemB.memAddress})</code>.`
        );

        swapByPointer(servicesArray, j, j + 1);
        renderCatalog();
        highlightCards([servicesArray[j].id, servicesArray[j + 1].id], "highlight-swap");

        if (speed > 0) await sleep(speed);
      } else {
        appendLogEntry("iter", "TIDAK DITUKAR", `Indeks [${j}] dan [${j + 1}] sudah sesuai urutan.`);
      }

      clearCardHighlights();
    }

    if (!swappedInThisPass) {
      appendLogEntry("done", "OPTIMAL", `Pass ke-${i + 1} tidak memerlukan swap. Array telah terurut optimal.`);
      break;
    }
  }

  appendLogEntry(
    "done",
    "SELESAI",
    `Bubble Sort selesai! Iterasi: ${statIterationsCount}, Perbandingan: ${statComparisonsCount}, Swap: ${statSwapsCount}.`
  );
  if (logOperationStatusEl) {
    logOperationStatusEl.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i> Pengurutan Selesai`;
  }
  finishAlgorithm(`Bubble Sort selesai · ${servicesArray.length} layanan diurutkan`, servicesArray);
  showToast(currentLanguage === "ID" ? "Katalog berhasil diurutkan!" : "Catalog sorted successfully!", "success");
}

/**
 * SELECTION SORT ALGORITHM O(N²)
 */
async function runSelectionSort(criterion, speedOverride = null) {
  if (!beginAlgorithm("Selection Sort", "sort", `${servicesArray.length} layanan dalam seluruh array · ${formatCriterionLabel(criterion)} · O(n²)`)) return;
  clearCardHighlights();
  if (logOperationStatusEl) {
    logOperationStatusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-amber"></i> Memproses Selection Sort...`;
  }

  appendLogEntry(
    "iter",
    "START SELECTION SORT",
    `Mulai Selection Sort pada ${servicesArray.length} elemen berdasarkan <strong>${formatCriterionLabel(criterion)}</strong>.`
  );

  const n = servicesArray.length;
  const speed = speedOverride ?? getExecutionSpeed();

  for (let i = 0; i < n - 1; i++) {
    statIterationsCount++;
    let targetIdx = i;

    appendLogEntry(
      "iter",
      `ITERASI ${i + 1}`,
      `Mencari elemen target untuk indeks <code>[${i}]</code> (Kandidat: ${servicesArray[i].nama.slice(0, 20)}...)`
    );

    highlightCards([servicesArray[i].id], "highlight-inspect");

    for (let j = i + 1; j < n; j++) {
      statComparisonsCount++;
      const currentCandidate = servicesArray[targetIdx];
      const inspecting = servicesArray[j];

      highlightCards([currentCandidate.id, inspecting.id], "highlight-inspect");
      appendLogEntry("compare", `COMPARE [${targetIdx}] & [${j}]`,
        `Kandidat "${currentCandidate.nama}" (${algorithmValue(currentCandidate, criterion)}) dibandingkan dengan "${inspecting.nama}" (${algorithmValue(inspecting, criterion)}).`);

      if (speed > 0) await sleep(speed);

      if (shouldSwap(currentCandidate, inspecting, criterion)) {
        targetIdx = j;
        appendLogEntry("pointer", `KANDIDAT BARU`, `Ditemukan di index <code>[${targetIdx}] ${servicesArray[targetIdx].nama.slice(0, 20)}...</code>`);
      } else {
        appendLogEntry("iter", "KANDIDAT TETAP", `Indeks [${targetIdx}] masih menjadi kandidat untuk posisi [${i}].`);
      }

      clearCardHighlights();
    }

    if (targetIdx !== i) {
      statSwapsCount++;
      const itemA = servicesArray[i];
      const itemB = servicesArray[targetIdx];

      highlightCards([itemA.id, itemB.id], "highlight-swap");
      appendLogEntry("swap", `SWAP POINTER`, `Tukar indeks <code>[${i}] (${itemA.memAddress})</code> dengan <code>[${targetIdx}] (${itemB.memAddress})</code>.`);

      swapByPointer(servicesArray, i, targetIdx);
      renderCatalog();
      highlightCards([servicesArray[i].id, servicesArray[targetIdx].id], "highlight-swap");

      if (speed > 0) await sleep(speed);
    }

    clearCardHighlights();
  }

  appendLogEntry(
    "done",
    "SELESAI",
    `Selection Sort selesai! Iterasi: ${statIterationsCount}, Perbandingan: ${statComparisonsCount}, Swap: ${statSwapsCount}.`
  );
  if (logOperationStatusEl) {
    logOperationStatusEl.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i> Pengurutan Selesai`;
  }
  finishAlgorithm(`Selection Sort selesai · ${servicesArray.length} layanan diurutkan`, servicesArray);
  showToast(currentLanguage === "ID" ? "Katalog berhasil diurutkan!" : "Catalog sorted successfully!", "success");
}

// ============================================================================
// 8. SEARCHING ALGORITHM (LINEAR SEARCH) & SEARCH HISTORY
// ============================================================================
async function runLinearSearch(query, predicate = null, speedOverride = null) {
  if (isAlgorithmRunning) return;
  if (!query || query.trim() === "") {
    showToast(currentLanguage === "ID" ? "Silakan masukkan kata kunci pencarian!" : "Please enter search keyword!", "warn");
    return;
  }

  switchView("catalog");

  const searchCategory = activeFilterCategory;
  if (!beginAlgorithm("Linear Search", "search", `Kata kunci: "${query}" · kategori ${categoryLabel(searchCategory)} · ${servicesArray.length} elemen diperiksa · O(n)`)) return;
  clearCardHighlights();
  if (logOperationStatusEl) {
    logOperationStatusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-primary"></i> Memproses Linear Search...`;
  }

  const cleanQuery = query.toLowerCase().trim();
  const speed = speedOverride ?? getExecutionSpeed();
  const n = servicesArray.length;
  let matchesFound = [];

  appendLogEntry(
    "iter",
    "START LINEAR SEARCH",
    `Mulai Linear Search sekuensial O(N) untuk query: "<strong>${query}</strong>" pada ${n} elemen array.`
  );

  searchResultIds = null;
  renderCatalog();

  for (let i = 0; i < n; i++) {
    statIterationsCount++;
    statComparisonsCount++;

    const item = servicesArray[i];
    const matchName = item.nama.toLowerCase().includes(cleanQuery);
    const matchLoc = item.lokasi.toLowerCase().includes(cleanQuery);
    const matchCat = item.kategori.toLowerCase().includes(cleanQuery);
    const matchOrganizer = item.penyelenggara ? item.penyelenggara.toLowerCase().includes(cleanQuery) : false;
    const matchClass = item.kelas ? item.kelas.toLowerCase().includes(cleanQuery) : false;

    highlightCards([item.id], "highlight-inspect");

    appendLogEntry(
      "compare",
      `INSPEKSI [${i}]`,
      `Periksa <code>${item.memAddress}</code>: "${item.nama.slice(0, 25)}..." (${item.lokasi})`
    );

    if (speed > 0) await sleep(speed);

    const matchesCategory = searchCategory === "ALL" || item.kategori === searchCategory;
    const matchesQuery = predicate ? predicate(item) : (matchName || matchLoc || matchCat || matchOrganizer || matchClass);
    if (matchesCategory && matchesQuery) {
      statSwapsCount++; // Counter match
      matchesFound.push(item);
      highlightCardMatch(item.id);

      appendLogEntry(
        "match",
        `MATCH DITEMUKAN!`,
        `Kecocokan index <code>[${i}]</code>! Alamat: <code>${item.memAddress}</code>. Nama: "${item.nama}".`
      );

      if (matchesFound.length === 1) {
        setPointerReference(item, i);
      }
    } else {
      appendLogEntry("mismatch", `TIDAK COCOK`, `Indeks <code>[${i}]</code>: ${!matchesCategory ? "kategori berbeda dari filter aktif" : "kata kunci / rute tidak sesuai"}.`);
      unhighlightCard(item.id);
    }

    if (speed > 0) await sleep(speed / 2);
  }

  // Simpan ke Riwayat Pencarian Terakhir (Array Cache)
  searchResultIds = matchesFound.map(item => item.id);
  renderCatalog();
  addSearchHistory(cleanQuery, matchesFound.length, predicate);

  if (matchesFound.length > 0) {
    appendLogEntry(
      "done",
      "SELESAI",
      `Linear Search menemukan <strong>${matchesFound.length} item</strong> cocok dengan query "${query}".`
    );
    if (logOperationStatusEl) {
      logOperationStatusEl.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i> ${matchesFound.length} Item Ditemukan`;
    }
    showToast(
      currentLanguage === "ID"
        ? `Ditemukan ${matchesFound.length} tiket/layanan cocok dengan "${query}"!`
        : `Found ${matchesFound.length} items matching "${query}"!`,
      "success"
    );

  } else {
    appendLogEntry(
      "done",
      "TIDAK DITEMUKAN",
      `Pencarian linear selesai. 0 kecocokan untuk "${query}" pada ${n} indeks.`
    );
    if (logOperationStatusEl) {
      logOperationStatusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-amber"></i> 0 Item Ditemukan`;
    }
    showToast(
      currentLanguage === "ID"
        ? `Belum ada perjalanan yang cocok dengan "${query}"`
        : `No items found with keyword "${query}"`,
      "warn"
    );
  }

  finishAlgorithm(`Linear Search selesai · ${matchesFound.length} layanan ditemukan`, matchesFound);
}

function addSearchHistory(query, count, predicate = null) {
  const existingIdx = searchHistoryArray.findIndex(item => item.query.toLowerCase() === query.toLowerCase());
  if (existingIdx !== -1) {
    searchHistoryArray.splice(existingIdx, 1);
  }

  searchHistoryArray.unshift({
    query: query,
    count: count,
    category: activeFilterCategory,
    predicate,
    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  });

  if (searchHistoryArray.length > 6) {
    searchHistoryArray.pop();
  }

  renderSearchHistory();
}

function renderSearchHistory() {
  const container = document.getElementById("historyTagsWrap");
  if (!container) return;

  if (searchHistoryArray.length === 0) {
    container.innerHTML = `<span class="history-empty text-muted">${currentLanguage === "ID" ? "Belum ada riwayat pencarian." : "No recent searches."}</span>`;
    return;
  }

  container.innerHTML = "";
  searchHistoryArray.forEach((item, idx) => {
    const chip = document.createElement("span");
    chip.className = "history-chip";
    chip.innerHTML = `
      <i class="fa-solid fa-clock-rotate-left"></i>
      <span>${item.query}</span>
      <span class="badge-tag" style="background: rgba(0,0,0,0.25);">${item.count}</span>
      <i class="fa-solid fa-xmark history-chip-remove" data-idx="${idx}" title="Hapus"></i>
    `;

    chip.addEventListener("click", (e) => {
      if (e.target.classList.contains("history-chip-remove")) {
        e.stopPropagation();
        searchHistoryArray.splice(idx, 1);
        renderSearchHistory();
        return;
      }
      const searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = item.query;
      if (isAlgorithmRunning) return;
      window.switchCategoryFilter(item.category);
      runLinearSearch(item.query, item.predicate);
    });

    container.appendChild(chip);
  });
}

// ============================================================================
// 9. POINTER MANAGEMENT & MEMORY INSPECTOR
// ============================================================================
function setPointerReference(itemStruct, index = null) {
  selectedItemPointer = itemStruct;
  const deref = itemStruct.dereference();

  const dispAddr = document.getElementById("dispPtrAddress");
  const dispName = document.getElementById("dispPtrName");
  const dispPrice = document.getElementById("dispPtrPrice");
  const dispCat = document.getElementById("dispPtrCategory");
  const dispQuota = document.getElementById("dispPtrQuota");
  const dispIdx = document.getElementById("dispPtrIndex");

  if (dispAddr) dispAddr.textContent = deref.address;
  if (dispName) dispName.textContent = deref.data.nama;
  if (dispPrice) dispPrice.textContent = `Rp ${deref.data.harga.toLocaleString("id-ID")}`;
  if (dispCat) dispCat.textContent = `${deref.data.kategori} &bull; ${deref.data.kelas || "Reguler"}`;
  if (dispQuota) dispQuota.textContent = `${deref.data.kuota} Tiket Tersedia`;

  if (dispIdx) {
    if (index !== null) {
      dispIdx.textContent = `Index [${index}]`;
    } else {
      const idx = servicesArray.findIndex(item => item.id === itemStruct.id);
      dispIdx.textContent = idx !== -1 ? `Index [${idx}]` : "Dynamic";
    }
  }

  // Update visual card borders
  document.querySelectorAll(".service-card").forEach(card => {
    if (parseInt(card.dataset.id, 10) === itemStruct.id) {
      card.classList.add("pointer-selected");
    } else {
      card.classList.remove("pointer-selected");
    }
  });

  appendLogEntry(
    "pointer",
    "POINTER ASSIGNMENT",
    `Pointer <code>selectedItemPtr</code> merujuk pada alamat memori <code>${deref.address}</code> ("${deref.data.nama}").`
  );
}

function clearCardHighlights() {
  document.querySelectorAll(".service-card").forEach(c => {
    c.classList.remove("highlight-inspect", "highlight-swap", "highlight-match");
  });
}

function highlightCards(ids, className) {
  document.querySelectorAll(".service-card").forEach(c => {
    const id = parseInt(c.dataset.id, 10);
    if (ids.includes(id)) {
      c.classList.add(className);
    }
  });
}

function highlightCardMatch(id) {
  const card = document.querySelector(`.service-card[data-id="${id}"]`);
  if (card) {
    card.classList.remove("highlight-inspect");
    card.classList.add("highlight-match");
  }
}

function unhighlightCard(id) {
  const card = document.querySelector(`.service-card[data-id="${id}"]`);
  if (card) {
    card.classList.remove("highlight-inspect");
  }
}

// ============================================================================
// 10. UI RENDERING: KATALOG LAYANAN & EVENT (ALA LOKET.COM + TRAVEL)
// ============================================================================
const catalogGridEl = document.getElementById("catalogGrid");
const displayedCountEl = document.getElementById("displayedCount");
const totalCountEl = document.getElementById("totalCount");

function getCategoryBadgeClass(kategori) {
  return `badge-${kategori.toLowerCase()}`;
}

function getCategoryIcon(kategori) {
  switch (kategori) {
    case "PESAWAT": return '<i class="fa-solid fa-plane"></i>';
    case "KERETA": return '<i class="fa-solid fa-train"></i>';
    case "BUS": return '<i class="fa-solid fa-bus"></i>';
    case "HOTEL": return '<i class="fa-solid fa-hotel"></i>';
    case "WISATA": return '<i class="fa-solid fa-umbrella-beach"></i>';
    default: return '<i class="fa-solid fa-ticket"></i>';
  }
}

function renderCatalog() {
  if (!catalogGridEl) return;
  catalogGridEl.innerHTML = "";

  const filtered = servicesArray.filter(item => {
    if (searchResultIds !== null && !searchResultIds.includes(item.id)) return false;
    if (activeFilterCategory === "ALL") return true;
    return item.kategori === activeFilterCategory;
  });

  if (displayedCountEl) displayedCountEl.textContent = filtered.length;
  if (totalCountEl) totalCountEl.textContent = servicesArray.length;

  if (filtered.length === 0) {
    catalogGridEl.innerHTML = `
      <div class="empty-catalog-box">
        <i class="fa-solid fa-ticket-simple" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3>Belum ada perjalanan yang cocok</h3>
        <p class="text-muted">Coba pilih kategori lain atau bersihkan kata kunci pencarian.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "service-card";
    card.dataset.id = item.id;
    card.dataset.category = item.kategori;

    if (selectedItemPointer && selectedItemPointer.id === item.id) {
      card.classList.add("pointer-selected");
    }

    const badgeClass = getCategoryBadgeClass(item.kategori);
    const catIcon = getCategoryIcon(item.kategori);

    const orderBtnText = currentLanguage === "ID" ? "Pilih" : "Select";
    const priceUnit = item.kategori === "HOTEL" ? (currentLanguage === "ID" ? "/ kamar / malam" : "/ room / night") : (currentLanguage === "ID" ? "/ orang" : "/ person");

    const quotaLabel = currentLanguage === "ID" ? `${item.kuota} ${item.kategori === "HOTEL" ? "kamar" : "tiket"} tersedia` : `${item.kuota} available`;
    const priceFromLabel = currentLanguage === "ID" ? "Mulai dari" : "Starts from";

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${item.gambar}" alt="${item.nama}" loading="lazy">
        <span class="card-badge-category ${badgeClass}">${catIcon} ${categoryLabel(item.kategori)}</span>
        <span class="card-quota-badge">${quotaLabel}</span>
      </div>
      <div class="card-body">
        <div class="card-organizer-row">
          <span class="card-organizer"><i class="fa-solid fa-circle-check text-primary"></i> ${item.penyelenggara}</span>
          <div class="card-rating">
            <i class="fa-solid fa-star"></i>
            <span>${item.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 class="card-title">${item.nama}</h3>

        <div class="card-meta-line">
          <i class="fa-solid fa-calendar-day text-amber"></i>
          <span>${item.jadwal}</span>
        </div>

        <div class="card-meta-line">
          <i class="fa-solid fa-location-dot text-rose"></i>
          <span>${item.lokasi}</span>
        </div>

        <div class="card-divider"></div>

        <div class="card-footer">
          <div class="card-price-box">
            <span class="price-lbl">${priceFromLabel}</span>
            <span class="price-val">Rp ${item.harga.toLocaleString("id-ID")}</span>
            <span class="price-lbl">${priceUnit}</span>
          </div>
          <button class="btn btn-primary card-order-btn" data-action="order" title="${orderBtnText}">
            <i class="fa-solid fa-ticket"></i> ${orderBtnText}
          </button>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      if (isAlgorithmRunning) return;
      setPointerReference(item);
      openCheckoutModal(item);
    });

    catalogGridEl.appendChild(card);
  });
}

function categoryLabel(category) {
  const dict = I18N_DICTIONARY[currentLanguage];
  const catNames = {
    ALL: currentLanguage === "ID" ? "Semua perjalanan" : "All journeys",
    PESAWAT: dict.pill_flights, HOTEL: dict.pill_hotels,
    KERETA: dict.pill_trains, BUS: dict.pill_buses, WISATA: dict.pill_activities
  };
  return catNames[category] || category;
}

function updateCategoryIndicatorText() {
  document.getElementById("txtActiveCategory").textContent = categoryLabel(activeFilterCategory);
  const isRoute = ["PESAWAT", "KERETA", "BUS"].includes(activeFilterCategory);
  const id = currentLanguage === "ID";
  document.getElementById("originLabel").textContent = isRoute ? (id ? "Dari" : "From") : (id ? "Kota / destinasi" : "City / destination");
  document.getElementById("destinationLabel").textContent = isRoute ? (id ? "Ke" : "To") : (id ? "Nama hotel atau layanan" : "Hotel or service name");
  document.getElementById("filterOrigin").placeholder = isRoute ? (id ? "Kota asal" : "Departure city") : (id ? "Pilih kota" : "Choose a city");
  document.getElementById("filterDestination").placeholder = isRoute ? (id ? "Kota tujuan" : "Destination city") : (id ? "Nama layanan (opsional)" : "Service name (optional)");
  document.getElementById("btnSwapLocations").hidden = !isRoute;
  document.querySelectorAll(".nav-tab-btn[data-cat]").forEach(b => b.classList.toggle("active", b.dataset.cat === activeFilterCategory));
}

window.switchCategoryFilter = function(cat) {
  if (isAlgorithmRunning) return;
  searchResultIds = null;
  activeFilterCategory = cat;
  document.querySelectorAll(".cat-pill-btn, .category-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.category === cat);
  });
  updateCategoryIndicatorText();
  switchView("catalog");
  renderCatalog();
  const catalogSection = document.getElementById("viewCatalog");
  if (catalogSection) {
    catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Render Promo Cards
function renderPromoCards() {
  const grid = document.getElementById("promoCardsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  promoCodesArray.forEach(promo => {
    const card = document.createElement("div");
    card.className = "promo-card";
    const discountLabel = promo.diskonPersen > 0 ? `DISKON ${promo.diskonPersen}%` : `POTONGAN Rp ${promo.diskonNominal.toLocaleString("id-ID")}`;

    const copyLabel = currentLanguage === "ID" ? "Salin Kode" : "Copy Code";

    card.innerHTML = `
      <div class="promo-card-top">
        <span class="promo-discount-badge"><i class="fa-solid fa-bolt"></i> ${discountLabel}</span>
        <span class="badge-tag">${promo.syarat}</span>
      </div>
      <div class="promo-code-box">
        <span class="promo-code-val">${promo.code}</span>
        <button class="btn-copy-promo" data-code="${promo.code}"><i class="fa-solid fa-copy"></i> ${copyLabel}</button>
      </div>
      <p class="promo-desc">${promo.deskripsi}</p>
      <div class="promo-card-footer">
        <i class="fa-solid fa-shield-check text-emerald"></i>
        <span>Voucher Resmi NusantaraGo</span>
      </div>
    `;

    const copyBtn = card.querySelector(".btn-copy-promo");
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      copyPromoCode(promo.code);
    });

    grid.appendChild(card);
  });
}

function copyPromoCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    showToast(currentLanguage === "ID" ? `Kode promo "${code}" berhasil disalin!` : `Promo code "${code}" copied!`, "success");
  }).catch(() => {
    showToast(`Kode promo: ${code}`, "info");
  });
}

// ============================================================================
// 11. CHECKOUT MODAL WIZARD (ALUR PEMBAYARAN 4-STEP)
// ============================================================================
const checkoutModalOverlay = document.getElementById("checkoutModalOverlay");
const btnCheckoutModalClose = document.getElementById("btnCheckoutModalClose");
const btnCancelCheckout = document.getElementById("btnCancelCheckout");
const btnWizardNext = document.getElementById("btnWizardNext");
const btnWizardPrev = document.getElementById("btnWizardPrev");
const btnConfirmPayment = document.getElementById("btnConfirmPayment");
const btnApplyPromo = document.getElementById("btnApplyPromo");

function openCheckoutModal(itemStruct) {
  selectedItemPointer = itemStruct;
  const deref = itemStruct.dereference();
  const data = deref.data;

  // Reset wizard
  currentCheckoutStep = 1;
  appliedPromo = null;
  updateWizardStepsUI();

  // Populate info preview
  document.getElementById("checkoutModalCatTag").innerHTML = `${getCategoryIcon(data.kategori)} ${data.kategori}`;
  document.getElementById("checkoutModalItemTitle").textContent = data.nama;
  document.getElementById("checkoutModalPtrAddress").textContent = deref.address;
  document.getElementById("checkoutModalQuotaNotice").textContent = `Sisa Kuota: ${data.kuota} Tiket`;
  document.getElementById("checkoutModalItemImage").src = data.gambar;
  document.getElementById("checkoutModalItemLocation").textContent = data.lokasi;
  document.getElementById("checkoutModalItemSchedule").textContent = `${data.jadwal} • ${data.durasi}`;
  document.getElementById("checkoutModalItemRating").textContent = `${data.rating.toFixed(1)} ★ (${data.penyelenggara})`;
  document.getElementById("checkoutModalItemPrice").textContent = `Rp ${data.harga.toLocaleString("id-ID")}`;

  // Date default
  const today = localDate();
  document.getElementById("custDate").min = today;
  document.getElementById("custDate").value = document.getElementById("filterDate").value || today;
  const classSelect = document.getElementById("custServiceClass");
  classSelect.replaceChildren(new Option(data.kelas, data.kelas));
  document.getElementById("labelCustQuantity").textContent = data.kategori === "HOTEL" ? "Jumlah kamar (1 malam)" : "Jumlah tiket";

  // Reset promo inputs
  const promoInput = document.getElementById("inputPromoCode");
  if (promoInput) promoInput.value = "";
  const feedback = document.getElementById("promoValidationFeedback");
  if (feedback) feedback.innerHTML = "";
  document.getElementById("promoStatusTxt").textContent = "Belum ada promo diterapkan";
  document.getElementById("promoStatusTxt").className = "text-muted";
  document.getElementById("promoDiscountTxt").textContent = "Rp 0";

  // Quantity input max bound
  const qtyInput = document.getElementById("custQuantity");
  qtyInput.value = Math.min(Number(document.getElementById("filterClass").value), data.kuota) || 1;
  qtyInput.max = data.kuota;

  // Render quick promo chips
  renderQuickPromoChips();

  // Show modal
  checkoutModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  checkoutModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function renderQuickPromoChips() {
  const container = document.getElementById("quickPromoChips");
  if (!container) return;
  container.innerHTML = "";

  promoCodesArray.forEach(p => {
    const chip = document.createElement("span");
    chip.className = "quick-chip";
    chip.textContent = p.code;
    chip.title = p.deskripsi;
    chip.addEventListener("click", () => {
      document.getElementById("inputPromoCode").value = p.code;
      validateAndApplyPromo(p.code);
    });
    container.appendChild(chip);
  });
}

function updateWizardStepsUI() {
  document.querySelectorAll(".step-nav-item").forEach(item => {
    const step = parseInt(item.dataset.step, 10);
    item.classList.toggle("active", step === currentCheckoutStep);
    item.classList.toggle("completed", step < currentCheckoutStep);
  });

  for (let s = 1; s <= 4; s++) {
    const stepEl = document.getElementById(`checkoutStep${s}`);
    if (stepEl) {
      stepEl.classList.toggle("active", s === currentCheckoutStep);
    }
  }

  if (currentCheckoutStep === 1) {
    btnWizardPrev.style.display = "none";
    btnWizardNext.style.display = "inline-flex";
    btnConfirmPayment.style.display = "none";
  } else if (currentCheckoutStep === 4) {
    btnWizardPrev.style.display = "inline-flex";
    btnWizardNext.style.display = "none";
    btnConfirmPayment.style.display = "inline-flex";
    populateOrderSummary();
  } else {
    btnWizardPrev.style.display = "inline-flex";
    btnWizardNext.style.display = "inline-flex";
    btnConfirmPayment.style.display = "none";
  }
}

/**
 * Validasi Kode Promo via Linear Search O(N) pada promoCodesArray
 */
function validateAndApplyPromo(code) {
  if (!code || code.trim() === "") {
    showToast(currentLanguage === "ID" ? "Masukkan kode promo terlebih dahulu!" : "Please enter promo code!", "warn");
    return;
  }

  const cleanCode = code.toUpperCase().trim();
  const feedback = document.getElementById("promoValidationFeedback");

  let foundPromo = null;
  for (let i = 0; i < promoCodesArray.length; i++) {
    if (promoCodesArray[i].code === cleanCode) {
      foundPromo = promoCodesArray[i];
      break;
    }
  }

  if (!foundPromo) {
    feedback.innerHTML = `<span class="text-rose"><i class="fa-solid fa-circle-xmark"></i> Kode promo "${cleanCode}" tidak valid.</span>`;
    appliedPromo = null;
    document.getElementById("promoStatusTxt").textContent = "Kode tidak valid";
    document.getElementById("promoStatusTxt").className = "text-rose";
    document.getElementById("promoDiscountTxt").textContent = "Rp 0";
    showToast(`Kode "${cleanCode}" tidak ditemukan!`, "warn");
    return;
  }

  const qty = parseInt(document.getElementById("custQuantity").value, 10) || 1;
  const baseTotal = selectedItemPointer.harga * qty;

  if (baseTotal < foundPromo.minOrder) {
    feedback.innerHTML = `<span class="text-amber"><i class="fa-solid fa-triangle-exclamation"></i> Min. transaksi Rp ${foundPromo.minOrder.toLocaleString("id-ID")} belum terpenuhi.</span>`;
    appliedPromo = null;
    showToast(`Syarat min. pembelian Rp ${foundPromo.minOrder.toLocaleString("id-ID")}`, "warn");
    return;
  }

  let discountVal = 0;
  if (foundPromo.diskonPersen > 0) {
    discountVal = (baseTotal * foundPromo.diskonPersen) / 100;
    if (discountVal > foundPromo.maxDiskon) {
      discountVal = foundPromo.maxDiskon;
    }
  } else {
    discountVal = foundPromo.diskonNominal;
  }

  appliedPromo = {
    ...foundPromo,
    calculatedDiscount: discountVal
  };

  feedback.innerHTML = `<span class="text-emerald"><i class="fa-solid fa-circle-check"></i> Voucher "${foundPromo.code}" aktif! Hemat Rp ${discountVal.toLocaleString("id-ID")}.</span>`;
  document.getElementById("promoStatusTxt").textContent = `Aktif: ${foundPromo.code}`;
  document.getElementById("promoStatusTxt").className = "text-emerald";
  document.getElementById("promoDiscountTxt").textContent = `- Rp ${discountVal.toLocaleString("id-ID")}`;

  appendLogEntry(
    "match",
    "PROMO LINEAR SEARCH MATCH",
    `Voucher <code>${foundPromo.code}</code> divalidasi. Potongan harga Rp ${discountVal.toLocaleString("id-ID")}.`
  );
  showToast(`Voucher ${foundPromo.code} berhasil diterapkan!`, "success");
}

function calculateOrderTotals() {
  const item = selectedItemPointer;
  const qty = parseInt(document.getElementById("custQuantity").value, 10) || 1;
  const classOption = document.getElementById("custServiceClass").value;

  const basePrice = item.harga;
  let classAdjustmentUnit = 0;

  const subtotal = (basePrice + classAdjustmentUnit) * qty;
  const discount = appliedPromo ? appliedPromo.calculatedDiscount : 0;
  const finalTotal = Math.max(0, subtotal - discount);

  return {
    basePrice,
    qty,
    classOption,
    classAdjustmentTotal: classAdjustmentUnit * qty,
    subtotal,
    discount,
    finalTotal
  };
}

function populateOrderSummary() {
  const totals = calculateOrderTotals();
  const name = document.getElementById("custFullName").value;
  const email = document.getElementById("custEmail").value;
  const phone = document.getElementById("custPhone").value;
  const nik = document.getElementById("custNik").value;
  const date = document.getElementById("custDate").value;

  const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = selectedPayment ? selectedPayment.value : "QRIS";

  document.getElementById("sumCustName").textContent = name;
  document.getElementById("sumCustContact").textContent = `${email} • ${phone} (NIK: ${nik})`;
  document.getElementById("sumServiceName").textContent = `${selectedItemPointer.nama} (${totals.classOption})`;
  document.getElementById("sumScheduleDate").textContent = `${date} • ${selectedItemPointer.jadwal} (${totals.qty} Tiket)`;

  document.getElementById("sumBaseTotal").textContent = `Rp ${(totals.basePrice * totals.qty).toLocaleString("id-ID")}`;
  document.getElementById("sumClassAdjustment").textContent = `${totals.classAdjustmentTotal >= 0 ? '+' : '-'} Rp ${Math.abs(totals.classAdjustmentTotal).toLocaleString("id-ID")}`;
  document.getElementById("sumPromoDiscount").textContent = `- Rp ${totals.discount.toLocaleString("id-ID")}`;
  document.getElementById("sumPaymentMethod").textContent = paymentMethod;
  document.getElementById("sumFinalTotal").textContent = `Rp ${totals.finalTotal.toLocaleString("id-ID")}`;
  document.getElementById("btnPayAmount").textContent = `Rp ${totals.finalTotal.toLocaleString("id-ID")}`;
}

/**
 * Konfirmasi Pembayaran & Terbitkan E-Ticket (Order Struct)
 */
async function processPaymentAndIssueTicket() {
  const totals = calculateOrderTotals();
  const name = document.getElementById("custFullName").value.trim();
  const email = document.getElementById("custEmail").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const nik = document.getElementById("custNik").value.trim();
  const date = document.getElementById("custDate").value;

  const agree = document.getElementById("checkAgreeTerms").checked;
  if (!agree) {
    showToast(currentLanguage === "ID" ? "Harap setujui syarat dan ketentuan pemesanan!" : "Please agree to terms and conditions!", "warn");
    return;
  }

  if (selectedItemPointer.kuota < totals.qty) {
    showToast(`Maaf, sisa tiket tidak mencukupi (Tersisa: ${selectedItemPointer.kuota})!`, "warn");
    return;
  }

  btnConfirmPayment.disabled = true;
  btnConfirmPayment.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses Transaksi...`;

  await sleep(600);

  // 1. Mutasi kuota di struct layanan
  selectedItemPointer.kuota -= totals.qty;

  // 2. Terbitkan Objek OrderTransactionStruct
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const bookingCode = `NTG-${randomSuffix}`;
  const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = selectedPayment ? selectedPayment.value : "QRIS";

  const newOrder = new OrderTransactionStruct(
    bookingCode,
    selectedItemPointer.id,
    selectedItemPointer.nama,
    selectedItemPointer.kategori,
    selectedItemPointer.lokasi,
    selectedItemPointer.jadwal,
    selectedItemPointer.durasi,
    name,
    email,
    phone,
    nik,
    totals.classOption,
    date,
    totals.qty,
    totals.basePrice,
    totals.classAdjustmentTotal,
    totals.discount,
    appliedPromo ? appliedPromo.code : "-",
    paymentMethod,
    totals.finalTotal,
    ordersArray.length
  );

  ordersArray.unshift(newOrder);

  appendLogEntry(
    "done",
    "E-TICKET RESMI TERBIT",
    `Booking <strong>${bookingCode}</strong> berhasil diterbitkan! Alamat Memori: <code>${newOrder.memAddress}</code>. Acara: "${newOrder.namaLayanan}". Total Bayar: <strong>Rp ${totals.finalTotal.toLocaleString("id-ID")}</strong>.`
  );

  appendLogEntry(
    "pointer",
    "MUTASI KUOTA ARRAY",
    `Kuota objek <code>${selectedItemPointer.memAddress}</code> berkurang ${totals.qty}. Sisa kuota: <strong>${selectedItemPointer.kuota}</strong>.`
  );

  updateOrdersBadge();
  renderCatalog();
  renderOrders();
  renderAdmin();

  btnConfirmPayment.disabled = false;
  btnConfirmPayment.innerHTML = `<i class="fa-solid fa-lock"></i> Bayar Sekarang (<span id="btnPayAmount">Rp 0</span>)`;
  closeCheckoutModal();

  showToast(`Pembayaran Sukses! Tiket ${bookingCode} resmi terbit.`, "success");
  openTicketModal(newOrder);
}

function updateOrdersBadge() {
  const badge = document.getElementById("orderBadgeCount");
  if (badge) {
    const activeOrders = ordersArray.filter(o => o.status !== "REFUNDED").length;
    badge.textContent = activeOrders;
  }
}

// ============================================================================
// 12. E-TICKET MODAL & CETAK TIKET
// ============================================================================
const ticketModalOverlay = document.getElementById("ticketModalOverlay");
const btnTicketModalClose = document.getElementById("btnTicketModalClose");
const btnCloseTicketModal = document.getElementById("btnCloseTicketModal");
const btnPrintTicket = document.getElementById("btnPrintTicket");

function openTicketModal(order) {
  selectedOrderPointer = order;

  document.getElementById("ticketBookingCode").textContent = order.orderId;
  document.getElementById("ticketMemAddress").textContent = order.memAddress;
  document.getElementById("ticketServiceName").textContent = order.namaLayanan;
  document.getElementById("ticketCategoryClass").textContent = `${order.kategori} &bull; Kategori ${order.kelas}`;
  document.getElementById("ticketRouteText").textContent = order.lokasi;
  document.getElementById("ticketScheduleText").textContent = `${order.jadwal} &bull; Durasi: ${order.durasi}`;
  document.getElementById("ticketPassengerName").textContent = order.namaPemesan;
  document.getElementById("ticketNik").textContent = order.nik;
  document.getElementById("ticketTravelDate").textContent = order.tanggal;
  document.getElementById("ticketQuantity").textContent = `${order.qty} Tiket`;
  document.getElementById("ticketPaymentMethod").textContent = order.metodePembayaran;
  document.getElementById("ticketTotalAmount").textContent = `Rp ${order.totalBayar.toLocaleString("id-ID")}`;
  document.getElementById("ticketBarcodeNumber").textContent = `${order.orderId.replace("-", "")}${order.nik.slice(-6)}`;

  const badgeEl = document.getElementById("ticketBadgeStatus");
  if (order.status === "TERBIT") {
    badgeEl.textContent = "TERBIT &bull; LUNAS";
    badgeEl.style.background = "rgba(16, 185, 129, 0.25)";
    badgeEl.style.color = "#34d399";
  } else if (order.status === "RESCHEDULED") {
    badgeEl.textContent = "RESCHEDULED &bull; JADWAL DIPERBARUI";
    badgeEl.style.background = "rgba(245, 158, 11, 0.25)";
    badgeEl.style.color = "#fbbf24";
  } else {
    badgeEl.textContent = "REFUNDED &bull; DIBATALKAN";
    badgeEl.style.background = "rgba(239, 68, 68, 0.25)";
    badgeEl.style.color = "#f87171";
  }

  ticketModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeTicketModal() {
  ticketModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ============================================================================
// 13. VIEW 2: PESANAN SAYA (ORDERS VIEW, RESCHEDULE, REFUND)
// ============================================================================
let activeOrderFilter = "ALL";
let orderSearchQuery = "";

function renderOrders() {
  const container = document.getElementById("ordersListGrid");
  if (!container) return;
  container.innerHTML = "";

  const activeCount = ordersArray.filter(o => o.status === "TERBIT").length;
  const rescheduledCount = ordersArray.filter(o => o.status === "RESCHEDULED").length;
  const refundedCount = ordersArray.filter(o => o.status === "REFUNDED").length;

  const setIfExists = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setIfExists("statOrdersActive", activeCount);
  setIfExists("statOrdersRescheduled", rescheduledCount);
  setIfExists("statOrdersRefunded", refundedCount);

  let filtered = ordersArray.filter(order => {
    if (activeOrderFilter !== "ALL" && order.status !== activeOrderFilter) {
      return false;
    }
    if (orderSearchQuery.trim() !== "") {
      const q = orderSearchQuery.toLowerCase();
      const matchCode = order.orderId.toLowerCase().includes(q);
      const matchName = order.namaPemesan.toLowerCase().includes(q);
      const matchService = order.namaLayanan.toLowerCase().includes(q);
      return matchCode || matchName || matchService;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-orders-state">
        <i class="fa-solid fa-ticket-simple empty-orders-icon"></i>
        <h3>Belum Ada Tiket Pesanan</h3>
        <p class="text-muted" style="margin: 8px 0 16px;">Anda belum melakukan pemesanan tiket atau tidak ada tiket yang cocok dengan filter pencarian.</p>
        <button class="btn btn-primary" onclick="switchView('catalog')">
          <i class="fa-solid fa-compass"></i> Buka Katalog &amp; Pesan Tiket
        </button>
      </div>
    `;
    return;
  }

  filtered.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    let statusClass = "status-terbit";
    if (order.status === "RESCHEDULED") statusClass = "status-rescheduled";
    if (order.status === "REFUNDED") statusClass = "status-refunded";

    const catIcon = getCategoryIcon(order.kategori);

    card.innerHTML = `
      <div class="order-card-main">
        <div class="order-top-row">
          <div class="order-booking-badge">
            <i class="fa-solid fa-ticket"></i>
            <span>${order.orderId}</span>
          </div>
          <span class="order-status-tag ${statusClass}">${order.status}</span>
        </div>

        <h3 class="order-service-title">${catIcon} ${order.namaLayanan}</h3>

        <div class="order-route-banner">
          <i class="fa-solid fa-location-dot text-rose"></i>
          <strong>${order.lokasi}</strong>
          <span class="text-muted">(${order.jadwal} • ${order.durasi})</span>
        </div>

        <div class="order-details-grid">
          <div class="detail-unit">
            <span class="d-lbl">Pemesan &amp; NIK</span>
            <strong>${order.namaPemesan}</strong>
            <span class="text-muted" style="font-size: 0.74rem;">${order.nik}</span>
          </div>
          <div class="detail-unit">
            <span class="d-lbl">Tanggal perjalanan</span>
            <strong class="text-primary">${order.tanggal}</strong>
            <span class="text-muted" style="font-size: 0.74rem;">${order.qty} Tiket (${order.kelas})</span>
          </div>
          <div class="detail-unit">
            <span class="d-lbl">Total Pembayaran</span>
            <strong class="text-emerald">Rp ${order.totalBayar.toLocaleString("id-ID")}</strong>
            <span class="text-muted" style="font-size: 0.74rem;">${order.metodePembayaran}</span>
          </div>
          <div class="detail-unit">
            <span class="d-lbl">Waktu Terbit</span>
            <code>${order.createdAt}</code>
          </div>
        </div>
      </div>

      <div class="order-card-stub">
        <div class="stub-qr-wrap">
          <svg viewBox="0 0 100 100" width="85" height="85">
            <rect width="100" height="100" fill="#ffffff" rx="4" />
            <rect x="8" y="8" width="24" height="24" fill="#0b0f19" />
            <rect x="12" y="12" width="16" height="16" fill="#ffffff" />
            <rect x="16" y="16" width="8" height="8" fill="#0b0f19" />
            <rect x="68" y="8" width="24" height="24" fill="#0b0f19" />
            <rect x="72" y="12" width="16" height="16" fill="#ffffff" />
            <rect x="76" y="16" width="8" height="8" fill="#0b0f19" />
            <rect x="8" y="68" width="24" height="24" fill="#0b0f19" />
            <rect x="12" y="72" width="16" height="16" fill="#ffffff" />
            <rect x="16" y="76" width="8" height="8" fill="#0b0f19" />
            <rect x="42" y="42" width="16" height="16" fill="#2563eb" rx="2" />
            <rect x="44" y="16" width="6" height="6" fill="#0b0f19" />
            <rect x="72" y="44" width="6" height="6" fill="#0b0f19" />
            <rect x="44" y="72" width="6" height="6" fill="#0b0f19" />
          </svg>
        </div>

        <div class="stub-actions">
          <button class="btn btn-primary btn-sm btn-full btn-view-ticket" data-id="${order.orderId}">
            <i class="fa-solid fa-eye"></i> Lihat E-Ticket
          </button>
          ${
            order.status !== "REFUNDED"
              ? `
              <button class="btn btn-secondary btn-sm btn-full btn-reschedule" data-id="${order.orderId}">
                <i class="fa-solid fa-calendar-week text-amber"></i> Reschedule
              </button>
              <button class="btn btn-outline btn-sm btn-full btn-refund" data-id="${order.orderId}">
                <i class="fa-solid fa-rotate-left text-rose"></i> Ajukan Refund
              </button>
            `
              : `
              <span class="badge-tag" style="background: rgba(239,68,68,0.15); color: #f87171;">Tiket Dibatalkan</span>
            `
          }
        </div>
      </div>
    `;

    card.querySelector(".btn-view-ticket").addEventListener("click", () => {
      openTicketModal(order);
    });

    const reschedBtn = card.querySelector(".btn-reschedule");
    if (reschedBtn) {
      reschedBtn.addEventListener("click", () => openRescheduleModal(order));
    }

    const refundBtn = card.querySelector(".btn-refund");
    if (refundBtn) {
      refundBtn.addEventListener("click", () => openRefundModal(order));
    }

    container.appendChild(card);
  });
}

// Reschedule Modal Logic
const rescheduleModalOverlay = document.getElementById("rescheduleModalOverlay");
const btnRescheduleModalClose = document.getElementById("btnRescheduleModalClose");
const btnCancelReschedule = document.getElementById("btnCancelReschedule");
const btnConfirmReschedule = document.getElementById("btnConfirmReschedule");

function openRescheduleModal(order) {
  selectedOrderPointer = order;

  const ptrEl = document.getElementById("rescheduleModalPtr");
  if (ptrEl) ptrEl.textContent = order.memAddress;
  document.getElementById("rescheduleBookingCode").textContent = order.orderId;
  document.getElementById("rescheduleServiceName").textContent = order.namaLayanan;
  document.getElementById("rescheduleCurrentDate").textContent = order.tanggal;

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("newTravelDate").value = today;

  rescheduleModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeRescheduleModal() {
  rescheduleModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function confirmReschedule() {
  const newDate = document.getElementById("newTravelDate").value;
  if (!newDate) {
    showToast("Silakan pilih tanggal jadwal baru!", "warn");
    return;
  }

  const oldDate = selectedOrderPointer.tanggal;
  selectedOrderPointer.tanggal = newDate;
  selectedOrderPointer.status = "RESCHEDULED";

  appendLogEntry(
    "pointer",
    "POINTER MUTATION (RESCHEDULE)",
    `Dereferensi <code>${selectedOrderPointer.memAddress}</code>: Tanggal diubah dari "${oldDate}" &rarr; "<strong>${newDate}</strong>". Status: <code>RESCHEDULED</code>.`
  );

  closeRescheduleModal();
  renderOrders();
  renderAdmin();
  showToast(`Jadwal tiket ${selectedOrderPointer.orderId} berhasil diubah ke ${newDate}!`, "success");
}

// Refund Modal Logic
const refundModalOverlay = document.getElementById("refundModalOverlay");
const btnRefundModalClose = document.getElementById("btnRefundModalClose");
const btnCancelRefund = document.getElementById("btnCancelRefund");
const btnConfirmRefund = document.getElementById("btnConfirmRefund");

function openRefundModal(order) {
  selectedOrderPointer = order;

  document.getElementById("refundBookingCode").textContent = order.orderId;
  document.getElementById("refundAmount").textContent = `Rp ${order.totalBayar.toLocaleString("id-ID")}`;
  const quotaRet = document.getElementById("refundQuotaReturn");
  if (quotaRet) quotaRet.textContent = order.qty;

  refundModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeRefundModal() {
  refundModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function confirmRefund() {
  const order = selectedOrderPointer;
  order.status = "REFUNDED";

  const service = servicesArray.find(s => s.id === order.serviceId);
  if (service) {
    service.kuota += order.qty;
    appendLogEntry(
      "pointer",
      "KEMBALIKAN KUOTA ARRAY",
      `Objek <code>${service.memAddress}</code> (${service.nama}): Kuota dipulihkan +${order.qty} tiket. Kuota saat ini: <strong>${service.kuota}</strong>.`
    );
  }

  appendLogEntry(
    "done",
    "REFUND BERHASIL",
    `Pesanan <code>${order.memAddress}</code> (${order.orderId}) dibatalkan. Pengembalian dana Rp ${order.totalBayar.toLocaleString("id-ID")} diproses.`
  );

  closeRefundModal();
  updateOrdersBadge();
  renderCatalog();
  renderOrders();
  renderAdmin();
  showToast(`Refund tiket ${order.orderId} berhasil disetujui! Kuota telah dikembalikan.`, "success");
}

// ============================================================================
// 14. VIEW 3: DASHBOARD ADMIN
// ============================================================================
function renderAdmin() {
  const adminServicesEl = document.getElementById("adminTotalServices");
  const adminOrdersEl = document.getElementById("adminTotalOrders");
  const adminRevenueEl = document.getElementById("adminTotalRevenue");
  const adminQuotaEl = document.getElementById("adminTotalQuota");

  if (adminServicesEl) adminServicesEl.textContent = servicesArray.length;
  if (adminOrdersEl) adminOrdersEl.textContent = ordersArray.length;

  const totalRevenue = ordersArray
    .filter(o => o.status !== "REFUNDED")
    .reduce((acc, curr) => acc + curr.totalBayar, 0);

  if (adminRevenueEl) adminRevenueEl.textContent = `Rp ${totalRevenue.toLocaleString("id-ID")}`;

  const totalQuota = servicesArray.reduce((acc, curr) => acc + curr.kuota, 0);
  if (adminQuotaEl) adminQuotaEl.textContent = `${totalQuota} Tiket`;

  const tableBody = document.getElementById("adminOrdersTableBody");
  if (!tableBody) return;

  if (ordersArray.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">Belum ada riwayat transaksi pemesanan masuk.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = "";
  ordersArray.forEach(order => {
    const tr = document.createElement("tr");

    let statusBadge = `<span class="badge-tag" style="background: rgba(16,185,129,0.2); color: #34d399;">TERBIT</span>`;
    if (order.status === "RESCHEDULED") {
      statusBadge = `<span class="badge-tag" style="background: rgba(245,158,11,0.2); color: #fbbf24;">RESCHEDULED</span>`;
    } else if (order.status === "REFUNDED") {
      statusBadge = `<span class="badge-tag" style="background: rgba(239,68,68,0.2); color: #f87171;">REFUNDED</span>`;
    }

    tr.innerHTML = `
      <td><strong>${order.orderId}</strong><br><code style="font-size: 0.72rem;">${order.memAddress}</code></td>
      <td><strong>${order.namaPemesan}</strong><br><span class="text-muted" style="font-size: 0.74rem;">${order.telepon}</span></td>
      <td><strong>${order.namaLayanan}</strong><br><span class="badge-tag">${order.kategori} &bull; ${order.kelas}</span></td>
      <td>${order.tanggal}</td>
      <td class="font-bold text-emerald">Rp ${order.totalBayar.toLocaleString("id-ID")}</td>
      <td>${statusBadge}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="openTicketModalByOrderId('${order.orderId}')" title="Lihat E-Ticket">
            <i class="fa-solid fa-eye"></i>
          </button>
          ${
            order.status !== "REFUNDED"
              ? `<button class="btn btn-outline btn-sm" onclick="openRefundModalByOrderId('${order.orderId}')" title="Refund">
                  <i class="fa-solid fa-rotate-left text-rose"></i>
                 </button>`
              : ""
          }
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

window.openTicketModalByOrderId = function(id) {
  const o = ordersArray.find(item => item.orderId === id);
  if (o) openTicketModal(o);
};

window.openRefundModalByOrderId = function(id) {
  const o = ordersArray.find(item => item.orderId === id);
  if (o) openRefundModal(o);
};

function handleAdminAddService(e) {
  e.preventDefault();

  const kategori = document.getElementById("newKategori").value;
  const kelas = document.getElementById("newKelas").value.trim() || "VIP Seating";
  const nama = document.getElementById("newNama").value.trim();
  const lokasi = document.getElementById("newLokasi").value.trim();
  const jadwal = document.getElementById("newJadwal").value.trim() || "18 Des 2026 • 19:00 WIB";
  const durasi = document.getElementById("newDurasi").value.trim() || "2.5 Jam";
  const harga = parseFloat(document.getElementById("newHarga").value);
  const kuota = parseInt(document.getElementById("newKuota").value, 10);
  const rating = parseFloat(document.getElementById("newRating").value) || 4.9;
  const gambar = document.getElementById("newGambar").value.trim() || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop";

  const newId = servicesArray.length + 1;
  const newIndex = servicesArray.length;

  const newService = new ItemServiceStruct(
    newId,
    kategori,
    nama,
    lokasi,
    jadwal,
    durasi,
    kelas,
    kuota,
    harga,
    rating,
    gambar,
    "Penyelenggara Terverifikasi",
    newIndex
  );

  servicesArray.push(newService);

  appendLogEntry(
    "pointer",
    "ALOKASI MEMORI BARU",
    `Alokasi instance <code>ItemServiceStruct</code> baru pada <code>servicesArray[${newIndex}]</code>. Alamat: <code>${newService.memAddress}</code>. Nama: "${nama}".`
  );

  renderCatalog();
  renderAdmin();

  document.getElementById("adminAddServiceForm").reset();
  showToast(`Layanan "${nama}" berhasil ditambahkan ke katalog!`, "success");
}

// ============================================================================
// 15. USER ACCOUNTS DATA & AUTH MODAL
// ============================================================================
const RAW_INITIAL_USERS = [
  { id: 1, fullName: "Muhammad Hanif", email: "hanif@mhs.unesa.ac.id", password: "unesa123", role: "Member VIP" },
  { id: 2, fullName: "Budi Santoso", email: "budi@nusantarago.com", password: "budi123", role: "Event Enthusiast" }
];

function initializeUsers() {
  usersArray = RAW_INITIAL_USERS.map((u, idx) => {
    return new UserAccountStruct(u.id, u.fullName, u.email, u.password, u.role, idx);
  });
}

function openAuthModal(mode = "login") {
  const overlay = document.getElementById("authModalOverlay");
  if (!overlay) return;
  overlay.classList.add("active");
  switchAuthTab(mode);
}

function closeAuthModal() {
  const overlay = document.getElementById("authModalOverlay");
  if (overlay) overlay.classList.remove("active");
}

function switchAuthTab(tab) {
  const authTabLogin = document.getElementById("authTabLogin");
  const authTabRegister = document.getElementById("authTabRegister");
  const authLoginForm = document.getElementById("authLoginForm");
  const authRegisterForm = document.getElementById("authRegisterForm");
  const authModalTitle = document.getElementById("authModalTitle");
  const dict = I18N_DICTIONARY[currentLanguage];

  if (tab === "login") {
    if (authTabLogin) authTabLogin.classList.add("active");
    if (authTabRegister) authTabRegister.classList.remove("active");
    if (authLoginForm) authLoginForm.style.display = "block";
    if (authRegisterForm) authRegisterForm.style.display = "none";
    if (authModalTitle) authModalTitle.textContent = dict ? dict.auth_login_title : "Masuk ke Akun Anda";
  } else {
    if (authTabRegister) authTabRegister.classList.add("active");
    if (authTabLogin) authTabLogin.classList.remove("active");
    if (authRegisterForm) authRegisterForm.style.display = "block";
    if (authLoginForm) authLoginForm.style.display = "none";
    if (authModalTitle) authModalTitle.textContent = dict ? dict.auth_register_title : "Daftar Akun Baru";
  }
}

function loginUser(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();
  let found = null;
  let matchIndex = -1;

  for (let i = 0; i < usersArray.length; i++) {
    if (usersArray[i].email.toLowerCase() === cleanEmail && usersArray[i].password === password) {
      found = usersArray[i];
      matchIndex = i;
      break;
    }
  }

  if (found) {
    currentUser = found;
    updateAuthUI();

    appendLogEntry(
      "pointer",
      "LOGIN LINEAR SEARCH",
      `Linear Search pada <code>usersArray</code> [Index ${matchIndex}] menemukan akun <strong>${found.fullName}</strong>. Pointer: <code>${found.memAddress}</code>.`
    );

    showToast(
      currentLanguage === "ID"
        ? `Login berhasil! Selamat datang kembali, ${found.fullName}!`
        : `Login successful! Welcome back, ${found.fullName}!`,
      "success"
    );
    closeAuthModal();
    return true;
  } else {
    showToast(
      currentLanguage === "ID"
        ? "Email atau kata sandi tidak cocok! Silakan coba lagi."
        : "Invalid email or password! Please try again.",
      "warn"
    );
    return false;
  }
}

function registerUser(fullName, email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanName = (fullName || "").trim();

  if (!cleanName || !cleanEmail || !password) {
    showToast(
      currentLanguage === "ID"
        ? "Harap lengkapi semua bidang pendaftaran!"
        : "Please complete all registration fields!",
      "warn"
    );
    return false;
  }

  for (let i = 0; i < usersArray.length; i++) {
    if (usersArray[i].email.toLowerCase() === cleanEmail) {
      showToast(
        currentLanguage === "ID"
          ? "Alamat email ini sudah terdaftar! Silakan login."
          : "This email address is already registered! Please login.",
        "warn"
      );
      switchAuthTab("login");
      const loginEmailInput = document.getElementById("loginEmail");
      if (loginEmailInput) loginEmailInput.value = cleanEmail;
      return false;
    }
  }

  const newId = usersArray.length + 1;
  const newUser = new UserAccountStruct(newId, cleanName, cleanEmail, password, "Member", usersArray.length);
  usersArray.push(newUser);

  currentUser = newUser;
  updateAuthUI();

  appendLogEntry(
    "pointer",
    "NEW USER REGISTERED",
    `Akun dialokasikan pada <code>usersArray[${usersArray.length - 1}]</code>. Pointer: <code>${newUser.memAddress}</code> (${newUser.fullName}).`
  );

  showToast(
    currentLanguage === "ID"
      ? `Pendaftaran berhasil! Selamat datang di NusantaraGo, ${newUser.fullName}!`
      : `Registration successful! Welcome to NusantaraGo, ${newUser.fullName}!`,
    "success"
  );
  closeAuthModal();
  return true;
}

function logoutUser() {
  const userName = currentUser ? currentUser.fullName : "User";
  currentUser = null;
  updateAuthUI();

  appendLogEntry("pointer", "AUTH LOGOUT", `Sesi user ("${userName}") diakhiri. Pointer diset ke NULL.`);
  showToast(currentLanguage === "ID" ? "Anda telah keluar dari akun." : "You have signed out.", "info");
}

function updateAuthUI() {
  const navAuthContainer = document.getElementById("navAuthContainer");
  const userProfilePill = document.getElementById("userProfilePill");
  const userDisplayName = document.getElementById("userDisplayName");
  const custFullName = document.getElementById("custFullName");
  const custEmail = document.getElementById("custEmail");

  if (currentUser) {
    if (navAuthContainer) navAuthContainer.style.display = "none";
    if (userProfilePill) userProfilePill.style.display = "flex";
    if (userDisplayName) userDisplayName.textContent = currentUser.fullName;

    if (custFullName && !custFullName.value) custFullName.value = currentUser.fullName;
    if (custEmail && !custEmail.value) custEmail.value = currentUser.email;
  } else {
    if (navAuthContainer) navAuthContainer.style.display = "flex";
    if (userProfilePill) userProfilePill.style.display = "none";
  }
}

// ============================================================================
// 16. VIEW CONTROLLER (TAB NAVIGATION)
// ============================================================================
function switchView(viewName) {
  activeView = viewName;

  document.querySelectorAll(".nav-tab-btn, .nav-orders-btn").forEach(btn => {
    if (btn.dataset.view) {
      if (viewName === "catalog") {
        btn.classList.toggle("active", btn.dataset.view === "catalog" && (btn.dataset.cat === activeFilterCategory || (!btn.dataset.cat && activeFilterCategory === "ALL")));
      } else {
        btn.classList.toggle("active", btn.dataset.view === viewName);
      }
    }
  });

  const views = {
    catalog: document.getElementById("viewCatalog"),
    orders: document.getElementById("viewOrders"),
    admin: document.getElementById("viewAdmin")
  };

  Object.keys(views).forEach(k => {
    if (views[k]) {
      views[k].classList.toggle("active", k === viewName);
    }
  });

  if (viewName === "orders") {
    renderOrders();
  } else if (viewName === "admin") {
    renderAdmin();
  } else if (viewName === "catalog") {
    renderCatalog();
  }

  if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// ============================================================================
// 17. TOAST NOTIFICATION SYSTEM
// ============================================================================
const toastContainer = document.getElementById("toastContainer");

function showToast(message, type = "info") {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check text-emerald";
  if (type === "warn") icon = "fa-triangle-exclamation text-amber";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <div>${message}</div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================================================
// 18. DOM INITIALIZATION & EVENT LISTENERS
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initializeArray();
  initializeUsers();
  renderCatalog();
  renderPromoCards();
  renderSearchHistory();
  updateOrdersBadge();
  updateAuthUI();

  // Set Bahasa Default (ID)
  setLanguage(currentLanguage);

  // Mode akademik tersembunyi: Ctrl + Shift + L
  const academicElements = [
    document.getElementById("algorithmPanel"),
    document.getElementById("btnShowAlgorithmLog"),
    document.getElementById("btnToggleDsLog")
  ].filter(Boolean);

  const setAcademicMode = (enabled, announce = true) => {
    document.body.classList.toggle("academic-mode", enabled);
    academicElements.forEach(element => element.setAttribute("aria-hidden", String(!enabled)));
    if (!enabled) {
      document.getElementById("dsLogDrawerOverlay")?.classList.remove("active");
      document.getElementById("dsLogDrawer")?.classList.remove("open");
    }
    if (announce) {
      showToast(
        enabled
          ? "Mode akademik aktif: log algoritma dan inspector ditampilkan."
          : "Mode akademik nonaktif: kembali ke tampilan pengguna.",
        "info"
      );
    }
  };

  setAcademicMode(false, false);
  document.addEventListener("keydown", event => {
    if (event.repeat) return;
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setAcademicMode(!document.body.classList.contains("academic-mode"));
    }
  });

  const travelDate = document.getElementById("filterDate");
  travelDate.min = localDate();
  travelDate.value = localDate();
  document.querySelectorAll('[role="button"][tabindex="0"]').forEach(el => {
    el.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        el.click();
      }
    });
  });

  if (servicesArray.length > 0) {
    setPointerReference(servicesArray[0], 0);
  }

  // Brand Logo Click -> Go to Catalog / Home
  const brandLogo = document.getElementById("brandLogo");
  if (brandLogo) {
    brandLogo.addEventListener("click", () => {
      if (isAlgorithmRunning) return;
      searchResultIds = null;
      activeFilterCategory = "ALL";
      document.querySelectorAll(".cat-pill-btn, .category-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.category === "ALL");
      });
      updateCategoryIndicatorText();
      switchView("catalog");
    });
  }

  // Navigation Links
  document.querySelectorAll(".nav-tab-btn, .nav-orders-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      const cat = btn.dataset.cat;
      if (cat) {
        searchResultIds = null;
        activeFilterCategory = cat;
        document.querySelectorAll(".cat-pill-btn, .category-btn").forEach(b => {
          b.classList.toggle("active", b.dataset.category === cat);
        });
        updateCategoryIndicatorText();
        renderCatalog();
      }
      if (view) switchView(view);
    });
  });

  // Sticky Navbar Scroll Effect
  const appHeader = document.querySelector(".app-header");
  if (appHeader) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        appHeader.classList.add("scrolled");
      } else {
        appHeader.classList.remove("scrolled");
      }
    });
  }

  // Quick Search Bar in Navbar
  const navQuickSearch = document.getElementById("navQuickSearch");
  if (navQuickSearch) {
    navQuickSearch.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const val = navQuickSearch.value.trim();
        if (val) {
          if (isAlgorithmRunning) {
            showToast("Algoritma sedang berjalan. Harap tunggu!", "warn");
            return;
          }
          const searchInput = document.getElementById("searchInput");
          if (searchInput) searchInput.value = val;
          const filterDest = document.getElementById("filterDestination");
          if (filterDest) filterDest.value = val;
          await runLinearSearch(val);
        }
      }
    });
  }

  // Floating Category Pills in Hero
  document.querySelectorAll(".cat-pill-btn, .category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (isAlgorithmRunning) {
        showToast("Mohon tunggu hingga animasi algoritma selesai!", "warn");
        return;
      }
      const cat = btn.dataset.category;
      searchResultIds = null;
      activeFilterCategory = cat;

      document.querySelectorAll(".cat-pill-btn, .category-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.category === cat);
      });

      updateCategoryIndicatorText();

      renderCatalog();
    });
  });

  // Hero Search Button (Cari Tiket)
  const handleMainSearch = async () => {
    if (isAlgorithmRunning) {
      showToast("Algoritma sedang berjalan. Harap tunggu!", "warn");
      return;
    }
    const dest = document.getElementById("filterDestination") ? document.getElementById("filterDestination").value.trim() : "";
    const origin = document.getElementById("filterOrigin") ? document.getElementById("filterOrigin").value.trim() : "";
    const date = document.getElementById("filterDate");
    if (!date.value || !date.reportValidity()) return;
    const query = [origin, dest].filter(Boolean).join(" → ");
    const isRoute = ["PESAWAT", "KERETA", "BUS"].includes(activeFilterCategory);
    const predicate = item => {
      const [from, to = ""] = item.lokasi.toLowerCase().split("→");
      const haystack = `${item.nama} ${item.lokasi} ${item.penyelenggara}`.toLowerCase();
      return isRoute
        ? from.includes(origin.toLowerCase()) && to.includes(dest.toLowerCase())
        : item.lokasi.toLowerCase().includes(origin.toLowerCase()) && haystack.includes(dest.toLowerCase());
    };

    if (query) {
      const searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = query;
      await runLinearSearch(query, predicate);
    } else {
      searchResultIds = null;
      renderCatalog();
    }
    document.querySelector(".catalog-main-container").scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const btnTiketSearch = document.getElementById("btnTiketSearch");
  if (btnTiketSearch) {
    btnTiketSearch.addEventListener("click", handleMainSearch);
  }
  ["filterOrigin", "filterDestination"].forEach(id => {
    document.getElementById(id).addEventListener("keydown", e => {
      if (e.key === "Enter") handleMainSearch();
    });
  });

  // Swap Locations / Reset Button in Search Box
  const btnSwapLocations = document.getElementById("btnSwapLocations");
  if (btnSwapLocations) {
    btnSwapLocations.addEventListener("click", () => {
      const originInput = document.getElementById("filterOrigin");
      const destInput = document.getElementById("filterDestination");
      if (originInput && destInput) {
        const temp = originInput.value;
        originInput.value = destInput.value;
        destInput.value = temp;
      }
    });
  }

  // Promo Strip Click -> Scroll to Promo Section
  const searchPromoStrip = document.getElementById("searchPromoStrip");
  if (searchPromoStrip) {
    searchPromoStrip.addEventListener("click", () => {
      const promoSec = document.getElementById("promoSection");
      if (promoSec) {
        promoSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Language Dropdown
  const langSwitchDropdown = document.getElementById("langSwitchDropdown");
  const btnLangToggle = document.getElementById("btnLangToggle");
  const langOptId = document.getElementById("langOptId");
  const langOptEn = document.getElementById("langOptEn");

  if (btnLangToggle && langSwitchDropdown) {
    btnLangToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      langSwitchDropdown.classList.toggle("open");
    });

    if (langOptId) {
      langOptId.addEventListener("click", (e) => {
        e.stopPropagation();
        setLanguage("ID");
        langSwitchDropdown.classList.remove("open");
        showToast("Bahasa diubah ke Bahasa Indonesia (ID).", "info");
      });
    }

    if (langOptEn) {
      langOptEn.addEventListener("click", (e) => {
        e.stopPropagation();
        setLanguage("EN");
        langSwitchDropdown.classList.remove("open");
        showToast("Language changed to English (EN).", "info");
      });
    }

    document.addEventListener("click", (e) => {
      if (!langSwitchDropdown.contains(e.target)) {
        langSwitchDropdown.classList.remove("open");
      }
    });
  }

  // Auth Modal Buttons
  const authModalOverlay = document.getElementById("authModalOverlay");
  const btnOpenLogin = document.getElementById("btnOpenLogin");
  const btnOpenRegister = document.getElementById("btnOpenRegister");
  const btnAuthModalClose = document.getElementById("btnAuthModalClose");
  const authTabLogin = document.getElementById("authTabLogin");
  const authTabRegister = document.getElementById("authTabRegister");
  const authLoginForm = document.getElementById("authLoginForm");
  const authRegisterForm = document.getElementById("authRegisterForm");
  const btnLogoutMini = document.getElementById("btnLogoutMini");

  if (btnOpenLogin) btnOpenLogin.addEventListener("click", () => openAuthModal("login"));
  if (btnOpenRegister) btnOpenRegister.addEventListener("click", () => openAuthModal("register"));
  if (btnAuthModalClose) btnAuthModalClose.addEventListener("click", closeAuthModal);
  if (authTabLogin) authTabLogin.addEventListener("click", () => switchAuthTab("login"));
  if (authTabRegister) authTabRegister.addEventListener("click", () => switchAuthTab("register"));

  if (authModalOverlay) {
    authModalOverlay.addEventListener("click", (e) => {
      if (e.target === authModalOverlay) closeAuthModal();
    });
  }

  const btnSubmitLogin = document.getElementById("btnSubmitLogin");
  if (btnSubmitLogin) {
    btnSubmitLogin.addEventListener("click", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const pwd = document.getElementById("loginPassword").value;
      loginUser(email, pwd);
    });
  }

  const btnSubmitRegister = document.getElementById("btnSubmitRegister");
  if (btnSubmitRegister) {
    btnSubmitRegister.addEventListener("click", (e) => {
      e.preventDefault();
      const name = document.getElementById("regFullName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const pwd = document.getElementById("regPassword").value;
      registerUser(name, email, pwd);
    });
  }

  if (btnLogoutMini) {
    btnLogoutMini.addEventListener("click", logoutUser);
  }

  // Popular Destination Cards
  document.querySelectorAll(".destination-card").forEach(card => {
    card.addEventListener("click", () => {
      if (isAlgorithmRunning) return;
      window.switchCategoryFilter("ALL");
      const dest = card.dataset.destination;
      const searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = dest;
      const filterDest = document.getElementById("filterDestination");
      if (filterDest) filterDest.value = dest;
      runLinearSearch(dest);
    });
  });

  // Catalog Section Search & Sort Controls
  const searchInput = document.getElementById("searchInput");
  const btnResetSearch = document.getElementById("btnResetSearch");
  const sortCriterion = document.getElementById("sortCriterion");
  const demoMethod = document.getElementById("demoSortAlgorithm");
  const demoCriterion = document.getElementById("demoSortCriterion");
  const demoQuery = document.getElementById("demoSearchQuery");
  const demoSpeed = document.getElementById("demoAlgoSpeed");
  const drawerMethod = document.getElementById("sortAlgorithm");

  document.getElementById("btnShowAlgorithmLog").addEventListener("click", () => {
    if (activeView !== "catalog") switchView("catalog");
    showAlgorithmPanel();
  });
  document.getElementById("btnClearInlineLog").addEventListener("click", clearLogTerminal);
  demoMethod.addEventListener("change", () => drawerMethod.value = demoMethod.value);
  drawerMethod.addEventListener("change", () => demoMethod.value = drawerMethod.value);
  document.getElementById("btnDemoSort").addEventListener("click", async () => {
    if (isAlgorithmRunning) return;
    sortCriterion.value = demoCriterion.value;
    const sort = demoMethod.value === "SELECTION" ? runSelectionSort : runBubbleSort;
    await sort(demoCriterion.value, Number(demoSpeed.value));
  });
  const demoSearch = async () => {
    if (isAlgorithmRunning) return;
    searchInput.value = demoQuery.value;
    await runLinearSearch(demoQuery.value, null, Number(demoSpeed.value));
  };
  document.getElementById("btnDemoSearch").addEventListener("click", demoSearch);
  demoQuery.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); demoSearch(); }
  });

  if (searchInput) {
    searchInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        if (isAlgorithmRunning) return;
        await runLinearSearch(searchInput.value);
      }
    });
  }

  if (btnResetSearch) {
    btnResetSearch.addEventListener("click", () => {
      searchResultIds = null;
      if (searchInput) searchInput.value = "";
      const filterDest = document.getElementById("filterDestination");
      if (filterDest) filterDest.value = "";
      clearCardHighlights();
      renderCatalog();
    });
  }

  if (sortCriterion) {
    sortCriterion.addEventListener("change", async () => {
      if (isAlgorithmRunning) {
        showToast("Mohon tunggu proses selesai!", "warn");
        return;
      }
      const criterion = sortCriterion.value;
      demoCriterion.value = criterion;
      const sort = demoMethod.value === "SELECTION" ? runSelectionSort : runBubbleSort;
      await sort(criterion);
    });
  }

  // =========================================================================
  // FLOATING SYSTEM ACTIVITY LOG DRAWER
  // =========================================================================
  const btnToggleDsLog = document.getElementById("btnToggleDsLog");
  const dsLogDrawerOverlay = document.getElementById("dsLogDrawerOverlay");
  const dsLogDrawer = document.getElementById("dsLogDrawer");
  const btnCloseDsDrawer = document.getElementById("btnCloseDsDrawer");
  const footerOpenDsLog = document.getElementById("footerOpenDsLog");

  const openDsDrawer = () => {
    if (dsLogDrawerOverlay && dsLogDrawer) {
      dsLogDrawerOverlay.classList.add("active");
      dsLogDrawer.classList.add("open");
    }
  };

  const closeDsDrawer = () => {
    if (dsLogDrawerOverlay && dsLogDrawer) {
      dsLogDrawerOverlay.classList.remove("active");
      dsLogDrawer.classList.remove("open");
    }
  };

  if (btnToggleDsLog) btnToggleDsLog.addEventListener("click", openDsDrawer);
  if (btnCloseDsDrawer) btnCloseDsDrawer.addEventListener("click", closeDsDrawer);
  if (footerOpenDsLog) {
    footerOpenDsLog.addEventListener("click", (e) => {
      e.preventDefault();
      openDsDrawer();
    });
  }

  if (dsLogDrawerOverlay) {
    dsLogDrawerOverlay.addEventListener("click", (e) => {
      if (e.target === dsLogDrawerOverlay) closeDsDrawer();
    });
  }

  // Algorithm Control Buttons inside Drawer
  const btnRunSort = document.getElementById("btnRunSort");
  if (btnRunSort) {
    btnRunSort.addEventListener("click", async () => {
      if (isAlgorithmRunning) {
        showToast("Algoritma sedang berjalan. Harap tunggu!", "warn");
        return;
      }
      const algo = document.getElementById("sortAlgorithm").value;
      const criterion = sortCriterion ? sortCriterion.value : "PRICE_ASC";

      if (algo === "BUBBLE") {
        await runBubbleSort(criterion);
      } else {
        await runSelectionSort(criterion);
      }
    });
  }

  const btnDrawerSearch = document.getElementById("btnDrawerSearch");
  const drawerSearchInput = document.getElementById("drawerSearchInput");
  if (btnDrawerSearch && drawerSearchInput) {
    btnDrawerSearch.addEventListener("click", async () => {
      if (isAlgorithmRunning) return;
      await runLinearSearch(drawerSearchInput.value);
    });
    drawerSearchInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        if (isAlgorithmRunning) return;
        await runLinearSearch(drawerSearchInput.value);
      }
    });
  }

  const btnResetData = document.getElementById("btnResetData");
  if (btnResetData) {
    btnResetData.addEventListener("click", () => {
      if (isAlgorithmRunning) {
        showToast("Tunggu hingga operasi selesai!", "warn");
        return;
      }
      initializeArray();
      searchResultIds = null;
      activeFilterCategory = "ALL";
      document.querySelectorAll(".cat-pill-btn, .category-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.category === "ALL");
      });
      updateCategoryIndicatorText();
      renderCatalog();
      if (servicesArray.length > 0) {
        setPointerReference(servicesArray[0], 0);
      }
      clearLogTerminal();
      appendLogEntry("pointer", "DATA RESET", "Array telah di-reset ke urutan data awal dengan re-alokasi pointer memori.");
      showToast("Data array berhasil di-reset!", "info");
    });
  }

  const btnClearLog = document.getElementById("btnClearLog");
  if (btnClearLog) {
    btnClearLog.addEventListener("click", clearLogTerminal);
  }

  // Clear History Button
  const btnClearHistory = document.getElementById("btnClearHistory");
  if (btnClearHistory) {
    btnClearHistory.addEventListener("click", () => {
      searchHistoryArray = [];
      renderSearchHistory();
      showToast("Riwayat pencarian array dibersihkan.", "info");
    });
  }

  // Checkout Wizard Step Controls
  if (btnWizardNext) {
    btnWizardNext.addEventListener("click", () => {
      if (currentCheckoutStep === 1) {
        const fields = document.querySelectorAll("#checkoutStep1 input");
        for (const field of fields) {
          if (!field.reportValidity()) return;
        }
        const name = document.getElementById("custFullName").value.trim();
        const email = document.getElementById("custEmail").value.trim();
        const date = document.getElementById("custDate").value;
        if (!name || !email || !date) {
          showToast("Harap lengkapi nama pemesan, email, dan tanggal!", "warn");
          return;
        }
      }
      if (currentCheckoutStep < 4) {
        currentCheckoutStep++;
        updateWizardStepsUI();
      }
    });
  }

  if (btnWizardPrev) {
    btnWizardPrev.addEventListener("click", () => {
      if (currentCheckoutStep > 1) {
        currentCheckoutStep--;
        updateWizardStepsUI();
      }
    });
  }

  if (btnApplyPromo) {
    btnApplyPromo.addEventListener("click", () => {
      const code = document.getElementById("inputPromoCode").value;
      validateAndApplyPromo(code);
    });
  }

  if (btnConfirmPayment) {
    btnConfirmPayment.addEventListener("click", processPaymentAndIssueTicket);
  }

  if (btnCheckoutModalClose) btnCheckoutModalClose.addEventListener("click", closeCheckoutModal);
  if (btnCancelCheckout) btnCancelCheckout.addEventListener("click", closeCheckoutModal);

  checkoutModalOverlay.addEventListener("click", (e) => {
    if (e.target === checkoutModalOverlay) closeCheckoutModal();
  });

  // Ticket Modal Controls
  if (btnTicketModalClose) btnTicketModalClose.addEventListener("click", closeTicketModal);
  if (btnCloseTicketModal) btnCloseTicketModal.addEventListener("click", closeTicketModal);
  ticketModalOverlay.addEventListener("click", (e) => {
    if (e.target === ticketModalOverlay) closeTicketModal();
  });

  if (btnPrintTicket) {
    btnPrintTicket.addEventListener("click", () => {
      window.print();
    });
  }

  // Reschedule Modal Controls
  if (btnRescheduleModalClose) btnRescheduleModalClose.addEventListener("click", closeRescheduleModal);
  if (btnCancelReschedule) btnCancelReschedule.addEventListener("click", closeRescheduleModal);
  if (btnConfirmReschedule) btnConfirmReschedule.addEventListener("click", confirmReschedule);
  rescheduleModalOverlay.addEventListener("click", (e) => {
    if (e.target === rescheduleModalOverlay) closeRescheduleModal();
  });

  // Refund Modal Controls
  if (btnRefundModalClose) btnRefundModalClose.addEventListener("click", closeRefundModal);
  if (btnCancelRefund) btnCancelRefund.addEventListener("click", closeRefundModal);
  if (btnConfirmRefund) btnConfirmRefund.addEventListener("click", confirmRefund);
  refundModalOverlay.addEventListener("click", (e) => {
    if (e.target === refundModalOverlay) closeRefundModal();
  });

  // Orders Filter Buttons
  document.querySelectorAll(".order-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".order-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeOrderFilter = btn.dataset.filter;
      renderOrders();
    });
  });

  const orderSearchInput = document.getElementById("orderSearchInput");
  if (orderSearchInput) {
    orderSearchInput.addEventListener("input", (e) => {
      orderSearchQuery = e.target.value;
      renderOrders();
    });
  }

  // Admin Dashboard Form
  const adminForm = document.getElementById("adminAddServiceForm");
  if (adminForm) {
    adminForm.addEventListener("submit", handleAdminAddService);
  }

  const btnAdminRefresh = document.getElementById("btnAdminRefresh");
  if (btnAdminRefresh) {
    btnAdminRefresh.addEventListener("click", () => {
      renderAdmin();
      showToast("Data dashboard admin disegarkan.", "info");
    });
  }
});
