import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Home, Users, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import api from "@/lib/api";
import type { DashboardSummary, ChartData, ApiResponse } from "@/types";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [loading, setLoading] = useState(true);

  // Fetch summary
  useEffect(() => {
    api
      .get<ApiResponse<DashboardSummary>>("/dashboard/summary")
      .then((res) => setSummary(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Fetch chart data when year changes
  useEffect(() => {
    api
      .get<ApiResponse<ChartData[]>>("/dashboard/chart", {
        params: { tahun: selectedYear },
      })
      .then((res) => setChartData(res.data.data))
      .catch(console.error);
  }, [selectedYear]);

  // Format currency Rupiah
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Ringkasan administrasi perumahan
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Rumah
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_rumah ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.rumah_dihuni ?? 0} dihuni · {summary?.rumah_kosong ?? 0}{" "}
              kosong
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Penghuni
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_penghuni ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Penghuni terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pemasukan Bulan Ini
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatRupiah(summary?.pemasukan_bulan_ini ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Iuran terbayar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pengeluaran Bulan Ini
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatRupiah(summary?.pengeluaran_bulan_ini ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total biaya</p>
          </CardContent>
        </Card>
      </div>

      {/* Saldo Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldo Bulan Ini
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold ${
              (summary?.saldo ?? 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatRupiah(summary?.saldo ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Pemasukan - Pengeluaran
          </p>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Grafik Pemasukan & Pengeluaran</CardTitle>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nama_bulan" fontSize={12} />
              <YAxis
                fontSize={12}
                tickFormatter={(v) =>
                  new Intl.NumberFormat("id-ID", {
                    notation: "compact",
                  }).format(v)
                }
              />
              <Tooltip
                formatter={(value: number) => formatRupiah(value)}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend />
              <Bar
                dataKey="pemasukan"
                name="Pemasukan"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pengeluaran"
                name="Pengeluaran"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
