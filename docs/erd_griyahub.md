# 📊 GriyaHub - Entity Relationship Diagram (ERD)

## Diagram

```mermaid
erDiagram
    RESIDENTS {
        bigint id PK
        string nama_lengkap "NOT NULL"
        string foto_ktp "NULLABLE - path file"
        enum status_penghuni "kontrak | tetap"
        string nomor_telepon "NOT NULL, max 20"
        boolean sudah_menikah "DEFAULT false"
        timestamp created_at
        timestamp updated_at
    }

    HOUSES {
        bigint id PK
        string nomor_rumah "UNIQUE, NOT NULL"
        text alamat "NULLABLE"
        enum status_hunian "dihuni | tidak_dihuni"
        timestamp created_at
        timestamp updated_at
    }

    HOUSE_RESIDENTS {
        bigint id PK
        bigint house_id FK "NOT NULL"
        bigint resident_id FK "NOT NULL"
        date tanggal_masuk "NOT NULL"
        date tanggal_keluar "NULLABLE - null = masih tinggal"
        boolean is_active "DEFAULT true"
        timestamp created_at
        timestamp updated_at
    }

    PAYMENTS {
        bigint id PK
        bigint resident_id FK "NOT NULL"
        bigint house_id FK "NOT NULL"
        enum jenis_iuran "satpam | kebersihan"
        decimal jumlah "12,2"
        tinyint bulan "1-12"
        smallint tahun "2020-2099"
        date tanggal_bayar "NULLABLE"
        enum status "lunas | belum_lunas"
        enum periode "bulanan | tahunan"
        timestamp created_at
        timestamp updated_at
    }

    EXPENSES {
        bigint id PK
        string kategori "NOT NULL"
        string deskripsi "NOT NULL"
        decimal jumlah "12,2"
        date tanggal "NOT NULL"
        boolean is_recurring "DEFAULT false"
        timestamp created_at
        timestamp updated_at
    }

    HOUSES ||--o{ HOUSE_RESIDENTS : "memiliki riwayat"
    RESIDENTS ||--o{ HOUSE_RESIDENTS : "tinggal di"
    RESIDENTS ||--o{ PAYMENTS : "membayar"
    HOUSES ||--o{ PAYMENTS : "tagihan untuk"
```

## Penjelasan Tabel

### 1. [residents](file:///c:/MyProject/GriyaHub/backend/app/Models/House.php#26-33) (Penghuni)
Menyimpan data semua penghuni perumahan.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| [id](file:///c:/MyProject/GriyaHub/frontend/src/components/layout/Sidebar.tsx#18-59) | BIGINT PK | Auto increment |
| `nama_lengkap` | VARCHAR(255) | Nama lengkap penghuni |
| `foto_ktp` | VARCHAR(255) | Path file foto KTP (nullable) |
| `status_penghuni` | ENUM | `kontrak` atau `tetap` |
| `nomor_telepon` | VARCHAR(20) | Nomor HP penghuni |
| `sudah_menikah` | BOOLEAN | Status pernikahan |

### 2. [houses](file:///c:/MyProject/GriyaHub/backend/app/Models/Resident.php#32-39) (Rumah)
Data 20 rumah di perumahan.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| [id](file:///c:/MyProject/GriyaHub/frontend/src/components/layout/Sidebar.tsx#18-59) | BIGINT PK | Auto increment |
| `nomor_rumah` | VARCHAR UNIQUE | Contoh: A-01, A-02 |
| `alamat` | TEXT | Alamat lengkap |
| `status_hunian` | ENUM | `dihuni` atau `tidak_dihuni` |

### 3. `house_residents` (Riwayat Penghuni Rumah)
Pivot table yang mencatat siapa tinggal di rumah mana, termasuk historical.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `house_id` | FK → houses | Rumah yang ditempati |
| `resident_id` | FK → residents | Penghuni |
| `tanggal_masuk` | DATE | Tanggal mulai tinggal |
| `tanggal_keluar` | DATE NULL | NULL = masih tinggal |
| `is_active` | BOOLEAN | True = penghuni aktif |

### 4. [payments](file:///c:/MyProject/GriyaHub/backend/app/Models/Resident.php#46-51) (Pembayaran Iuran)
Mencatat pembayaran iuran satpam & kebersihan.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `resident_id` | FK → residents | Penghuni yang bayar |
| `house_id` | FK → houses | Rumah yang ditagih |
| `jenis_iuran` | ENUM | `satpam` (100k) atau `kebersihan` (15k) |
| `jumlah` | DECIMAL(12,2) | Nominal pembayaran |
| `bulan` | TINYINT | Bulan 1-12 |
| `tahun` | SMALLINT | Tahun |
| `tanggal_bayar` | DATE NULL | Tanggal bayar (null = belum bayar) |
| `status` | ENUM | `lunas` atau `belum_lunas` |
| `periode` | ENUM | `bulanan` atau `tahunan` |

### 5. `expenses` (Pengeluaran)
Pengeluaran operasional yang dikelola RT.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `kategori` | VARCHAR | gaji_satpam, token_listrik, perbaikan_jalan, dll |
| `deskripsi` | VARCHAR | Penjelasan pengeluaran |
| `jumlah` | DECIMAL(12,2) | Nominal |
| `tanggal` | DATE | Tanggal pengeluaran |
| `is_recurring` | BOOLEAN | True = rutin bulanan |

## Relasi

| Relasi | Tipe | Keterangan |
|--------|------|------------|
| Houses ↔ Residents | Many-to-Many | Via `house_residents` pivot |
| Residents → Payments | One-to-Many | 1 penghuni bisa punya banyak pembayaran |
| Houses → Payments | One-to-Many | 1 rumah bisa punya banyak tagihan |
| Expenses | Standalone | Tidak terkait ke tabel lain |
