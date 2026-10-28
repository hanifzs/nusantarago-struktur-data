# Naskah Presentasi NusantaraGo

Estimasi durasi: **5–7 menit**. Teks berikut dibaca sambil menampilkan slide yang sesuai.

## Slide 1 — Pembukaan

> Assalamualaikum warahmatullahi wabarakatuh. Perkenalkan, saya Muhammad Hanif dengan NIM [sebutkan NIM]. Pada proyek UTS Struktur Data ini saya membuat website ticketing perjalanan bernama NusantaraGo. Konsep yang diterapkan adalah struct, array, pointer atau referensi objek, sorting, searching, dan log algoritma.

## Slide 2 — Gambaran website

> NusantaraGo merupakan simulasi aplikasi pemesanan pesawat, hotel, kereta api, bus dan travel, serta wisata. Pengguna dapat mencari perjalanan, memilih tanggal dan jumlah pesanan, menggunakan voucher, melakukan pembayaran simulasi, serta mendapatkan e-ticket. Bagian antarmuka berada di index.html, tampilannya diatur oleh style.css dan travel.css, sedangkan data dan algoritma berada di script.js.

## Slide 3 — Struct dan Array

> JavaScript tidak memiliki keyword struct seperti C atau C++, sehingga saya menggunakan class ItemServiceStruct. Setiap objek menyimpan ID, kategori, nama, lokasi, kuota, harga, dan rating. Data awal kemudian diubah menjadi objek ItemServiceStruct melalui fungsi initializeArray dan disimpan di servicesArray. Karena setiap elemen array merupakan objek terstruktur, bagian ini menjadi implementasi array of struct.

## Slide 4 — Pointer

> JavaScript juga tidak memiliki pointer eksplisit. Oleh karena itu, pointer saya representasikan menggunakan referensi objek. selectedItemPointer menunjuk layanan yang sedang aktif. Fungsi swapByPointer menukar dua referensi di dalam array dan digunakan pada proses sorting. Alamat heksadesimal yang terdapat di aplikasi hanya simulasi untuk membantu visualisasi pointer, bukan alamat memori fisik JavaScript.

## Slide 5 — Bubble Sort

> Metode sorting pertama adalah Bubble Sort. Perulangan luar menentukan jumlah pass, sedangkan perulangan dalam membandingkan elemen pada indeks j dan j tambah satu. Fungsi shouldSwap menentukan apakah urutannya sudah benar. Jika salah, kedua referensi ditukar menggunakan swapByPointer. Apabila satu pass tidak menghasilkan pertukaran, proses berhenti lebih awal. Kompleksitas waktunya adalah O n kuadrat.

## Slide 6 — Selection Sort

> Metode kedua adalah Selection Sort. targetIdx menyimpan indeks kandidat terbaik. Setiap elemen pada bagian array yang belum terurut dibandingkan dengan kandidat. Setelah kandidat terbaik ditemukan, referensinya ditukar ke posisi yang sesuai. Selection Sort juga memiliki kompleksitas O n kuadrat. Untuk 18 data, jumlah perbandingannya adalah 18 dikali 17 dibagi 2, yaitu 153 perbandingan.

## Slide 7 — Linear Search

> Untuk searching saya menggunakan Linear Search. Algoritma memeriksa data secara berurutan dari indeks pertama sampai terakhir. Kata kunci dicocokkan dengan nama, lokasi, kategori, penyelenggara, dan kelas layanan. Data yang cocok dimasukkan ke matchesFound, kemudian ID-nya digunakan untuk memfilter katalog. Kompleksitas Linear Search adalah O n.

## Slide 8 — Log algoritma

> Setiap proses sorting dan searching dicatat menggunakan appendLogEntry. Log menampilkan perbandingan, pertukaran, hasil cocok atau tidak cocok, perubahan pointer, dan status selesai. Statistik juga menampilkan jumlah perbandingan, pertukaran, dan iterasi. Agar website tetap terlihat seperti aplikasi travel biasa, panel akademik disembunyikan pada tampilan normal dan dapat dibuka dengan menekan Control, Shift, dan L.

## Slide 9 — Demonstrasi dan penutup

> Selanjutnya saya mendemonstrasikan pencarian perjalanan, Bubble Sort, Selection Sort, dan Linear Search pada website. Saya membuka mode akademik dengan Control, Shift, dan L untuk menunjukkan log setiap langkah. Kesimpulannya, proyek ini telah menerapkan class sebagai struct, array of struct, referensi objek sebagai analogi pointer, Bubble Sort, Selection Sort, Linear Search, dan log eksekusi. Terima kasih. Wassalamualaikum warahmatullahi wabarakatuh.

## Urutan demo website setelah slide

1. Buka <https://tugas-struktur-data-rose.vercel.app>.
2. Pilih kategori Pesawat dan cari Jakarta ke Bali.
3. Tekan **Ctrl + Shift + L**.
4. Pilih Bubble Sort, harga terendah, kemudian klik **Urutkan**.
5. Ulangi menggunakan Selection Sort.
6. Jalankan Linear Search dengan kata `Garuda` atau `Bali`.
7. Tunjukkan log dan statistik proses.
8. Tutup mode akademik dengan **Ctrl + Shift + L**.
