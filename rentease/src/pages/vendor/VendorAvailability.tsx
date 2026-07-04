import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, CheckCircle2, ShoppingBag, XCircle, CalendarOff } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./vendorHelpers";
import { useApp } from "@/hooks/useApp";

export default function VendorAvailability() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [stockOpen, setStockOpen] = useState(false);
  const [blackoutOpen, setBlackoutOpen] = useState(false);

  const { inventory, orders, users } = useApp();

  const displayGrid = inventory.map(item => {
    const activeOrders = orders.filter(o => o.productId === item.id && o.status === "Active");
    return {
      name: item.name,
      total: item.inStock ? 4 : 0,
      rented: activeOrders.length,
      avail: item.inStock ? 4 - activeOrders.length : 0,
      nextRet: "Unknown"
    };
  });

  const displayRentals = orders.filter(o => o.status === "Active").map(o => {
    const product = inventory.find(p => p.id === o.productId);
    const customer = users.find(u => u.id === o.userId);
    return {
      id: o.id,
      customer: customer?.name || "Unknown",
      product: product?.name || "Unknown",
      start: `Started ${o.createdAt}`,
      ret: `Returns Unknown`,
      ten: `${o.tenure} mo tenure`,
      soon: false
    };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
          <StatCard icon={<CheckCircle2 className="w-4 h-4 text-green-600" />} label="Available Now" value="3" iconBg="bg-green-50" />
          <StatCard icon={<ShoppingBag className="w-4 h-4 text-blue-600" />} label="Currently Rented" value="1" iconBg="bg-blue-50" />
          <StatCard icon={<XCircle className="w-4 h-4 text-red-500" />} label="Out of Stock" value="1" iconBg="bg-red-50" />
        </div>
        <Button onClick={() => setBlackoutOpen(true)} className="bg-gradient-to-r from-brand to-orange-400 text-white rounded-full h-11 px-6 font-bold shadow-sm hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all">
          <CalendarOff className="w-4 h-4 mr-2" /> Blackout Dates
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {displayGrid.map((p, i) => {
          let status = p.avail === 0 && p.rented === 0 ? "Out of Stock" : p.avail === 0 && p.rented > 0 ? "Rented" : "Available";
          let bg = p.avail === p.total && p.total > 0 ? "bg-green-400" : p.avail > 0 ? "bg-brand" : "bg-red-400";
          let pct = p.total === 0 ? 0 : (p.avail / p.total) * 100;
          return (
            <Card key={i} className="rounded-[2rem] border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                  </div>
                </div>
                <StatusBadge label={status} />
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1.5">{p.avail} of {p.total} units available</p>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: mounted ? `${pct}%` : 0 }} transition={{ duration: 0.8 }} className={`h-full ${bg}`} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex justify-between"><span className="text-gray-500">Total Units</span><span className="font-bold">{p.total}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Rented</span><span className="font-bold">{p.rented}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Available</span><span className="font-bold">{p.avail}</span></div>
                <div className="flex justify-between mt-2"><span className="text-gray-500 font-bold uppercase tracking-wider">Next Return</span><span className="font-bold text-gray-900">{p.nextRet}</span></div>
              </div>

              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 rounded-full h-8 px-3 text-xs font-bold border-gray-200" onClick={() => setStockOpen(true)}>Add Stock</Button>
                <Button variant="ghost" className="flex-1 text-brand text-xs font-bold h-8 px-3" onClick={() => toast.info(`Showing rentals for ${p.name}`)}>View Rentals</Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white mt-8 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Active Rental Timeline</h2>
          <p className="text-sm text-gray-400">Current rentals and return dates</p>
        </div>
        <div className="divide-y divide-gray-100">
          {displayRentals.map((r, i) => (
            <div key={i} className="px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-50/50 transition-colors gap-4">
              <div className="flex-1">
                <p className="font-bold text-gray-900">{r.customer}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.product} • {r.id}</p>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <span className="bg-orange-50 text-brand px-2 py-0.5 rounded-full font-bold text-xs">{r.ten}</span>
                <span className="text-xs text-gray-500">{r.start}</span>
              </div>
              <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                <span className={`text-sm font-bold ${r.soon ? 'text-red-500' : 'text-gray-900'}`}>{r.ret}</span>
                <Button variant="ghost" className="text-brand text-xs h-8 px-2" onClick={() => toast.info("Extend request sent")}>Extend</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={stockOpen} onOpenChange={setStockOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Stock</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Stock added"); setStockOpen(false); }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Units to Add</Label>
              <Input type="number" min="1" required className="rounded-xl border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Condition" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea className="rounded-xl border-gray-200 resize-none h-20" />
            </div>
            <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-4">
              Save Stock
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={blackoutOpen} onOpenChange={setBlackoutOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Blackout Dates</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Blackout dates added"); setBlackoutOpen(false); }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Product (Optional)</Label>
              <Select>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Apply to all products" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Products</SelectItem>
                  {inventory.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" required className="rounded-xl border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" required className="rounded-xl border-gray-200" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input placeholder="e.g. Warehouse closed, Holiday" required className="rounded-xl border-gray-200" />
            </div>
            <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-4">
              Set Blackout Dates
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
