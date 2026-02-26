import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import api from "@/lib/api";
import type { House, ApiResponse } from "@/types";

export default function HouseList() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<House[]>>("/houses")
      .then((res) => setHouses(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-muted-foreground text-center py-8">Memuat data...</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Rumah</h1>
          <p className="text-muted-foreground mt-1">
            Total {houses.length} rumah di perumahan
          </p>
        </div>
        <Link to="/houses/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Tambah Rumah
          </Button>
        </Link>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {houses.map((house) => {
          const activeResident = house.house_residents?.find(
            (hr) => hr.is_active,
          );
          return (
            <Card key={house.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Rumah {house.nomor_rumah}
                  </CardTitle>
                  <Badge
                    variant={
                      house.status_hunian === "dihuni" ? "default" : "secondary"
                    }
                  >
                    {house.status_hunian === "dihuni"
                      ? "Dihuni"
                      : "Tidak Dihuni"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {house.alamat && (
                  <p className="text-sm text-muted-foreground">
                    {house.alamat}
                  </p>
                )}

                {activeResident?.resident ? (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Penghuni:</p>
                    <p className="font-medium">
                      {activeResident.resident.nama_lengkap}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Belum ada penghuni
                  </p>
                )}

                <Link to={`/houses/${house.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Eye className="h-4 w-4 mr-2" /> Lihat Detail
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
