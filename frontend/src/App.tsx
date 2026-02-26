import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Dashboard from "@/pages/Dashboard";
import ResidentList from "@/pages/residents/ResidentList";
import ResidentForm from "@/pages/residents/ResidentForm";
import HouseList from "@/pages/houses/HouseList";
import HouseForm from "@/pages/houses/HouseForm";
import HouseDetail from "@/pages/houses/HouseDetail";
import PaymentList from "@/pages/payments/PaymentList";
import PaymentForm from "@/pages/payments/PaymentForm";
import ExpenseList from "@/pages/expenses/ExpenseList";
import ExpenseForm from "@/pages/expenses/ExpenseForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Penghuni */}
          <Route path="/residents" element={<ResidentList />} />
          <Route path="/residents/create" element={<ResidentForm />} />
          <Route path="/residents/:id/edit" element={<ResidentForm />} />

          {/* Rumah */}
          <Route path="/houses" element={<HouseList />} />
          <Route path="/houses/create" element={<HouseForm />} />
          <Route path="/houses/:id" element={<HouseDetail />} />

          {/* Pembayaran */}
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/payments/create" element={<PaymentForm />} />

          {/* Pengeluaran */}
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/expenses/create" element={<ExpenseForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
