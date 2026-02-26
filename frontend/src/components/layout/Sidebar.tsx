import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  CreditCard,
  Receipt,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/residents", icon: Users, label: "Penghuni" },
  { to: "/houses", icon: Home, label: "Rumah" },
  { to: "/payments", icon: CreditCard, label: "Pembayaran" },
  { to: "/expenses", icon: Receipt, label: "Pengeluaran" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">🏠 GriyaHub</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Administrasi Perumahan
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          GriyaHub v1.0
        </p>
      </div>
    </aside>
  );
}
