// ============================================
// GriyaHub - TypeScript Type Definitions
// ============================================

// ---------- Penghuni (Resident) ----------
export interface Resident {
  id: number;
  nama_lengkap: string;
  foto_ktp: string | null;
  status_penghuni: "kontrak" | "tetap";
  nomor_telepon: string;
  sudah_menikah: boolean;
  created_at: string;
  updated_at: string;
  // Relasi
  house_residents?: HouseResident[];
  payments?: Payment[];
}

// ---------- Rumah (House) ----------
export interface House {
  id: number;
  nomor_rumah: string;
  alamat: string | null;
  status_hunian: "dihuni" | "tidak_dihuni";
  created_at: string;
  updated_at: string;
  // Relasi
  house_residents?: HouseResident[];
  payments?: Payment[];
}

// ---------- Riwayat Penghuni Rumah ----------
export interface HouseResident {
  id: number;
  house_id: number;
  resident_id: number;
  tanggal_masuk: string;
  tanggal_keluar: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relasi
  house?: House;
  resident?: Resident;
}

// ---------- Pembayaran Iuran ----------
export interface Payment {
  id: number;
  resident_id: number;
  house_id: number;
  jenis_iuran: "satpam" | "kebersihan";
  jumlah: number;
  bulan: number;
  tahun: number;
  tanggal_bayar: string | null;
  status: "lunas" | "belum_lunas";
  periode: "bulanan" | "tahunan";
  created_at: string;
  updated_at: string;
  // Relasi
  resident?: Resident;
  house?: House;
}

// ---------- Pengeluaran ----------
export interface Expense {
  id: number;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  tanggal: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- Dashboard ----------
export interface DashboardSummary {
  total_rumah: number;
  rumah_dihuni: number;
  rumah_kosong: number;
  total_penghuni: number;
  pemasukan_bulan_ini: number;
  pengeluaran_bulan_ini: number;
  saldo: number;
}

export interface ChartData {
  bulan: number;
  nama_bulan: string;
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
}

export interface MonthlyReport {
  bulan: number;
  tahun: number;
  nama_bulan: string;
  payments: Payment[];
  expenses: Expense[];
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo: number;
}

// ---------- API Response Wrapper ----------
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
