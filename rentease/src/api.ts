const API_URL = "http://localhost:4000/api";

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  auth: {
    login: async (credentials: any) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }
      return res.json();
    },
    me: async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    }
  },
  products: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    }
  },
  orders: {
    create: async (orderData: any) => {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },
    getMyOrders: async () => {
      const res = await fetch(`${API_URL}/orders/my`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    }
  }
};
