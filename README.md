# 🏠 GriyaHub - Sistem Administrasi Perumahan

Aplikasi web untuk mengelola administrasi perumahan elite, termasuk penghuni, rumah, pembayaran iuran, dan pengeluaran operasional.

## 📋 Study Case

Seorang RT di perumahan elite dengan 20 rumah membutuhkan sistem untuk:

- Mengelola data penghuni (tetap & kontrak)
- Mengelola data rumah beserta riwayat penghuninya
- Mencatat pembayaran iuran bulanan (Satpam Rp100.000 & Kebersihan Rp15.000)
- Mencatat pengeluaran operasional (gaji satpam, token listrik, perbaikan, dll)
- Melihat laporan pemasukan & pengeluaran dalam bentuk grafik

## 🛠️ Tech Stack

| Layer             | Teknologi                    |
| ----------------- | ---------------------------- |
| **Backend**       | PHP 8.1+ / Laravel 10        |
| **Frontend**      | React 19 + TypeScript + Vite |
| **UI Components** | shadcn/ui + Tailwind CSS 4   |
| **Charts**        | Recharts                     |
| **Database**      | MySQL                        |
| **HTTP Client**   | Axios                        |

## 📦 Prasyarat

Pastikan sudah terinstall di komputer:

- **PHP** >= 8.1
- **Composer** (package manager PHP)
- **Node.js** >= 18 & **npm**
- **MySQL** (via XAMPP, Laragon, atau standalone)
- **Git**

## 🚀 Panduan Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/ikhwanand/GriyaHub
cd GriyaHub
```

### 2. Setup Backend (Laravel)

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Konfigurasi Database

Buat database MySQL baru:

```sql
CREATE DATABASE griyahub_db;
```

Edit file `backend/.env` dan sesuaikan:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=griyahub_db
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Jalankan Migration & Seeder

```bash
cd backend

# Jalankan migration (buat tabel)
php artisan migrate

# Jalankan seeder (isi data sample)
php artisan db:seed

# Buat symbolic link untuk storage (foto KTP)
php artisan storage:link
```

### 5. Setup Frontend (React)

```bash
cd frontend

# Install Node.js dependencies
npm install
```

### 6. Jalankan Aplikasi

**Terminal 1 - Backend:**

```bash
cd backend
php artisan serve
```

Backend berjalan di: `http://localhost:8000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend berjalan di: `http://localhost:5173`

### 7. Buka Aplikasi

Buka browser dan akses: **http://localhost:5173**

## 📂 Struktur Project

```
GriyaHub/
├── backend/                    # Laravel 10
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── ResidentController.php
│   │   │   │   ├── HouseController.php
│   │   │   │   ├── PaymentController.php
│   │   │   │   ├── ExpenseController.php
│   │   │   │   └── DashboardController.php
│   │   │   └── Requests/
│   │   │       ├── StoreResidentRequest.php
│   │   │       ├── UpdateResidentRequest.php
│   │   │       ├── StoreHouseRequest.php
│   │   │       ├── StorePaymentRequest.php
│   │   │       └── StoreExpenseRequest.php
│   │   └── Models/
│   │       ├── Resident.php
│   │       ├── House.php
│   │       ├── HouseResident.php
│   │       ├── Payment.php
│   │       └── Expense.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
├── frontend/                   # React 19 + Vite
│   └── src/
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   └── AppLayout.tsx
│       │   └── ui/             # shadcn components
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── residents/
│       │   ├── houses/
│       │   ├── payments/
│       │   └── expenses/
│       ├── types/
│       │   └── index.ts
│       ├── lib/
│       │   ├── api.ts
│       │   └── utils.ts
│       └── App.tsx
└── README.md
```

## ✨ Fitur

### 1. Mengelola Penghuni

- ✅ Menambah & mengubah penghuni
- ✅ Data: Nama, Foto KTP, Status (kontrak/tetap), No. Telepon, Status Menikah

### 2. Mengelola Rumah

- ✅ Menambah & mengubah rumah
- ✅ Menambah & mengubah penghuni rumah (assign/unassign)
- ✅ Catatan historis siapa penghuni masing-masing rumah
- ✅ History pembayaran per rumah dengan status lunas/belum
- ✅ Status rumah: Dihuni / Tidak Dihuni
- ✅ Informasi siapa penghuni jika dihuni

### 3. Mengelola Pembayaran

- ✅ Mencatat pembayaran iuran bulanan
- ✅ 2 jenis iuran: Satpam (Rp100.000) & Kebersihan (Rp15.000)
- ✅ Support pembayaran tahunan (auto 12 bulan)
- ✅ Report summary + saldo (pemasukan - pengeluaran)
- ✅ Grafik pemasukan & pengeluaran per bulan (1 tahun)
- ✅ Detail laporan per bulan

## 🔌 API Endpoints

| Method | Endpoint                               | Deskripsi                |
| ------ | -------------------------------------- | ------------------------ |
| GET    | `/api/residents`                       | List semua penghuni      |
| POST   | `/api/residents`                       | Tambah penghuni          |
| GET    | `/api/residents/{id}`                  | Detail penghuni          |
| PUT    | `/api/residents/{id}`                  | Update penghuni          |
| DELETE | `/api/residents/{id}`                  | Hapus penghuni           |
| GET    | `/api/houses`                          | List semua rumah         |
| POST   | `/api/houses`                          | Tambah rumah             |
| GET    | `/api/houses/{id}`                     | Detail rumah + riwayat   |
| PUT    | `/api/houses/{id}`                     | Update rumah             |
| POST   | `/api/houses/{id}/assign`              | Assign penghuni ke rumah |
| PUT    | `/api/houses/{id}/unassign`            | Keluarkan penghuni       |
| GET    | `/api/payments`                        | List pembayaran          |
| POST   | `/api/payments`                        | Tambah pembayaran        |
| PUT    | `/api/payments/{id}`                   | Update status pembayaran |
| GET    | `/api/expenses`                        | List pengeluaran         |
| POST   | `/api/expenses`                        | Tambah pengeluaran       |
| PUT    | `/api/expenses/{id}`                   | Update pengeluaran       |
| DELETE | `/api/expenses/{id}`                   | Hapus pengeluaran        |
| GET    | `/api/dashboard/summary`               | Data summary dashboard   |
| GET    | `/api/dashboard/chart`                 | Data grafik bulanan      |
| GET    | `/api/reports/monthly/{tahun}/{bulan}` | Laporan detail per bulan |
