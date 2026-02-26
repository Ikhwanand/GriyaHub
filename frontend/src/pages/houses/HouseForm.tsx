import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function HouseForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nomor_rumah: "",
    alamat: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/houses", form);
      toast.success("Rumah berhasil ditambahkan");
      navigate("/houses");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg as string));
      } else {
        toast.error("Gagal menambahkan rumah");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/houses")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <h1 className="text-3xl font-bold">Tambah Rumah</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Rumah</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomor_rumah">Nomor Rumah *</Label>
              <Input
                id="nomor_rumah"
                value={form.nomor_rumah}
                onChange={(e) =>
                  setForm({ ...form, nomor_rumah: e.target.value })
                }
                placeholder="Contoh: A-01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                placeholder="Alamat lengkap rumah"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/houses")}
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
