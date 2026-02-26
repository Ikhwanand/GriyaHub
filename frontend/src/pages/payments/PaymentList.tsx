import { useCallback, useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import type { Payment, ApiResponse } from "@/types";

export default function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tahun: new Date().getFullYear().toString(),
    bulan: "all",
    status: "all",
    jenis_iuran: "all",
  });

  const fetchPayments = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = { tahun: filters.tahun };
    if (filters.bulan !== "all") params.bulan = filters.bulan;
    if (filters.status !== "all") params.status = filters.status;
    if (filters.jenis_iuran !== "all") params.jenis_iuran = filters.jenis_iuran;

    api
      .get<ApiResponse<Payment[]>>("/payments", { params })
      .then((res) => setPayments(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(v);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Pembayaran</h1>
          <p className="text-muted-foreground mt-1">
            Iuran satpam & kebersihan
          </p>
        </div>
        <Link to="/payments/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Tambah Pembayaran
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Select
          value={filters.tahun}
          onValueChange={(v) => setFilters({ ...filters, tahun: v })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            {[2024, 2025, 2026].map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.bulan}
          onValueChange={(v) => setFilters({ ...filters, bulan: v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua Bulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Bulan</SelectItem>
            {bulanNames.map((name, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.jenis_iuran}
          onValueChange={(v) => setFilters({ ...filters, jenis_iuran: v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            <SelectItem value="satpam">Satpam</SelectItem>
            <SelectItem value="kebersihan">Kebersihan</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(v) => setFilters({ ...filters, status: v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="lunas">Lunas</SelectItem>
            <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pembayaran ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              Memuat data...
            </p>
          ) : payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Tidak ada data pembayaran.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Penghuni</TableHead>
                  <TableHead>Rumah</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p, idx) => (
                  <TableRow key={p.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">
                      {p.resident?.nama_lengkap}
                    </TableCell>
                    <TableCell>{p.house?.nomor_rumah}</TableCell>
                    <TableCell className="capitalize">
                      {p.jenis_iuran}
                    </TableCell>
                    <TableCell>
                      {bulanNames[p.bulan - 1]} {p.tahun}
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
    </div>
  );
}
