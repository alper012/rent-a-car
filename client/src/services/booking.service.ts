import api from "./api"; // Axios API instance'ını içe aktarır

// Rezervasyon oluşturmak için gereken minimum bilgiler
interface CreateBookingRequest {
  vehicleId: string;
  startDate: string;
  endDate: string;
}

// Araç detaylarını temsil eden tip tanımı
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  priceADay: number;
  seats: number;
  power: number;
  fuelType: string;
  transmission: string;
  image: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Rezervasyon verisinin yapısını tanımlar
export interface Booking {
  id: string;
  vehicleId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle; // İlgili araç bilgisi
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  }; // Opsiyonel kullanıcı bilgisi (admin için görünür)
}

// API yanıtlarını standart hale getiren generic yapı
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Rezervasyon işlemleriyle ilgili servis fonksiyonları
export const bookingService = {
  // Yeni bir rezervasyon oluşturur
  async createBooking(booking: CreateBookingRequest): Promise<Booking> {
    const { data } = await api.post<ApiResponse<Booking>>("/bookings", booking);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  // Giriş yapan kullanıcının kendi rezervasyonlarını getirir
  async getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get<ApiResponse<Booking[]>>("/bookings/my");
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  // (Admin) Sistemdeki tüm rezervasyonları getirir
  async getAllBookings(): Promise<Booking[]> {
    const { data } = await api.get<ApiResponse<Booking[]>>("/bookings");
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  // (Admin) Bir rezervasyonun durumunu günceller
  async updateBookingStatus(
    id: string,
    status: "APPROVED" | "REJECTED" | "COMPLETED"
  ): Promise<Booking> {
    const { data } = await api.patch<ApiResponse<Booking>>(`/bookings/${id}`, {
      status,
    });
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },
};
