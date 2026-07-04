import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, Wrench, Clock, User as UserIcon, UserCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

import UserRentals from "./UserRentals";
import UserMaintenance from "./UserMaintenance";
import UserHistory from "./UserHistory";

export default function UserDashboard() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("rentals");

  if (!user || user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated!");
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
    navigate("/login");
  };

  return (
    <div className="bg-[#fdfaf8] min-h-screen pb-24">
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        {/* Row 1 */}
        <div className="container px-6 lg:px-20 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">My Account</h1>
            <p className="text-xs text-gray-400">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-9 h-9 rounded-full bg-orange-100 text-brand flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-orange-200 transition-colors"
                  title={user.name ?? "Profile"}
                >
                  {initial}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white z-50 rounded-2xl border-gray-100 shadow-lg p-1 w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-brand border border-orange-200 rounded-full px-2 py-0.5">
                    {user.role}
                  </span>
                </div>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  className="rounded-xl text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-50 px-3 py-2"
                  onClick={() => setActiveTab("profile")}
                >
                  <UserCircle className="h-4 w-4 mr-2 text-gray-400" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  className="rounded-xl text-sm font-bold text-red-500 cursor-pointer hover:bg-red-50 px-3 py-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Row 2 */}
        <div className="container px-6 lg:px-20">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-gray-100">
            {[
              { value: "rentals",     label: "Rentals",      icon: <Package className="h-3.5 w-3.5" /> },
              { value: "maintenance", label: "Maintenance",  icon: <Wrench className="h-3.5 w-3.5" /> },
              { value: "history",     label: "History",      icon: <Clock className="h-3.5 w-3.5" /> },
              { value: "profile",     label: "Profile",      icon: <UserIcon className="h-3.5 w-3.5" /> },
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
        {activeTab === "rentals"     && <UserRentals onNavigate={setActiveTab} />}
        {activeTab === "maintenance" && <UserMaintenance />}
        {activeTab === "history"     && <UserHistory />}
        
        {activeTab === "profile" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-orange-100 text-brand text-3xl font-bold flex items-center justify-center mb-4">
                  {initial}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>

              <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-8">
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue={user.name} required className="rounded-xl border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input type="tel" placeholder="+91 98765 43210" className="rounded-xl border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea placeholder="House/Flat No, Street, City, State, PIN" className="rounded-xl border-gray-200 resize-none h-24" />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 text-white rounded-xl h-11 font-bold mt-2">
                    Save Changes
                  </Button>
                </form>
              </Card>

              <div className="text-center mt-8">
                <Button variant="outline" onClick={handleLogout} className="border-red-200 text-red-500 hover:bg-red-50 rounded-full px-6 h-10 font-bold">
                  Log out
                </Button>
              </div>
            </div>
        )}
      </div>
    </div>
  );
}
