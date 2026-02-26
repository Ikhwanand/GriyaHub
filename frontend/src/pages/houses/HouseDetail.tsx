import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import type { House, Resident, ApiResponse } from "@/types";

export default function HouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState<House | null>(null);
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form assign penghuni
  const [assignForm, setAssignForm] = useState({
    resident_id: "",
    tanggal_masuk: new Date().toISOString().split("T")[0],
  });

  const fetchHouse = () => {
    api
      .get<ApiResponse<House>>(`/houses/${id}`)
      .then((res) => setHouse(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHouse();
    // Fetch semua penghuni untuk dropdown assign
    api
      .get<ApiResponse<Resident[]>>("/residents")
      .then((res) => setAllResidents(res.data.data));
  }, [id]);

  const handleAssign = async () => {
    try {
      await api.post(`/houses/${id}/assign`, {
        resident_id: Number(assignForm.resident_id),
        tanggal_masuk: assignForm.tanggal_masuk,
      });
      toast.success("Penghuni berhasil ditambahkan ke rumah");
      setDialogOpen(false);
      fetchHouse();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menambahkan penghuni");
    }
  };

  const handleUnassign = async (residentId: number) => {
    if (!confirm("Yakin ingin mengeluarkan penghuni dari rumah ini?")) return;
    try {
      await api.put(`/houses/${id}/unassign`, {
        resident_id: residentId,
        tanggal_keluar: new Date().toISOString().split("T")[0],
      });
      toast.success("Penghuni berhasil dikeluarkan dari rumah");
      fetchHouse();
    } catch {
      toast.error("Gagal mengeluarkan penghuni");
    }
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  if (loading || !house) {
    return (
      <p className="text-muted-foreground text-center py-8">Memuat data...</p>
    );
  }

  const activeResidents =
    house.house_residents?.filter((hr) => hr.is_active) ?? [];
  const historyResidents =
    house.house_residents?.filter((hr) => !hr.is_active) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/houses")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Rumah {house.nomor_rumah}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant={
                house.status_hunian === "dihuni" ? "default" : "secondary"
              }
            >
              {house.status_hunian === "dihuni" ? "Dihuni" : "Tidak Dihuni"}
            </Badge>
            {house.alamat && (
              <span className="text-muted-foreground text-sm">
                {house.alamat}
              </span>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="penghuni">
        <TabsList>
          <TabsTrigger value="penghuni">Penghuni Aktif</TabsTrigger>
          <TabsTrigger value="history">Riwayat Penghuni</TabsTrigger>
          <TabsTrigger value="payments">Riwayat Pembayaran</TabsTrigger>
        </TabsList>

        {/* Tab: Penghuni Aktif */}
        <TabsContent value="penghuni">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Penghuni Saat Ini</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" /> Tambah Penghuni
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Penghuni ke Rumah</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Pilih Penghuni</Label>
                      <Select
                        value={assignForm.resident_id}
                        onValueChange={(v) =>
                          setAssignForm({ ...assignForm, resident_id: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih penghuni..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allResidents.map((r) => (
                            <SelectItem key={r.id} value={r.id.toString()}>
                              {r.nama_lengkap} ({r.status_penghuni})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Masuk</Label>
                      <Input
                        type="date"
                        value={assignForm.tanggal_masuk}
                        onChange={(e) =>
                          setAssignForm({
                            ...assignForm,
                            tanggal_masuk: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleAssign} className="w-full">
                      Simpan
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {activeResidents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Belum ada penghuni aktif.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Masuk</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeResidents.map((hr) => (
                      <TableRow key={hr.id}>
                        <TableCell className="font-medium">
                          {hr.resident?.nama_lengkap}
                        </TableCell>
                        <TableCell>
                          <Badge>{hr.resident?.status_penghuni}</Badge>
                        </TableCell>
                        <TableCell>{hr.tanggal_masuk}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUnassign(hr.resident_id)}
                          >
                            <UserMinus className="h-4 w-4 mr-2" /> Keluarkan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Riwayat Penghuni */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Penghuni Sebelumnya</CardTitle>
            </CardHeader>
            <CardContent>
              {historyResidents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Belum ada riwayat.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tanggal Masuk</TableHead>
                      <TableHead>Tanggal Keluar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyResidents.map((hr) => (
                      <TableRow key={hr.id}>
                        <TableCell className="font-medium">
                          {hr.resident?.nama_lengkap}
                        </TableCell>
                        <TableCell>{hr.tanggal_masuk}</TableCell>
                        <TableCell>{hr.tanggal_keluar ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Riwayat Pembayaran */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembayaran Rumah Ini</CardTitle>
            </CardHeader>
            <CardContent>
              {!house.payments || house.payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Belum ada riwayat pembayaran.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Penghuni</TableHead>
                      <TableHead>Jenis Iuran</TableHead>
                      <TableHead>Bulan/Tahun</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {house.payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.resident?.nama_lengkap}</TableCell>
                        <TableCell className="capitalize">
                          {p.jenis_iuran}
                        </TableCell>
                        <TableCell>
                          {p.bulan}/{p.tahun}
                        </TableCell>
                        <TableCell>{formatRupiah(p.jumlah)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              p.status === "lunas" ? "default" : "destructive"
                            }
                          >
                            {p.status === "lunas" ? "Lunas" : "Belum Lunas"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
