import axios from "axios";

interface ApiErrorResponse {
  success: false;
  message: string;
  data: Record<string, never>;
}

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      // API'den gelen hata formatını kullan
      const apiError = error.response.data as ApiErrorResponse;
      throw new Error(apiError.message);
    } else if (error.request) {
      // İstek yapıldı ama cevap alınamadı
      throw new Error(
        "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin."
      );
    } else {
      // İstek oluşturulurken bir hata oluştu
      throw new Error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  }
);

export default api;
