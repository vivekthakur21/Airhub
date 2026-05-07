const BASE = import.meta.env.VITE_API_URL || "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("staybnb-token");
  
  const isFormData = options.body instanceof FormData;
  
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data as T;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  token: string;
  role?: "user" | "admin";
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalHotels: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface MonthlyStat {
  _id: string;
  revenue: number;
  bookings: number;
}

export interface HotelStat {
  name: string;
  bookings: number;
  revenue: number;
}

export interface DetailedAnalytics {
  monthlyData: MonthlyStat[];
  hotelData: HotelStat[];
}

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    request<AuthUser>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

export const paymentApi = {
  createOrder: (amount: number, listingId: string, checkIn: string, checkOut: string, currency: string) =>
    request<RazorpayOrder>("/payments/order", {
      method: "POST",
      body: JSON.stringify({ amount, listingId, checkIn, checkOut, currency }),
    }),

  verifyPayment: (paymentData: any) =>
    request<any>("/payments/verify", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),
};

export const bookingApi = {
  getUserBookings: () =>
    request<any[]>("/bookings", {
      method: "GET",
    }),
  
  deleteBooking: (id: string) =>
    request<any>(`/bookings/${id}`, {
      method: "DELETE",
    }),
};

export const adminApi = {
  getStats: () => request<AdminStats>("/admin/stats"),
  getAnalytics: () => request<MonthlyStat[]>("/admin/analytics"),
  getDetailedAnalytics: () => request<DetailedAnalytics>("/admin/analytics/detailed"),
  getUsers: () => request<AuthUser[]>("/admin/users"),
  deleteUser: (id: string) => request<any>(`/admin/users/${id}`, { method: "DELETE" }),
  getBookings: () => request<any[]>("/admin/bookings"),
  getSettings: () => request<any>("/admin/settings"),
  updateSettings: (data: any) => request<any>("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
  
  // Hotel management (CRUD)
  getHotels: (params?: { location?: string, category?: string, minPrice?: number, maxPrice?: number }) => {
    const query = new URLSearchParams();
    if (params?.location) query.append("location", params.location);
    if (params?.category) query.append("category", params.category);
    if (params?.minPrice) query.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice) query.append("maxPrice", params.maxPrice.toString());
    const queryString = query.toString();
    return request<any>(`/listings${queryString ? `?${queryString}` : ""}`);
  },
  getHotelById: (id: string) => request<any>(`/listings/${id}`),
  createHotel: (data: any) => request<any>("/listings", { method: "POST", body: data }),
  updateHotel: (id: string, data: any) => request<any>(`/listings/${id}`, { method: "PUT", body: data }),
  deleteHotel: (id: string) => request<any>(`/listings/${id}`, { method: "DELETE" }),
};
