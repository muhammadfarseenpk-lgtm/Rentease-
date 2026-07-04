import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Ban, Check, Building2, Users, Activity, ShoppingCart, MessageSquare, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./AdminOverview";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function AdminUsers() {
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activityOpen, setActivityOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const { users, orders, vendors, suspendUser, activateUser, approveVendor, suspendVendor } = useApp();

  const displayUsers = users.map(u => {
    const userOrders = orders.filter(o => o.userId === u.id);
    const spend = userOrders.reduce((sum, o) => sum + o.amount, 0);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.role === "suspended" as any ? "Suspended" : "Active",
      joined: "Unknown",
      orders: userOrders.length,
      spend: toINR(spend, true)
    };
  });

  const filteredUsers = displayUsers.filter(u => 
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
    (roleFilter === "All" || u.role === roleFilter) &&
    (statusFilter === "All" || u.status === statusFilter)
  );

  const displayVendors = vendors.map(v => ({
    ...v,
    revenue: toINR(v.revenue, true),
    area: "Global"
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Users" value="1,249" color="bg-blue-50 text-blue-600" />
        <StatCard icon={<Building2 className="w-6 h-6" />} label="Vendors" value="3" color="bg-orange-50 text-brand" />
        <StatCard icon={<Check className="w-6 h-6" />} label="Pending KYC" value="1" color="bg-amber-50 text-amber-600" />
        <StatCard icon={<Ban className="w-6 h-6" />} label="Suspended" value="1" color="bg-red-50 text-red-600" />
      </div>

      <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">All Users</h2>
          <div className="flex gap-3 flex-wrap">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[120px] rounded-xl border-gray-200"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] rounded-xl border-gray-200"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or email..." 
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 w-full sm:w-64 rounded-xl border-gray-200"
              />
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              icon={<UsersIcon className="w-8 h-8" />} 
              title="No users found" 
              message="Try adjusting your filters or search query." 
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Spend</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-brand font-bold flex items-center justify-center shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full capitalize">{u.role}</span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge label={u.status} /></td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{u.orders}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">{u.spend}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{u.joined}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-200" onClick={() => { setSelectedUser(u); setActivityOpen(true); }}>
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        {u.status === "Active" ? (
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-red-200 hover:bg-red-50" onClick={() => { suspendUser(u.id); toast.error(`${u.name} suspended`); }}>
                            <Ban className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-green-200 hover:bg-green-50" onClick={() => { activateUser(u.id); toast.success(`${u.name} activated`); }}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Vendors</h2>
          <Button className="bg-gradient-to-r from-brand to-orange-400 text-white rounded-full font-bold shadow-sm" onClick={() => toast.info("Use Create Vendor in header")}>
            New Vendor
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold">
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Area</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayVendors.map((v) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{v.name}</p>
                      <p className="text-xs text-gray-500">{v.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{v.products}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">{v.revenue}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{v.area}</td>
                  <td className="px-6 py-4"><StatusBadge label={v.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-green-200 hover:bg-green-50" onClick={() => { approveVendor(v.id); toast.success(`Approved ${v.name}`); }}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-red-200 hover:bg-red-50" onClick={() => { suspendVendor(v.id); toast.error(`Rejected ${v.name}`); }}>
                        <Ban className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand" /> 
              {selectedUser?.name}'s Activity Log
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-brand text-lg">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  <div className="mt-1 flex gap-2">
                    <StatusBadge label={selectedUser.status} />
                    <span className="text-[10px] font-bold bg-gray-200 px-2 py-0.5 rounded-full capitalize">{selectedUser.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative border-l border-gray-200 ml-3 space-y-6 mt-6 pb-4">
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-brand ring-4 ring-white" />
                  <p className="text-sm font-bold text-gray-900">Account Created</p>
                  <p className="text-xs text-gray-500 mt-1">User signed up for RentEase</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Jan 10, 2024</p>
                </div>
                
                {selectedUser.orders > 0 && (
                  <div className="relative pl-6">
                    <div className="absolute -left-[10px] top-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center ring-4 ring-white text-blue-600">
                      <ShoppingCart className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Placed {selectedUser.orders} Orders</p>
                    <p className="text-xs text-gray-500 mt-1">Total spend: {selectedUser.spend}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Recently active</p>
                  </div>
                )}
                
                <div className="relative pl-6">
                  <div className="absolute -left-[10px] top-0 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center ring-4 ring-white text-brand">
                    <MessageSquare className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Support Interaction</p>
                  <p className="text-xs text-gray-500 mt-1">Contacted support regarding delivery</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">2 weeks ago</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
