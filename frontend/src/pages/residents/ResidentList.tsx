import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Resident, ApiResponse } from "@/types";

export default function ResidentList() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResidents = () => {
    setLoading(true);
    api
      .get<ApiResponse<Resident[]>>("/residents")
      .then((res) => setResidents(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus penghuni ini?")) return;
    try {
      await api.delete(`/residents/${id}`);
      toast.success("Penghuni berhasil dihapus");
      fetchResidents();
    } catch {
      toast.error("Gagal menghapus penghuni");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Penghuni</h1>
          <p className="text-muted-foreground mt-1">
            Daftar seluruh penghuni perumahan
          </p>
        </div>
        <Link to="/residents/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Tambah Penghuni
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Penghuni ({residents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              Memuat data...
            </p>
          ) : residents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Belum ada penghuni terdaftar.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Menikah</TableHead>
                  <TableHead>Rumah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residents.map((resident, idx) => {
                  // Cari rumah aktif
                  const activeHouse = resident.house_residents?.find(
                    (hr) => hr.is_active,
                  );
                  return (
                    <TableRow key={resident.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell className="font-medium">
                        {resident.nama_lengkap}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            resident.status_penghuni === "tetap"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {resident.status_penghuni}
                        </Badge>
                      </TableCell>
                      <TableCell>{resident.nomor_telepon}</TableCell>
                      <TableCell>
                        {resident.sudah_menikah ? "Ya" : "Belum"}
                      </TableCell>
                      <TableCell>
                        {activeHouse?.house?.nomor_rumah ?? (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/residents/${resident.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(resident.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
