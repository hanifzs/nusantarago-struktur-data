# NusantaraGo — Pemesanan Perjalanan & Penginapan

Proyek UTS Struktur Data, Universitas Negeri Surabaya (UNESA).
Dibangun dengan HTML, CSS, dan JavaScript tanpa framework atau backend.

**Website:** https://tugas-struktur-data-rose.vercel.app

## Tentang aplikasi

Simulasi aplikasi travel dengan pola navigasi dan pencarian terinspirasi tiket.com, menggunakan identitas NusantaraGo. Katalog berisi **18 layanan dalam 5 kategori**:

- **Pesawat:** Garuda Indonesia, Citilink, Batik Air, AirAsia.
- **Hotel:** The Mulia Bali, Padma Bandung, Tugu Lombok, Plataran Borobudur.
- **Kereta Api:** Argo Bromo Anggrek, Argo Wilis, Taksaka.
- **Bus & Travel:** Sinar Jaya dan Cititrans.
- **Wisata:** TMII, Prambanan, Tegallalang.

Harga, jadwal, kuota, pembayaran, dan e-ticket merupakan data simulasi. Data disimpan di memori browser dan kembali ke kondisi awal saat halaman dimuat ulang. Pemesanan transportasi untuk sekali jalan; hotel untuk satu malam. Foto, font, dan ikon eksternal membutuhkan internet.

Foto destinasi Surabaya: [Central Surabaya view taken from JW Marriott Surabaya — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Central_Surabaya_view_taken_from_JW_Marriott_Surabaya.jpg), dengan kredit dan lisensi pada halaman sumber. Foto lainnya menggunakan Unsplash.

## Fitur

- Tampilan putih–biru yang responsif, kategori layanan, promo, dan destinasi populer.
- Pencarian asal–tujuan untuk transportasi serta kota–nama layanan untuk hotel dan wisata. Hasil difilter sesuai kategori dan arah rute.
- Tanggal dan jumlah pesanan diteruskan ke checkout; kelas mengikuti layanan yang dipilih.
- Checkout empat langkah: data pemesan, voucher, pembayaran simulasi, dan konfirmasi.
- Voucher `NUSANTARA50`, `LIBURAN100`, dan `JALANHEMAT`, berlaku untuk semua layanan dengan minimum transaksi masing-masing.
- E-ticket, cetak tiket, riwayat pesanan, reschedule, refund, login, dan penambahan layanan.
- Panel **Proses sorting & searching** tampil langsung di katalog: kontrol demo, log langkah bernomor, statistik, data sebelum proses, dan hasil proses.
- Tombol **Log Algoritma** di header langsung menuju panel tersebut. Tombol **Struktur Data** membuka inspector referensi objek dan log yang sama.

Panel akademik disembunyikan pada tampilan normal agar aplikasi tetap terlihat seperti website travel. Tekan **`Ctrl + Shift + L`** untuk menampilkan atau menyembunyikan panel log, tombol Log Algoritma, dan inspector Struktur Data.

## Penerapan struktur data

| Konsep | Implementasi |
| --- | --- |
| Struct | `ItemServiceStruct`, `OrderTransactionStruct`, dan `UserAccountStruct` mengelompokkan atribut layanan, pesanan, dan akun. |
| Array of struct | `servicesArray`, `ordersArray`, `usersArray`, `promoCodesArray`, dan `searchHistoryArray`. |
| Referensi objek | `selectedItemPointer` dan `selectedOrderPointer` menunjuk objek aktif; `swapByPointer()` menukar referensi elemen. |
| Bubble Sort | Pengurutan manual dengan perbandingan elemen bersebelahan, O(n²). |
| Selection Sort | Pemilihan kandidat terbaik untuk tiap indeks, O(n²). |
| Linear Search | Pencarian berurutan untuk layanan, kode promo, dan akun, O(n). |

Alamat heksadesimal pada inspector adalah **simulasi**, bukan alamat memori fisik JavaScript. Kuota berkurang melalui referensi layanan saat pemesanan; refund mengembalikan kuota. Reschedule mengubah tanggal pada objek pesanan.

Operasi katalog berjalan instan dan lognya tetap ditampilkan. Panel demo menyediakan kecepatan instan, 120 ms, atau 300 ms per langkah. Kontrol algoritma dikunci selama proses agar dua operasi tidak berjalan bersamaan. Setiap proses baru membersihkan log sebelumnya. Pengurutan mendukung harga, rating, kuota, dan rekomendasi, tanpa `Array.prototype.sort()`.

## Menjalankan

Buka `index.html` di browser, atau jalankan server lokal:

```sh
python -m http.server 5173
```

Lalu buka `http://localhost:5173`.
Akun demo: `hanif@mhs.unesa.ac.id` / `unesa123`.

## Struktur berkas

```text
index.html   Halaman utama, checkout, tiket, admin, dan panel struktur data
style.css    Komponen dasar, modal, panel algoritma, dan gaya cetak
travel.css   Tema travel putih–biru dan layout responsif
script.js    Data, algoritma, pencarian, pemesanan, bahasa, dan interaksi DOM
README.md    Dokumentasi proyek
```

## Alur presentasi

1. Pilih Pesawat, cari Jakarta → Bali, lalu tukar rute untuk menunjukkan hasil yang berbeda.
2. Coba kategori Hotel dan cari Bali. Uji hasil kosong serta tombol reset pencarian.
3. Klik **Log Algoritma** di header. Pilih Bubble Sort, harga terendah, lalu **Urutkan**. Buka **Data sebelum proses** dan **Hasil proses**. Ulangi dengan Selection Sort; setiap perbandingan dan pergantian kandidat tercatat.
4. Pilih animasi 120 ms, jalankan Linear Search dengan kata `Garuda` atau `Bali`, dan tunjukkan log setiap indeks, hasil cocok/tidak cocok, serta jumlah kecocokan. Coba kata yang tidak ada untuk menunjukkan hasil kosong.
5. Pesan layanan, gunakan voucher, dan selesaikan pembayaran simulasi. Tunjukkan e-ticket serta pengurangan kuota.
6. Buka **Tiket Saya**, ubah tanggal, kemudian lakukan refund untuk menunjukkan mutasi objek dan pengembalian kuota.
