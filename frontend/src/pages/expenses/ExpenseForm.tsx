import { useState } from "react";
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

const KATEGORI_OPTIONS = [
  "gaji_satpam",
  "token_listrik",
  "perbaikan_jalan",
  "perbaikan_selokan",
  "perawatan_taman",
  "kebersihan",
  "lainnya",
];

export default function ExpenseForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    kategori: "",
    deskripsi: "",
    jumlah: "",
    tanggal: new Date().toISOString().split("T")[0],
    is_recurring: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/expenses", {
        ...form,
        jumlah: Number(form.jumlah),
      });
      toast.success("Pengeluaran berhasil dicatat");
      navigate("/expenses");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg as string));
      } else {
        toast.error("Gagal menyimpan pengeluaran");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/expenses")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <h1 className="text-3xl font-bold">Tambah Pengeluaran</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kategori */}
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select
                value={form.kategori}
                onValueChange={(v) => setForm({ ...form, kategori: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  {KATEGORI_OPTIONS.map((k) => (
                    <SelectItem key={k} value={k} className="capitalize">
                      {k.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi *</Label>
              <Input
                id="deskripsi"
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
                placeholder="Contoh: Gaji satpam bulan Januari"
                required
              />
            </div>

            {/* Jumlah */}
            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah (Rp) *</Label>
              <Input
                id="jumlah"
                type="number"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            {/* Tanggal */}
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal *</Label>
              <Input
                id="tanggal"
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                required
              />
            </div>

            {/* Is Recurring */}
            <div className="space-y-2">
              <Label>Pengeluaran Rutin?</Label>
              <Select
                value={form.is_recurring ? "ya" : "tidak"}
                onValueChange={(v) =>
                  setForm({ ...form, is_recurring: v === "ya" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ya">Ya (rutin bulanan)</SelectItem>
                  <SelectItem value="tidak">Tidak (sekali)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/expenses")}
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
