//AuthContext(Global Kimlik Bilgisi) tüm uygulama genelinde kimlik bilgilerini backend’ten alip merkezi bir yerde saklar 
//Bir bileşen useContext ile bu context’e erişebili

import { createContext, useState, ReactNode, useEffect } from "react";
// `createContext`: Yeni bir context oluşturur.
// `useState`: State yönetimi sağlar.
// `ReactNode`: Children prop'u için uygun tiptir.
// `useEffect`: Bileşen mount edildiğinde çalışacak kodlar için kullanılır.

import { authService } from "../services/auth.service";
// authService, kimlik doğrulama ile ilgili API işlemlerini içerir.


// Genel kullanıcı bilgileri. Bu interface, AuthContextType içinde kullanılıyor. 
interface User {
  id: string;           // Kullanıcının benzersiz ID'si
  firstName: string;    // Kullanıcının adı
  lastName: string;     // Kullanıcının soyadı
  email: string;        // Kullanıcının e-posta adresi
  isAdmin: boolean;     // Kullanıcının admin olup olmadığını belirten değer
}

// **AuthContext'in Türü Tanımlanıyor**
interface AuthContextType {
  user: User | null;        // Tum uygulama genelindeki kullanici bilgisi. useState icinde saklanir
  token: string | null;     
  isAdmin: boolean;         
  isLoading: boolean;       
  login: (email: string, password: string) => Promise<void>; // Kullanıcı giriş fonksiyonu
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>; // Kullanıcı kayıt fonksiyonu
  logout: () => void;  // Kullanıcı çıkış fonksiyonu
  updateUser: (user: User) => void; // Yeni gelmis olan kullanici bilgisi. Bununla useState guncellenir
}

// **Context Oluşturuluyor**. Amac prop drilling'i onlemek
const AuthContext = createContext<AuthContextType | null>(null); //Baslangic null degeri sonra AuthProvider ile guncellenecek. 

export { AuthContext }; // Context dışa aktarılıyor


// **AuthProvider Bileşeni** - Uygulamanın tamamına kimlik doğrulama bilgilerini sağlar
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Kullanıcı state'i, AuthContextType'tan ve dolayisiyla User Interface'ten gelir
  const [token, setToken] = useState<string | null>(localStorage.getItem("token")); // LocalStorage'dan varsa token al yoksa null
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu
  const isAdmin = user?.isAdmin || false; // Kullanıcı admin mi kontrol et

  useEffect(() => {
    // Uygulama ilk açıldığında localStorage'dan token kontrol edilir.
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token"); // Tarayıcıda saklanan token alınır
      if (storedToken) {
        try {
          const currentUser = await authService.getCurrentUser(); // API'den kullanıcı verisi çek
          setUser(currentUser);  // Kullanıcıyı state'e kaydet
          setToken(storedToken); // Token'ı güncelle
        } catch (error) {
          console.error("Failed to fetch user:", error); // Hata olursa logla
          logout(); // Kullanıcı çıkış yaptırılır
        }
      }
      setIsLoading(false); // Yükleme tamamlandı
    };

    initAuth(); // Fonksiyonu çağır
  }, []);

  // **Giriş İşlemi** - Kullanıcı giriş yaptığında çağrılır.
  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password }); // API'ye istek at
    setUser(response.user); // Kullanıcıyı state'e kaydet
    setToken(response.accessToken); // Token'ı state'e kaydet
    localStorage.setItem("token", response.accessToken); // Token'ı localStorage'e kaydet
  };

  // **Kayıt İşlemi** - Yeni kullanıcı kaydı yapıldığında çalışır.
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const response = await authService.register({
      firstName,
      lastName,
      email,
      password,
    }); // API'ye istek at
    setUser(response.user); // Yeni kullanıcıyı state'e kaydet
    setToken(response.accessToken); // Token'ı güncelle
    localStorage.setItem("token", response.accessToken); // Token'ı sakla
  };

  // **Çıkış Yap İşlemi**
  const logout = () => {
    setUser(null); // Kullanıcı bilgisini sıfırla
    setToken(null); // Token'ı sıfırla
    localStorage.removeItem("token"); // LocalStorage'dan token'ı kaldır
  };

  // **Kullanıcı Bilgilerini Güncelle**
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser); // Yeni kullanıcı bilgileri state'e yazılır
  };

  if (isLoading) {
    return null; // Yüklenirken hiçbir şey gösterme veya bir yüklenme göstergesi eklenebilir.
  }

  return (
    <AuthContext.Provider
      value={{
        user,        // Kullanıcı bilgileri
        token,       // Token bilgisi
        isAdmin,     // Kullanıcı admin mi?
        isLoading,   // Yüklenme durumu
        login,       // Giriş fonksiyonu
        register,    // Kayıt fonksiyonu
        logout,      // Çıkış fonksiyonu
        updateUser,  // Kullanıcı bilgilerini güncelleme fonksiyonu
      }}
    >
      {children} {/* AuthContext'i tüm uygulamada kullanılabilir hale getirir */}
    </AuthContext.Provider>
  );
};
