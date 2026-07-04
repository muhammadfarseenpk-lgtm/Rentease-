import { useState } from "react";
import { useApp } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Package, Save, Camera, Wrench, Clock, PauseCircle, HelpCircle, Eye, EyeOff, MapPin, Plus, Trash2, Bell, Smartphone, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { toINR } from "@/lib/utils";

export default function Profile() {
  const { user, orders, products } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: "home", street: "", city: "", state: "", zipCode: "" });
  const [notifications, setNotifications] = useState({ email: true, push: false, sms: true });

  if (!user) return null; // Protected route handles redirect

  const userOrders = orders.filter(o => o.userId === user?.id);
  
  const timelineData = userOrders.map(o => {
    const product = products.find(p => p.id === o.productId);
    return {
      id: o.id,
      item: product?.name || "Unknown Item",
      status: o.status === "active" ? "Active" : o.status === "completed" ? "Past" : "Upcoming",
      date: `Ordered ${new Date(o.createdAt).toLocaleDateString()}`,
      nextBilling: o.status === "active" ? "Next Month" : "-",
      amount: toINR(product?.price || 0, true),
      active: o.status === "active"
    }
  });

  // Fallback if no real orders yet
  const displayTimeline = timelineData.length > 0 ? timelineData : [
    { id: "ORD-1234", item: "Modern Sofa", status: "Active", date: "Started Jan 15, 2026", nextBilling: "Oct 1, 2026", amount: toINR(49.99, true), active: true },
    { id: "ORD-5678", item: "Smart TV", status: "Upcoming", date: "Arriving Sep 30, 2026", nextBilling: "Oct 5, 2026", amount: toINR(89.99, true), active: false },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Password change validation
    if (newPassword || currentPassword) {
      if (!currentPassword) {
        toast.error("Enter your current password");
        return;
      }
      if (newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }
    toast.success("Profile updated successfully!");
    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Address saved!");
    setShowAddressForm(false);
    setNewAddress({ type: "home", street: "", city: "", state: "", zipCode: "" });
  };

  const handleDeleteAddress = (id: string) => {
    toast.success("Address removed!");
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification preferences updated!");
  };

  const QuickActionBtn = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-brand hover:text-white group transition-all duration-300"
    >
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 group-hover:text-brand shadow-sm mb-3">
        {icon}
      </div>
      <span className="text-sm font-bold text-gray-700 group-hover:text-white text-center">{label}</span>
    </button>
  );

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-12 pb-24">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Account</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your profile and active rentals.</p>
          </div>
        </motion.div>

        <div className={user?.role === 'user' ? "grid md:grid-cols-12 gap-8" : "max-w-2xl mx-auto"}>
          
          {/* Left Column: Profile Info & Quick Actions */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className={user?.role === 'user' ? "md:col-span-4 space-y-8" : "space-y-8"}>
            <Card className="rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                
                {/* Avatar with mockup upload */}
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="relative group cursor-pointer">
                    <div className="h-28 w-28 rounded-full bg-orange-100 flex items-center justify-center text-brand shadow-inner overflow-hidden border-4 border-white">
                      <UserIcon className="h-12 w-12" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm" onClick={() => toast.info("Avatar upload modal opened")}>
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h2>
                  <div className="inline-flex items-center rounded-full border border-orange-200 px-3 py-1 mt-2 text-xs font-bold capitalize bg-orange-50 text-brand">
                    {user.role} Account
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-bold">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-brand focus:ring-brand/20"
                      />
                    </div>
                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-bold">Email</Label>
                      <Input
                        value={user.email}
                        disabled
                        className="rounded-xl h-12 bg-gray-100 border-transparent text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400">Email cannot be changed</p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Change Password <span className="font-normal normal-case">(leave blank to keep current)</span>
                      </p>

                      {/* Current Password */}
                      <div className="space-y-2 mb-3">
                        <Label className="text-gray-700 font-bold">Current Password</Label>
                        <div className="relative">
                          <Input
                            type={showCurrentPass ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-brand pr-11"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowCurrentPass(v => !v)}
                          >
                            {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2 mb-3">
                        <Label className="text-gray-700 font-bold">New Password</Label>
                        <div className="relative">
                          <Input
                            type={showNewPass ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-brand pr-11"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowNewPass(v => !v)}
                          >
                            {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {/* Strength indicator */}
                        {newPassword && (
                          <div className="flex gap-1 mt-1">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                                newPassword.length >= i * 3
                                  ? i <= 1 ? "bg-red-400"
                                  : i <= 2 ? "bg-amber-400"
                                  : i <= 3 ? "bg-blue-400"
                                  : "bg-green-500"
                                  : "bg-gray-100"
                              }`} />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-bold">Confirm New Password</Label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className={`rounded-xl h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-brand ${
                            confirmPassword && confirmPassword !== newPassword
                              ? "border-red-300 focus:border-red-400"
                              : ""
                          }`}
                        />
                        {confirmPassword && confirmPassword !== newPassword && (
                          <p className="text-xs text-red-500 font-bold">Passwords do not match</p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-brand to-orange-400 text-white rounded-xl h-12 font-bold shadow-sm hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
                      >
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-xl h-12 border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                        onClick={() => {
                          setIsEditing(false);
                          setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <Label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Email Address</Label>
                      <div className="text-gray-900 font-medium mt-1 text-base">{user.email}</div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-12 border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile & Password
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            {user?.role === 'user' && (
            <Card className="rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden bg-white">
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">Saved Addresses</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddressForm(!showAddressForm)} className="h-8 w-8 text-brand bg-orange-50 rounded-full hover:bg-orange-100">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 font-bold">Type</Label>
                        <Input value={newAddress.type} onChange={e => setNewAddress({...newAddress, type: e.target.value})} placeholder="Home/Office" className="h-9 text-xs" required />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 font-bold">PIN</Label>
                        <Input value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})} placeholder="673001" className="h-9 text-xs" required />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500 font-bold">Street</Label>
                      <Input value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} placeholder="Full street address" className="h-9 text-xs" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 font-bold">City</Label>
                        <Input value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="City" className="h-9 text-xs" required />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 font-bold">State</Label>
                        <Input value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} placeholder="State" className="h-9 text-xs" required />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setShowAddressForm(false)} className="flex-1 h-8 text-xs">Cancel</Button>
                      <Button type="submit" className="flex-1 h-8 text-xs bg-brand text-white font-bold">Save</Button>
                    </div>
                  </form>
                )}

                {user.addresses?.map(addr => (
                  <div key={addr.id} className="border border-gray-100 rounded-xl p-4 relative group">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-brand" />
                      <span className="font-bold text-gray-900 capitalize text-sm">{addr.type}</span>
                      {addr.isDefault && <span className="bg-orange-50 text-brand text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto">Default</span>}
                    </div>
                    <p className="text-xs text-gray-500 pr-8">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
            )}

            {/* Notification Preferences */}
            <Card className="rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">Email Updates</p>
                      <p className="text-xs text-gray-500">Order status and promotions</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications.email} onChange={() => toggleNotification('email')} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">Push Notifications</p>
                      <p className="text-xs text-gray-500">Delivery tracking alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications.push} onChange={() => toggleNotification('push')} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">SMS Alerts</p>
                      <p className="text-xs text-gray-500">OTP and security alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications.sms} onChange={() => toggleNotification('sms')} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {user?.role === 'user' && (
            <Card className="rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <QuickActionBtn icon={<Wrench />} label="Raise Ticket" onClick={() => toast.success("Support ticket portal opened")} />
                <QuickActionBtn icon={<Clock />} label="Extend Tenure" onClick={() => toast.success("Tenure extension menu opened")} />
                <QuickActionBtn icon={<PauseCircle />} label="Pause Sub" onClick={() => toast.success("Subscription pause settings opened")} />
                <QuickActionBtn icon={<HelpCircle />} label="Help Center" onClick={() => toast.success("Redirecting to help center")} />
              </CardContent>
            </Card>
            )}

          </motion.div>

          {/* Right Column: Rental Timeline */}
          {user?.role === 'user' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-8 space-y-8">
            
            <h2 className="text-2xl font-bold text-gray-900 px-2">Your Rental Timeline</h2>
            
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x custom-scrollbar">
              {displayTimeline.map((item) => (
                <div key={item.id} className={`min-w-[300px] snap-start rounded-[2.5rem] p-8 border transition-all ${item.active ? 'bg-white border-brand/30 shadow-lg relative overflow-hidden' : 'bg-white border-gray-100 shadow-sm opacity-80 hover:opacity-100'}`}>
                  
                  {item.active && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10 opacity-30" />
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === 'Active' ? 'bg-green-100 text-green-700' : item.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </div>
                    <Package className={`w-6 h-6 ${item.active ? 'text-brand' : 'text-gray-400'}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.item}</h3>
                  <p className="text-sm font-medium text-gray-400 mb-6">{item.id}</p>

                  <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Timeline</p>
                      <p className="text-sm font-medium text-gray-900">{item.date}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Next Billing</p>
                        <p className="text-sm font-medium text-gray-900">{item.nextBilling}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{item.amount}</p>
                        <p className="text-[10px] text-gray-400 font-medium">/mo</p>
                      </div>
                    </div>
                  </div>

                  {item.active && (
                    <Button variant="outline" className="w-full rounded-xl border-brand text-brand hover:bg-brand hover:text-white font-bold h-12">
                      Manage Plan
                    </Button>
                  )}
                </div>
              ))}
            </div>

          </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
