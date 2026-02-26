import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Resident, House, ApiResponse } from "@/types";

export default function PaymentForm() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    resident_id: "",
    house_id: "",
    jenis_iuran: "satpam",
    jumlah: "",
    bulan: (new Date().getMonth() + 1).toString(),
    tahun: new Date().getFullYear().toString(),
    tanggal_bayar: new Date().toISOString().split("T")[0],
    status: "lunas",
    periode: "bulanan",
  });

  useEffect(() => {
    api
      .get<ApiResponse<Resident[]>>("/residents")
      .then((res) => setResidents(res.data.data));
    api
      .get<ApiResponse<House[]>>("/houses")
      .then((res) => setHouses(res.data.data));
  }, []);

  // Auto-fill jumlah berdasarkan jenis iuran
  useEffect(() => {
    if (form.jenis_iuran === "satpam") {
      setForm((prev) => ({ ...prev, jumlah: "100000" }));
    } else if (form.jenis_iuran === "kebersihan") {
      setForm((prev) => ({ ...prev, jumlah: "15000" }));
    }
  }, [form.jenis_iuran]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/payments", {
        ...form,
        resident_id: Number(form.resident_id),
        house_id: Number(form.house_id),
        jumlah: Number(form.jumlah),
        bulan: Number(form.bulan),
        tahun: Number(form.tahun),
      });
      toast.success("Pembayaran berhasil dicatat");
      navigate("/payments");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg as string));
      } else {
        toast.error("Gagal menyimpan pembayaran");
      }
    } finally {
      setLoading(false);
    }
  };

  const bulanNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/payments")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <h1 className="text-3xl font-bold">Tambah Pembayaran</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Penghuni */}
            <div className="space-y-2">
              <Label>Penghuni *</Label>
              <Select
                value={form.resident_id}
                onValueChange={(v) => setForm({ ...form, resident_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penghuni..." />
                </SelectTrigger>
                <SelectContent>
                  {residents.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.nama_lengkap}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rumah */}
            <div className="space-y-2">
              <Label>Rumah *</Label>
              <Select
                value={form.house_id}
                onValueChange={(v) => setForm({ ...form, house_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih rumah..." />
                </SelectTrigger>
                <SelectContent>
                  {houses.map((h) => (
                    <SelectItem key={h.id} value={h.id.toString()}>
                      Rumah {h.nomor_rumah}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Jenis Iuran */}
            <div className="space-y-2">
              <Label>Jenis Iuran *</Label>
              <Select
                value={form.jenis_iuran}
                onValueChange={(v) => setForm({ ...form, jenis_iuran: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satpam">Satpam (Rp 100.000)</SelectItem>
                  <SelectItem value="kebersihan">
                    Kebersihan (Rp 15.000)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jumlah */}
            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah (Rp) *</Label>
              <Input
                id="jumlah"
                type="number"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                required
              />
            </div>

            {/* Bulan & Tahun */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bulan *</Label>
                <Select
                  value={form.bulan}
                  onValueChange={(v) => setForm({ ...form, bulan: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bulanNames.map((name, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun *</Label>
                <Select
                  value={form.tahun}
                  onValueChange={(v) => setForm({ ...form, tahun: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2024, 2025, 2026].map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Periode & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Periode</Label>
                <Select
                  value={form.periode}
                  onValueChange={(v) => setForm({ ...form, periode: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bulanan">Bulanan</SelectItem>
                    <SelectItem value="tahunan">Tahunan (12 bulan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lunas">Lunas</SelectItem>
                    <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tanggal Bayar */}
            <div className="space-y-2">
              <Label htmlFor="tanggal_bayar">Tanggal Bayar</Label>
              <Input
                id="tanggal_bayar"
                type="date"
                value={form.tanggal_bayar}
                onChange={(e) =>
                  setForm({ ...form, tanggal_bayar: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/payments")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
