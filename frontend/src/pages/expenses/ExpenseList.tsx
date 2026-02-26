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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Expense, ApiResponse } from "@/types";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = () => {
    setLoading(true);
    api
      .get<ApiResponse<Expense[]>>("/expenses")
      .then((res) => setExpenses(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pengeluaran ini?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Pengeluaran berhasil dihapus");
      fetchExpenses();
    } catch {
      toast.error("Gagal menghapus pengeluaran");
    }
  };

  const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(v);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Pengeluaran</h1>
          <p className="text-muted-foreground mt-1">
            Pengeluaran operasional perumahan
          </p>
        </div>
        <Link to="/expenses/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Tambah Pengeluaran
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengeluaran ({expenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              Memuat data...
            </p>
          ) : expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Belum ada pengeluaran.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Rutin</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp, idx) => (
                  <TableRow key={exp.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium capitalize">
                      {exp.kategori}
                    </TableCell>
                    <TableCell>{exp.deskripsi}</TableCell>
                    <TableCell>{formatRupiah(exp.jumlah)}</TableCell>
                    <TableCell>{exp.tanggal}</TableCell>
                    <TableCell>{exp.is_recurring ? "Ya" : "Tidak"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
