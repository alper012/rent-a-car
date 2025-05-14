import { Box, useColorMode } from "@chakra-ui/react"; // Chakra UI bileşenleri ve renk modu kullanımı
import { Routes, Route } from "react-router-dom"; // React Router ile yönlendirme (routing) işlemi
import Navbar from "./components/Navbar"; // Navbar bileşeni
import Home from "./pages/Home"; // Ana sayfa bileşeni
import Login from "./pages/Login"; // Giriş sayfası bileşeni
import Register from "./pages/Register"; // Kayıt sayfası bileşeni
import CarDetail from "./pages/CarDetail"; // Araç detayları sayfası bileşeni
import AdminLayout from "./layouts/AdminLayout"; // Admin paneli için ana düzen (layout)
import Dashboard from "./pages/admin/Dashboard"; // Admin panelindeki ana sayfa
import Cars from "./pages/admin/Cars"; // Admin panelindeki araçlar sayfası
import NewCar from "./pages/admin/NewCar"; // Admin panelindeki yeni araç ekleme sayfası
import EditCar from "./pages/admin/EditCar"; // Admin panelindeki araç düzenleme sayfası
import Bookings from "./pages/admin/Bookings"; // Admin panelindeki rezervasyonlar sayfası
import ProtectedRoute from "./components/ProtectedRoute"; // Kullanıcı doğrulama (korumalı rota) bileşeni
import MyRentals from "./pages/MyRentals"; // Kullanıcıya ait kiralamalar sayfası
import Profile from "./pages/Profile"; // Kullanıcı profil sayfası

function App() {
  const { colorMode } = useColorMode(); // Renk modu (light veya dark) durumu

  // Genel düzeni tanımlayan PublicLayout bileşeni
  const PublicLayout = ({ children }: { children: React.ReactNode }) => (
    <Box
      minH="100vh" // Sayfanın minimum yüksekliği 100vh (tam ekran)
      display="flex" // Flexbox düzeni
      flexDirection="column" // Dikey yönde düzenleme
      bg={colorMode === "light" ? "white" : "gray.800"} // Renk modu ile arka plan rengini ayarlama
      overflow="hidden" // Taşma durumunu gizle
    >
      <Navbar /> {/* Navbar bileşenini sayfada üstte göster */}
      <Box
        flex="1" // İçerik alanı esnek büyüklükte olacak
        bg={colorMode === "light" ? "white" : "gray.800"} // Arka plan rengini renk moduna göre ayarla
        overflow="auto" // Taşma durumunda kaydırma çubuğu ekle
      >
        {children} {/* İçeriği (sayfalar) buraya yerleştir */}
      </Box>
    </Box>
  );

  return (
    <Routes>
      {/* Admin Routes (Admin Paneline Özel Yönlendirmeler) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            {" "}
            <AdminLayout /> {/* Admin panelinin ana düzeni */}
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />{" "}
        {/* Admin panelinin anasayfası */}
        <Route path="cars" element={<Cars />} /> {/* Araçlar sayfası */}
        <Route path="cars/new" element={<NewCar />} />{" "}
        {/* Yeni araç ekleme sayfası */}
        <Route path="cars/edit/:id" element={<EditCar />} />{" "}
        {/* Araç düzenleme sayfası */}
        <Route path="bookings" element={<Bookings />} />{" "}
        {/* Rezervasyonlar sayfası */}
      </Route>

      {/* Protected User Routes (Kullanıcıya Özel Korumalı Yönlendirmeler) */}
      <Route
        path="/my-rentals"
        element={
          <ProtectedRoute>
            {" "}
            {/* Kullanıcı doğrulaması yapılmış olmalı */}
            <PublicLayout>
              <MyRentals /> {/* Kullanıcının kiralamalarını göster */}
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {" "}
            {/* Kullanıcı doğrulaması yapılmış olmalı */}
            <PublicLayout>
              <Profile /> {/* Kullanıcının profil bilgilerini göster */}
            </PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* Public Routes (Herkese Açık Yönlendirmeler) */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home /> {/* Ana sayfa */}
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login /> {/* Giriş sayfası */}
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register /> {/* Kayıt sayfası */}
          </PublicLayout>
        }
      />
      <Route
        path="/car/:id"
        element={
          <PublicLayout>
            <CarDetail /> {/* Araç detayları sayfası */}
          </PublicLayout>
        }
      />
    </Routes>
  );
}

export default App; // App bileşenini dışa aktar
