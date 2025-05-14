import api from "./api";

export interface Vehicle {
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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const vehicleService = {
  async getAllVehicles(): Promise<Vehicle[]> {
    const { data } = await api.get<ApiResponse<Vehicle[]>>("/vehicles");
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const { data } = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  async deleteVehicle(id: string): Promise<void> {
    const { data } = await api.delete<ApiResponse<void>>(`/vehicles/${id}`);
    if (!data.success) {
      throw new Error(data.message);
    }
  },

  async updateVehicle(
    id: string,
    vehicleData: Partial<Vehicle>
  ): Promise<Vehicle> {
    const { data } = await api.patch<ApiResponse<Vehicle>>(
      `/vehicles/${id}`,
      vehicleData
    );
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },

  async createVehicle(
    vehicleData: Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "isBooked">
  ): Promise<Vehicle> {
    const { data } = await api.post<ApiResponse<Vehicle>>(
      "/vehicles",
      vehicleData
    );
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  },
};
