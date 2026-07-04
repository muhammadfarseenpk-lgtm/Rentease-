import type { 
  Product, 
  Order, 
  CartItem, 
  InventoryItem, 
  Delivery, 
  ReturnItem, 
  MaintenanceTask, 
  User, 
  Vendor, 
  Claim,
  Testimonial,
  Review,
  Coupon,
  SupportTicket,
  Notification
} from "@/types"

export const initialProducts: Product[] = [
  { id: "1", name: "Modern Sofa", category: "furniture", price: 49.99, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"], description: "Comfortable modern sofa", inStock: true, popularity: 95, createdAt: "2026-01-01", minTenure: 1, deposit: 100, pricingTiers: [{months: 1, monthlyRate: 59.99}, {months: 3, monthlyRate: 49.99}, {months: 6, monthlyRate: 39.99}] },
  { id: "2", name: "Dining Table", category: "furniture", price: 29.99, image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800"], description: "Wooden dining table", inStock: true, popularity: 80, createdAt: "2026-02-15", minTenure: 3, deposit: 50, pricingTiers: [{months: 3, monthlyRate: 29.99}, {months: 6, monthlyRate: 24.99}] },
  { id: "3", name: "Smart TV", category: "appliances", price: 89.99, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800"], description: "55-inch 4K Smart TV", inStock: false, popularity: 99, createdAt: "2026-03-10", minTenure: 1, deposit: 150, pricingTiers: [{months: 1, monthlyRate: 99.99}, {months: 3, monthlyRate: 89.99}] },
  { id: "4", name: "Refrigerator", category: "appliances", price: 69.99, image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800"], description: "Double-door refrigerator", inStock: true, popularity: 85, createdAt: "2026-01-20", minTenure: 6, deposit: 200, pricingTiers: [{months: 6, monthlyRate: 69.99}, {months: 12, monthlyRate: 59.99}] },
  { id: "5", name: "Office Chair", category: "furniture", price: 19.99, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800"], description: "Ergonomic office chair", inStock: true, popularity: 90, createdAt: "2026-04-01", minTenure: 1, deposit: 30, pricingTiers: [{months: 1, monthlyRate: 24.99}, {months: 3, monthlyRate: 19.99}] },
  { id: "6", name: "Washing Machine", category: "appliances", price: 59.99, image: "https://images.unsplash.com/photo-1626806787426-5910811b6325?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1626806787426-5910811b6325?auto=format&fit=crop&q=80&w=800"], description: "Front-load washing machine", inStock: true, popularity: 75, createdAt: "2026-05-15", minTenure: 3, deposit: 120, pricingTiers: [{months: 3, monthlyRate: 64.99}, {months: 6, monthlyRate: 59.99}] },
]
export const initialCart: CartItem[] = []
export const initialOrders: Order[] = []

export const initialTestimonials: Testimonial[] = [
  { id: "t1", name: "Sarah J.", rating: 5, text: "RentEase made furnishing my new apartment a breeze. The quality of the furniture is outstanding!", productCategory: "furniture" },
  { id: "t2", name: "Michael R.", rating: 4, text: "Got a great TV for the big game without the long-term commitment. Delivery was super fast.", productCategory: "appliances" },
  { id: "t3", name: "Emily C.", rating: 5, text: "Highly recommend for short-term stays. Their deposit process is very transparent.", productCategory: "furniture" }
]

export const initialReviews: Review[] = [
  { id: "r1", productId: "1", userName: "Alex D.", rating: 5, comment: "Super comfy and looks great in my living room.", date: "2026-06-10" },
  { id: "r2", productId: "1", userName: "Jamie T.", rating: 4, comment: "Good sofa, easy to maintain.", date: "2026-05-22" }
]

export const initialCoupons: Coupon[] = [
  { code: "WELCOME10", discountPercent: 10, validUntil: "2027-12-31" },
  { code: "SUMMER20", discountPercent: 20, validUntil: "2026-08-31" }
]

// Vendor dashboard initial state
export const initialInventory: InventoryItem[] = []
export const initialDeliveries: Delivery[] = []
export const initialReturns: ReturnItem[] = []
export const initialMaintenanceTasks: MaintenanceTask[] = []

// Admin dashboard initial state
export const initialUsers: User[] = []
export const initialVendors: Vendor[] = []
export const initialAdminOrders: Order[] = []
export const initialClaims: Claim[] = []

export const initialSupportTickets: SupportTicket[] = []
export const initialNotifications: Notification[] = []

