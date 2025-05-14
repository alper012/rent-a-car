import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Cars from "../pages/admin/Cars";
import NewCar from "../pages/admin/NewCar";
import EditCar from "../pages/admin/EditCar";
import Bookings from "../pages/admin/Bookings";
import ProtectedRoute from "../components/ProtectedRoute";

const AdminRoutes = () => {  // Admin paneline ait yönlendirme ve route'ları tanımlayan fonksiyonel bileşen
  return (
    <Routes>  {/* React Router'dan Routes component'i. Uygulama içinde tüm yönlendirmeleri yönetir */}
      <Route
        path="/" //  Admin panelinin ana yolunu tanımlıyoruz
        element={
          <ProtectedRoute requireAdmin>  {/* Admin yetkisi gerektiren route'lar için koruma sağlar */}
            <AdminLayout />  {/* Admin panelinin genel düzeni */}
          </ProtectedRoute>
        }
      >
        {/* Admin paneline özel route'lar */}
        <Route index element={<Dashboard />} />  {/* Ana sayfa: Admin dashboard */}
        <Route path="cars" element={<Cars />} />  {/* Araçlar sayfası */}
        <Route path="cars/new" element={<NewCar />} />  {/* Yeni araç ekleme sayfası */}
        <Route path="cars/edit/:id" element={<EditCar />} />  {/* Varolan bir aracı düzenleme sayfası. ":id" parametresi ile araç ID'si alınır */}
        <Route path="bookings" element={<Bookings />} />  {/* Rezervasyonlar sayfası */}
        
        <Route path="*" element={<Navigate to="/admin" replace />} />  {/* Geçersiz bir URL girildiğinde admin ana sayfasına yönlendir */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;  // AdminRoutes bileşenini dışa aktarıyoruz
