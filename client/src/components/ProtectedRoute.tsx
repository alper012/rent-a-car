import { Navigate, useLocation } from "react-router-dom";
// Sayfa yönlendirme işlemleri için React Router'dan `Navigate` ve `useLocation` import edilir.

import { useAuth } from "../hooks/useAuth";
// Kullanıcının kimlik doğrulama durumunu almak için özel `useAuth` hook'u içe aktarılır.

import { Spinner, Center } from "@chakra-ui/react";
// Chakra UI'den yüklenme göstergesi (`Spinner`) ve ortalama (`Center`) bileşenleri alınır.

interface ProtectedRouteProps {
  children: React.ReactNode; // Bileşen içeriği olarak React bileşenlerini kabul eder.
  requireAdmin?: boolean; // Bu route’un sadece adminler için olup olmadığını belirler (varsayılan `false`).
}

// **Korumalı Route Bileşeni**
const ProtectedRoute = ({
  children,
  requireAdmin = false, // Eğer `requireAdmin` belirtilmezse, varsayılan olarak `false` kabul edilir.
}: ProtectedRouteProps) => {
  const location = useLocation();
  // `useLocation` ile mevcut sayfanın URL bilgisini alırız. Kullanıcı giriş yapmadığında, giriş yapınca aynı sayfaya dönebilmesi için kullanılır.

  const { user, token, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    // Eğer kimlik doğrulama işlemi hala devam ediyorsa, yükleme göstergesi gösterilir.
    return (
      <Center h="100vh">
        {" "}
        {/* Viewport height birimi, ekranın tamamına göre hesaplanır. Yani %100 yapilmis */}
        {/* Sayfanın ortasına bir yüklenme simgesi yerleştirir */}
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!token || !user) {
    // Eğer oturum açmış kullanıcı yoksa, giriş sayfasına yönlendir.
    return <Navigate to="/login" state={{ from: location }} replace />;
    // `state={{ from: location }}` sayesinde, kullanıcı giriş yaptıktan sonra önceki sayfaya geri dönebilir.
    // `replace` parametresi, tarayıcı geçmişinde geri gidildiğinde giriş sayfasına geri dönülmesini önler.
  }

  if (requireAdmin && !isAdmin) {
    // Eğer bu route sadece adminler içinse (`requireAdmin = true`) ve kullanıcı admin değilse,
    // anasayfaya yönlendir.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
  // Kullanıcı yetkilendirilmişse, bileşenin içeriğini (`children`) göster.
};

export default ProtectedRoute;
// Bileşeni dışa aktar, böylece diğer bileşenler `ProtectedRoute`'u kullanabilir.
