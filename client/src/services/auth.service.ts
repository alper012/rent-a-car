import api from "./api";
// Axios örneğini içe aktarıyoruz. API istekleri bu örnek üzerinden yapılır.

// Login işlemi için gerekli giriş bilgilerini tanımlayan arayüz
interface LoginCredentials {
  email: string;
  password: string;
}

// Kayıt (register) işlemi için gerekli kullanıcı bilgilerini tanımlar
interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

//maxH ve minH 100vh

// Sunucudan dönen kullanıcı nesnesinin yapısı
//Bu sadece frontend (TypeScript) tarafında bir tip tanımıdır.
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

// Genel API cevabı yapısı; T, dönen verinin türünü belirtir (generic)
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Login/register işlemlerinde dönen yanıt yapısı: token + kullanıcı bilgisi içerir
interface AuthResponseData {
  accessToken: string;
  user: User;
}

// authService: login, register ve kullanıcı verisini alma gibi işlemleri gerçekleştiren servis nesnesi
export const authService = {
  // Giriş yapma işlemi
  async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    // POST isteği ile /auths/login endpoint'ine giriş bilgileri gönderilir
    const { data } = await api.post<ApiResponse<AuthResponseData>>(
      "/auths/login",
      credentials
    );

    // Sunucudan gelen yanıt başarılı değilse hata fırlatılır
    if (!data.success) {
      throw new Error(data.message);
    }

    // Başarılıysa kullanıcı bilgisi ve token döner
    return data.data;
  },

  // Kayıt olma işlemi
  async register(credentials: RegisterCredentials): Promise<AuthResponseData> {
    const { data } = await api.post<ApiResponse<AuthResponseData>>( //response type'i API'den gelen
      "/auths/register", //sunucu tarafinda tanimlanmis bir endpoint
      credentials
    );

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },

  // Giriş yapan kullanıcının verilerini almak için kullanılır (örneğin: profil sayfası için)
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/auths/me");

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },
};
