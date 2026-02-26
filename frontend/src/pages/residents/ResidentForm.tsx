import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function ResidentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nama_lengkap: "",
    status_penghuni: "tetap",
    nomor_telepon: "",
    sudah_menikah: false,
  });
  const [fotoKtp, setFotoKtp] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data jika edit mode
  useEffect(() => {
    if (isEdit) {
      api
        .get(`/residents/${id}`)
        .then((res) => {
          const data = res.data.data;
          setForm({
            nama_lengkap: data.nama_lengkap,
            status_penghuni: data.status_penghuni,
            nomor_telepon: data.nomor_telepon,
            sudah_menikah: data.sudah_menikah,
          });
        })
        .catch(console.error);
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gunakan FormData karena ada file upload (foto KTP)
      const formData = new FormData();
      formData.append("nama_lengkap", form.nama_lengkap);
      formData.append("status_penghuni", form.status_penghuni);
      formData.append("nomor_telepon", form.nomor_telepon);
      formData.append("sudah_menikah", form.sudah_menikah ? "1" : "0");
      if (fotoKtp) {
        formData.append("foto_ktp", fotoKtp);
      }

      if (isEdit) {
        formData.append("_method", "PUT"); // Laravel method spoofing
        await api.post(`/residents/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Data penghuni berhasil diperbarui");
      } else {
        await api.post("/residents", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Penghuni berhasil ditambahkan");
      }

      navigate("/residents");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg as string));
      } else {
        toast.error("Gagal menyimpan data");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/residents")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit" : "Tambah"} Penghuni
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Penghuni</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
              <Input
                id="nama_lengkap"
                value={form.nama_lengkap}
                onChange={(e) =>
                  setForm({ ...form, nama_lengkap: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* Foto KTP */}
            <div className="space-y-2">
              <Label htmlFor="foto_ktp">Foto KTP</Label>
              <Input
                id="foto_ktp"
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                onChange={(e) =>
                  setFotoKtp(e.target.files ? e.target.files[0] : null)
                }
              />
              <p className="text-xs text-muted-foreground">
                Format: JPG, JPEG, PNG. Maks 2MB.
              </p>
            </div>

            {/* Status Penghuni */}
            <div className="space-y-2">
              <Label>Status Penghuni *</Label>
              <Select
                value={form.status_penghuni}
                onValueChange={(v) => setForm({ ...form, status_penghuni: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tetap">Tetap</SelectItem>
                  <SelectItem value="kontrak">Kontrak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nomor Telepon */}
            <div className="space-y-2">
              <Label htmlFor="nomor_telepon">Nomor Telepon *</Label>
              <Input
                id="nomor_telepon"
                value={form.nomor_telepon}
                onChange={(e) =>
                  setForm({ ...form, nomor_telepon: e.target.value })
                }
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>

            {/* Sudah Menikah */}
            <div className="space-y-2">
              <Label>Sudah Menikah? *</Label>
              <Select
                value={form.sudah_menikah ? "ya" : "tidak"}
                onValueChange={(v) =>
                  setForm({ ...form, sudah_menikah: v === "ya" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ya">Sudah Menikah</SelectItem>
                  <SelectItem value="tidak">Belum Menikah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : isEdit ? "Perbarui" : "Simpan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/residents")}
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
