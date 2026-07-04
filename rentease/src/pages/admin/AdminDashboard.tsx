import { useState } from "react";
import { useApp } from "@/hooks/useApp";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FileText, UserPlus, UserCircle, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Package, ShoppingCart, AlertTriangle, BarChart3, MapPin, Activity } from "lucide-react";

import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminInventory from "./AdminInventory";
import AdminOrders from "./AdminOrders";
import AdminClaims from "./AdminClaims";
import AdminReports from "./AdminReports";
import AdminServiceAreas from "./AdminServiceAreas";

export default function AdminDashboard() {
  const { user, logout, createVendor } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [vendorDialog, setVendorDialog] = useState(false);
  const [vendorForm, setVendorForm] = useState({ name: "", email: "", phone: "", area: "", password: "" });

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    
    createVendor({
      id: `V${Date.now()}`,
      name: vendorForm.name,
      revenue: 0,
      rating: 5.0,
      activeRentals: 0,
      status: "Active"
    });
    
    toast.success(`Vendor account created for ${vendorForm.name}`);
    setVendorDialog(false);
    setVendorForm({ name: "", email: "", phone: "", area: "", password: "" });
  };

  return (
    <div className="bg-[#fdfaf8] min-h-screen pb-24">
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        {/* Row 1 */}
        <div className="container px-6 lg:px-20 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
            <p className="text-xs text-gray-400">RentEase platform control center</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Profile avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-9 h-9 rounded-full bg-blue-100 text-admin flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                  title={user?.name ?? "Admin Profile"}
                >
                  {user?.name?.charAt(0).toUpperCase() ?? "A"}
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

            {/* Export */}
            <Button variant="outline" className="rounded-full h-9 px-4 border-gray-200 text-gray-600 font-bold text-xs"
              onClick={() => toast.success("Report exported!")}>
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
            
            {/* Create Vendor */}
            <Dialog open={vendorDialog} onOpenChange={setVendorDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-full h-9 px-4 bg-gradient-to-r from-brand to-orange-400 text-white font-bold text-xs shadow hover:shadow-[0_0_16px_rgba(249,115,22,0.4)] transition-all">
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Create Vendor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Create Vendor</DialogTitle>
                  <p className="text-sm text-brand font-medium">Only admins can create vendor accounts.</p>
                </DialogHeader>
                <form onSubmit={handleCreateVendor} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input required value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" required value={vendorForm.email} onChange={e => setVendorForm({...vendorForm, email: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input required value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Service Area</Label>
                    <Input required value={vendorForm.area} onChange={e => setVendorForm({...vendorForm, area: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Temporary Password</Label>
                    <Input type="password" required value={vendorForm.password} onChange={e => setVendorForm({...vendorForm, password: e.target.value})} className="rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full bg-brand text-white rounded-xl h-12 font-bold mt-2">
                    Create Account
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Row 2: tabs — underline style, horizontally scrollable */}
        <div className="container px-6 lg:px-20">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-gray-100">
            {[
              { value: "overview",   label: "Overview",          icon: <Activity className="h-3.5 w-3.5" /> },
              { value: "users",      label: "Users",             icon: <Users className="h-3.5 w-3.5" /> },
              { value: "inventory",  label: "Inventory",         icon: <Package className="h-3.5 w-3.5" /> },
              { value: "orders",     label: "Orders & Rentals",  icon: <ShoppingCart className="h-3.5 w-3.5" /> },
              { value: "claims",     label: "Disputes",          icon: <AlertTriangle className="h-3.5 w-3.5" /> },
              { value: "reports",    label: "Reports",           icon: <BarChart3 className="h-3.5 w-3.5" /> },
              { value: "areas",      label: "Service Areas",     icon: <MapPin className="h-3.5 w-3.5" /> },
            ].map(tab => (
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
        {activeTab === "overview"  && <AdminOverview onNavigate={setActiveTab} />}
        {activeTab === "users"     && <AdminUsers />}
        {activeTab === "inventory" && <AdminInventory />}
        {activeTab === "orders"    && <AdminOrders />}
        {activeTab === "claims"    && <AdminClaims />}
        {activeTab === "reports"   && <AdminReports />}
        {activeTab === "areas"     && <AdminServiceAreas />}
      </div>
    </div>
  );
}
