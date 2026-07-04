import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LayoutDashboard, Package, Truck, CalendarCheck, Wrench, RefreshCw, ImageIcon, Plus, UserCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

import VendorOverview from "./VendorOverview";
import VendorInventory from "./VendorInventory";
import VendorDelivery from "./VendorDelivery";
import VendorAvailability from "./VendorAvailability";
import VendorMaintenance from "./VendorMaintenance";
import VendorReturns from "./VendorReturns";

export default function VendorDashboard() {
  const { user, logout, addProduct } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [addOpen, setAddOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (user?.role !== "vendor") {
    return <Navigate to="/" replace />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const price = Number(fd.get("price"));
    const category = fd.get("category") as string;
    const description = fd.get("description") as string;
    const sku = fd.get("sku") as string;
    const condition = fd.get("condition") as string;
    const minT = Number(fd.get("minT"));
    const maxT = Number(fd.get("maxT"));
    const stock = Number(fd.get("stock"));

    if (!name || !price || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    const newProduct = {
      id: "PROD-" + Date.now(),
      name,
      price,
      category,
      description: description || "",
      image: imagePreview || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
      inStock: stock > 0,
      minTenure: minT || 3,
      sku: sku || `SKU-${Date.now()}`,
      condition: condition || "Excellent"
    };

    addProduct(newProduct as any);

    toast.success("Product added successfully!");
    setAddOpen(false);
    setImagePreview(null);
  };

  const tabs = [
    { value: "overview",     label: "Overview",      icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { value: "inventory",    label: "Inventory",     icon: <Package className="h-3.5 w-3.5" /> },
    { value: "delivery",     label: "Delivery",      icon: <Truck className="h-3.5 w-3.5" /> },
    { value: "availability", label: "Availability",  icon: <CalendarCheck className="h-3.5 w-3.5" /> },
    { value: "maintenance",  label: "Maintenance",   icon: <Wrench className="h-3.5 w-3.5" /> },
    { value: "returns",      label: "Returns",       icon: <RefreshCw className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="bg-[#fdfaf8] min-h-screen pb-24">
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="container px-6 lg:px-20 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Vendor Dashboard</h1>
            <p className="text-xs text-gray-400">Manage your products and rentals</p>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-9 h-9 rounded-full bg-orange-100 text-brand flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-orange-200 transition-colors"
                  title={user?.name ?? "Profile"}
                >
                  {user?.name?.charAt(0).toUpperCase() ?? "V"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white z-50 rounded-2xl border-gray-100 shadow-lg p-1 w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-brand border border-orange-200 rounded-full px-2 py-0.5">
                    {user?.role}
                  </span>
                </div>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  className="rounded-xl text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-50 px-3 py-2"
                  onClick={() => navigate("/profile")}
                >
                  <UserCircle className="h-4 w-4 mr-2 text-gray-400" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  className="rounded-xl text-sm font-bold text-red-500 cursor-pointer hover:bg-red-50 px-3 py-2"
                  onClick={() => { logout(); navigate("/login"); toast.info("Logged out"); }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-brand to-orange-400 text-white rounded-full h-9 px-4 font-bold text-sm hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product
                </Button>
              </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 mt-2">
            
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-bold">Product Image</Label>
              <div
                className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer
                  ${imagePreview
                    ? "border-brand bg-orange-50/30"
                    : "border-gray-200 bg-gray-50 hover:border-brand hover:bg-orange-50/20"
                  }`}
                onClick={() => document.getElementById("product-image-input")?.click()}
              >
                <input
                  id="product-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-bold">Product Name</Label>
              <Input name="name" required placeholder="e.g. Modern Sofa" className="rounded-xl border-gray-200 focus:border-brand focus:ring-brand/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">Monthly Price (₹)</Label>
                <Input name="price" type="number" required placeholder="4149" className="rounded-xl border-gray-200 focus:border-brand focus:ring-brand/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">Category</Label>
                <Select name="category" required>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-brand focus:ring-brand/20"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Appliances">Appliances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-bold">Description</Label>
              <Textarea name="description" placeholder="Brief product description" className="rounded-xl border-gray-200 resize-none h-20 focus:border-brand focus:ring-brand/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">SKU</Label>
                <Input name="sku" placeholder="FUR-S01" className="rounded-xl border-gray-200 focus:border-brand focus:ring-brand/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">Condition</Label>
                <Select name="condition" required>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-brand focus:ring-brand/20"><SelectValue placeholder="Condition" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">Min Tenure</Label>
                <Select name="minT" required>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-brand focus:ring-brand/20"><SelectValue placeholder="Min" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">Max Tenure</Label>
                <Select name="maxT" required>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-brand focus:ring-brand/20"><SelectValue placeholder="Max" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-bold">Stock Units</Label>
                <Input name="stock" type="number" placeholder="e.g. 3" className="rounded-xl border-gray-200 focus:border-brand focus:ring-brand/20" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-brand to-orange-400 text-white rounded-xl h-11 font-bold mt-4 shadow-sm hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              Save Product
            </Button>
          </form>
        </DialogContent>
      </Dialog>
          </div>
        </div>
      
      <div className="container px-6 lg:px-20 pb-0">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-0 border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.value
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="container px-6 lg:px-20 py-8">
      {activeTab === "overview"     && <VendorOverview />}
      {activeTab === "inventory"    && <VendorInventory onAddProduct={() => setAddOpen(true)} />}
      {activeTab === "delivery"     && <VendorDelivery />}
      {activeTab === "availability" && <VendorAvailability />}
      {activeTab === "maintenance"  && <VendorMaintenance />}
      {activeTab === "returns"      && <VendorReturns />}
    </div>
  </div>
  );
}
