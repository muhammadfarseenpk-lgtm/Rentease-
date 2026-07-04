import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { api, getAuthHeaders } from "@/api";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import type { 
  CartItem, User, Product, Order, InventoryItem, Delivery, 
  ReturnItem, MaintenanceTask, Vendor, Claim,
  Testimonial, Review, Coupon, SupportTicket, Notification
} from "@/types";
import { 
  initialInventory, initialDeliveries, 
  initialReturns, initialMaintenanceTasks, initialUsers, initialVendors, initialClaims,
  initialTestimonials, initialReviews, initialCoupons, initialSupportTickets, initialNotifications
} from "@/data/initialState";

export interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;

  user: User | null;
  login: (u: User, token?: string) => void;
  logout: () => void;

  products: Product[];
  addProduct: (product: Product) => void;

  orders: Order[];
  placeOrder: (order: Order) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;

  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  removeInventoryItem: (id: string) => void;

  deliveries: Delivery[];
  scheduleDelivery: (delivery: Delivery) => void;
  updateDeliveryStatus: (id: string, status: string) => void;

  returns: ReturnItem[];
  logReturn: (returnItem: ReturnItem) => void;
  approveReturn: (id: string) => void;

  maintenanceTasks: MaintenanceTask[];
  maintenanceRequests: MaintenanceTask[];
  logMaintenanceTask: (task: MaintenanceTask) => void;
  addMaintenanceRequest: (task: MaintenanceTask) => void;
  updateMaintenanceStatus: (id: string, status: string) => void;

  users: User[];
  suspendUser: (id: string) => void;
  activateUser: (id: string) => void;

  vendors: Vendor[];
  approveVendor: (id: string) => void;
  suspendVendor: (id: string) => void;
  createVendor: (vendor: Vendor) => void;

  claims: Claim[];
  fileClaim: (claim: Claim) => void;
  resolveClaim: (id: string) => void;

  testimonials: Testimonial[];
  
  reviews: Review[];
  addReview: (review: Review) => void;

  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => void;

  recentlyViewed: string[];
  addToRecentlyViewed: (id: string) => void;

  requestExtension: (orderId: string, newEndDate: string) => void;
  requestEarlyReturn: (orderId: string) => void;

  supportTickets: SupportTicket[];
  createTicket: (ticket: SupportTicket) => void;
  updateTicketStatus: (id: string, status: string) => void;

  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    try {
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [wishlist, setWishlist] = useLocalStorage<string[]>("wishlist", []);
  const [user, setUser] = useState<User | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Keep the rest in local storage for now if they don't have endpoints
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>("inventory", initialInventory);
  const [deliveries, setDeliveries] = useLocalStorage<Delivery[]>("deliveries", initialDeliveries);
  const [returns, setReturns] = useLocalStorage<ReturnItem[]>("returns", initialReturns);
  const [maintenanceTasks, setMaintenanceTasks] = useLocalStorage<MaintenanceTask[]>("maintenanceTasks", initialMaintenanceTasks);
  const [users, setUsers] = useLocalStorage<User[]>("users", initialUsers);
  const [vendors, setVendors] = useLocalStorage<Vendor[]>("vendors", initialVendors);
  const [claims, setClaims] = useLocalStorage<Claim[]>("claims", initialClaims);

  const [testimonials] = useState<Testimonial[]>(initialTestimonials);
  const [reviews, setReviews] = useLocalStorage<Review[]>("reviews", initialReviews);
  const [coupons] = useState<Coupon[]>(initialCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>("recentlyViewed", []);
  const [supportTickets, setSupportTickets] = useLocalStorage<SupportTicket[]>("supportTickets", initialSupportTickets);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("notifications", initialNotifications);

  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize Auth & API Data
  const loadData = useCallback(async () => {
    try {
      const prods = await api.products.getAll();
      setProducts(prods);
      
      const token = localStorage.getItem("accessToken");
      if (token) {
        const u = await api.auth.me();
        setUser(u);
        const ords = await api.orders.getMyOrders();
        setOrders(ords);
        
        // Initialize Socket
        const newSocket = io("http://localhost:4000", {
          auth: { token }
        });
        setSocket(newSocket);
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
      // If auth fails, clear it
      if (localStorage.getItem("accessToken")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isAuthenticated");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    
    socket.on("notification", (msg) => {
      toast.info(msg);
      addNotification({
        id: Date.now().toString(),
        message: msg,
        type: "info",
        read: false,
        createdAt: new Date().toISOString()
      });
    });
    
    return () => {
      socket.off("notification");
    };
  }, [socket]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.tenure === item.tenure);
      if (existing) {
        return prev.map((i) => 
          i.id === item.id && i.tenure === item.tenure 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  const addToWishlist = (id: string) => setWishlist((prev) => Array.from(new Set([...prev, id])));
  const removeFromWishlist = (id: string) => setWishlist((prev) => prev.filter((i) => i !== id));

  const login = (u: User, token?: string) => {
    setUser(u);
    localStorage.setItem("isAuthenticated", "true");
    if (token) {
      localStorage.setItem("accessToken", token);
      loadData(); // reload orders etc.
    }
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const addProduct = (product: Product) => setProducts(prev => [product, ...prev]);

  // Orders
  const placeOrder = async (order: Order) => {
    try {
      const newOrder = await api.orders.create(order);
      setOrders(prev => [newOrder, ...prev]);
    } catch (err) {
      console.error("Order creation failed", err);
      // Fallback to local
      setOrders(prev => [order, ...prev]);
    }
  };
  const updateOrderStatus = (id: string, status: string) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  // Inventory
  const addInventoryItem = (item: InventoryItem) => setInventory(prev => [item, ...prev]);
  const updateInventoryItem = (item: InventoryItem) => setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  const removeInventoryItem = (id: string) => setInventory(prev => prev.filter(i => i.id !== id));

  // Delivery
  const scheduleDelivery = (delivery: Delivery) => setDeliveries(prev => [delivery, ...prev]);
  const updateDeliveryStatus = (id: string, status: string) => setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status } : d));

  // Returns
  const logReturn = (returnItem: ReturnItem) => setReturns(prev => [returnItem, ...prev]);
  const approveReturn = (id: string) => setReturns(prev => prev.map(r => r.id === id ? { ...r, status: "Approved" } : r));

  // Maintenance
  const logMaintenanceTask = (task: MaintenanceTask) => setMaintenanceTasks(prev => [task, ...prev]);
  const updateMaintenanceStatus = (id: string, status: string) => setMaintenanceTasks(prev => prev.map(m => m.id === id ? { ...m, status } : m));

  // Users
  const suspendUser = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, role: "suspended" as any } : u));
  const activateUser = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, role: "user" as any } : u));

  // Vendors
  const approveVendor = (id: string) => setVendors(prev => prev.map(v => v.id === id ? { ...v, status: "Active" } : v));
  const suspendVendor = (id: string) => setVendors(prev => prev.map(v => v.id === id ? { ...v, status: "Suspended" } : v));
  const createVendor = (vendor: Vendor) => setVendors(prev => [vendor, ...prev]);

  // Claims
  const fileClaim = (claim: Claim) => setClaims(prev => [claim, ...prev]);
  const resolveClaim = (id: string) => setClaims(prev => prev.map(c => c.id === id ? { ...c, status: "Resolved" } : c));

  // Reviews
  const addReview = (review: Review) => setReviews(prev => [review, ...prev]);

  // Coupons
  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      setAppliedCoupon(null);
    }
  };

  // Recently Viewed
  const addToRecentlyViewed = (id: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  // Order Extensions & Returns
  const requestExtension = (orderId: string, newEndDate: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Extension Requested" } : o));
  };
  const requestEarlyReturn = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Early Return Requested" } : o));
  };

  // Support Tickets
  const createTicket = (ticket: SupportTicket) => setSupportTickets(prev => [ticket, ...prev]);
  const updateTicketStatus = (id: string, status: string) => setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));

  // Notifications
  const addNotification = (notification: Notification) => setNotifications(prev => [notification, ...prev]);
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <AppContext.Provider
      value={{
        cart, addToCart, removeFromCart, clearCart,
        wishlist, addToWishlist, removeFromWishlist,
        user, login, logout, products, addProduct,
        orders, placeOrder, addOrder: placeOrder, updateOrderStatus,
        inventory, addInventoryItem, updateInventoryItem, removeInventoryItem,
        deliveries, scheduleDelivery, updateDeliveryStatus,
        returns, logReturn, approveReturn,
        maintenanceTasks, maintenanceRequests: maintenanceTasks, logMaintenanceTask, addMaintenanceRequest: logMaintenanceTask, updateMaintenanceStatus,
        users, suspendUser, activateUser,
        vendors, approveVendor, suspendVendor, createVendor,
        claims, fileClaim, resolveClaim,
        testimonials, reviews, addReview,
        coupons, appliedCoupon, applyCoupon,
        recentlyViewed, addToRecentlyViewed,
        requestExtension, requestEarlyReturn,
        supportTickets, createTicket, updateTicketStatus,
        notifications, addNotification, markNotificationRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
