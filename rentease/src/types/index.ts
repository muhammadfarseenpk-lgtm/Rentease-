export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  isDefault: boolean;
  type?: string;
  street?: string;
  state?: string;
  zipCode?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "vendor" | "admin";
  addresses?: Address[];
  loginHistory?: string[];
  notificationPrefs?: { email: boolean; sms: boolean; promos: boolean };
}

export interface PricingTier {
  months: number;
  monthlyRate: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  inStock: boolean;
  popularity?: number;
  createdAt?: string;
  minTenure?: number;
  deposit?: number;
  pricingTiers?: PricingTier[];
  blackoutDates?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  tenure: string;
  startDate?: string;
  endDate?: string;
  deposit?: number;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  tenure: number;
  amount: number;
  status: string;
  createdAt: string;
}

export interface InventoryItem extends Product {
  sku: string;
  condition: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  date: string;
  status: string;
  notes?: string;
}

export interface ReturnItem {
  id: string;
  orderRef: string;
  product: string;
  customer: string;
  type: string;
  status: string;
  notes?: string;
}

export interface MaintenanceTask {
  id: string;
  product: string;
  issue: string;
  dateLogged: string;
  status: string;
  notes?: string;
  priority?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  products: number;
  revenue: number;
  status: string;
  rating?: number;
  activeRentals?: number;
}

export interface Claim {
  id: string;
  type: string;
  orderRef: string;
  customer: string;
  status: string;
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  productCategory: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  validUntil: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  title?: string;
  date?: string;
  type?: string;
}
