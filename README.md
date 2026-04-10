<div align="center">

# Agungjaya Alumunium — Invoice Generator

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Aplikasi web untuk pembuatan invoice profesional bisnis instalasi aluminium & kaca.**  
Dirancang agar mudah digunakan oleh siapa pun — tanpa perlu latar belakang teknis.

</div>

---

## 📖 Latar Belakang

Proyek ini dibuat untuk menjawab kendala operasional pada **Agungjaya Alumunium**, bisnis yang bergerak di bidang instalasi aluminium dan kaca di Duren Sawit, Jakarta Timur.

### Masalah
Proses pembuatan invoice sebelumnya dilakukan secara **manual** — salin-tempel (_copy-paste_) data klien ke dalam template dokumen. Proses ini tidak efisien, memakan waktu, dan rentan terhadap **kesalahan pengetikan** (_human error_).

### Solusi
Aplikasi ini menyediakan antarmuka **"isi kolom kosong"** (_fill the blank_) yang sederhana. Pengguna cukup memasukkan data pesanan, dan sistem akan secara otomatis merender invoice profesional yang siap cetak — tanpa perlu keahlian teknis apapun.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 📋 **Dynamic Item List** | Tambah atau hapus baris pesanan sesuai kebutuhan proyek |
| 💳 **Status Pembayaran** | Pilih status **DP** atau **LUNAS** — label invoice berubah otomatis |
| 📱 **Auto-scaling Preview** | Tampilan invoice menyesuaikan layar HP, Tablet, maupun Desktop |
| 🖨️ **Cetak Langsung** | Ekspor ke PDF atau cetak langsung ke printer tanpa library tambahan |
| 🏢 **Professional Branding** | Template dengan logo, kontak, dan alamat bisnis sudah terintegrasi |
| ⚡ **Real-time Preview** | Perubahan di formulir langsung tercermin pada tampilan invoice |

---

## 🛠️ Tech Stack

### Core

- **[React 19](https://react.dev/)** — Library utama untuk membangun antarmuka. Perubahan data di formulir dirender secara real-time ke tampilan invoice.
- **[TypeScript](https://www.typescriptlang.org/)** — Memberikan _type-safety_ untuk memastikan data invoice (harga, deskripsi, dll.) selalu konsisten dan meminimalkan bug.
- **[Vite](https://vite.dev/)** — Build tool generasi terbaru untuk server lokal yang cepat saat development dan bundel yang ringan saat production.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Framework CSS modern untuk mendesain formulir dan template invoice, termasuk simulasi kertas A4 di layar.

### Dependencies

- **[Lucide React](https://lucide.dev/)** — Ikon untuk elemen UI seperti tombol cetak, tambah baris, dan hapus. Membantu navigasi pengguna non-teknis.
- **Native Browser Print (`window.print()`)** — Memanfaatkan fungsi print bawaan peramban dengan konfigurasi `@media print` kustom. Elemen formulir disembunyikan otomatis, hanya invoice yang tercetak dengan skala pas di kertas A4.
- **[Inter Font](https://fonts.google.com/specimen/Inter)** — Dimuat via Google Fonts untuk tampilan invoice yang profesional dan bersih.

---

```

---

## 📝 Cara Penggunaan (untuk Pengguna)

> Tidak perlu keahlian teknis. Ikuti langkah berikut:

1. **Isi kolom Tanggal** dan **Nama Klien**.
2. **Masukkan deskripsi pesanan** (contoh: `3 Set Pintu Sliding`) beserta harganya.
3. Gunakan tombol **➕ Tambah Baris** jika ada lebih dari satu item pesanan.
4. **Masukkan jumlah DP** dan **Sisa Pembayaran**.
5. **Pilih Status Pembayaran**: `DP` atau `LUNAS`.
6. Klik tombol **🖨️ Cetak PDF** untuk menyimpan sebagai dokumen atau langsung mencetak.

---

## 📁 Struktur Proyek

agungjaya-invoice/
├── public/
│   └── logo.png            # Logo Agungjaya Alumunium
├── src/
│   ├── components/
│   │   ├── InvoiceForm.tsx  # Komponen formulir input
│   │   └── InvoicePreview.tsx # Komponen template invoice
│   ├── types/
│   │   └── invoice.ts       # TypeScript interfaces & types
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

---

## 📍 Informasi Bisnis

**Agungjaya Alumunium**  
Spesialis instalasi aluminium & kaca  
📍 Duren Sawit, Jakarta Timur

---
