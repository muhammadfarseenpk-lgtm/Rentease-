import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Package, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./userHelpers";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function UserRentals({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [extendOpen, setExtendOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [activeRental, setActiveRental] = useState<any>(null);

  const { orders, products, user } = useApp();
  
  const displayRentals = orders
    .filter(o => o.userId === user?.id && o.status === "Active")
    .map(o => {
      const product = products.find(p => p.id === o.productId);
      return {
        id: o.id,
        name: product?.name || "Unknown Product",
        tenure: `${o.tenure} months`,
        price: o.amount,
        start: o.createdAt,
        end: "Unknown",
        status: o.status,
        elapsed: 1,
        totalM: typeof o.tenure === 'string' ? parseInt(o.tenure) : o.tenure || 6
      };
    });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-shadow overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0"><Package className="w-6 h-6 text-brand" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate">Active Rentals</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">3</p>
          </div>
        </Card>
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-shadow overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0"><Calendar className="w-6 h-6 text-red-500" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate">Due This Month</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">1</p>
          </div>
        </Card>
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-shadow overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0"><DollarSign className="w-6 h-6 text-green-600" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate">Total Spent</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">{toINR(449.97)}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {displayRentals.length === 0 ? (
          <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6">
            <EmptyState 
              icon={<Package className="w-8 h-8" />} 
              title="No active rentals" 
              message="You don't have any active rentals at the moment." 
            />
          </Card>
        ) : displayRentals.map(r => {
          const pct = (r.elapsed / r.totalM) * 100;
          return (
            <Card key={r.id} className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{r.name}</h3>
                    <span className="bg-orange-50 text-brand border border-orange-200 rounded-full px-3 py-0.5 text-xs font-bold inline-block mt-1">{r.tenure}</span>
                  </div>
                </div>
                <StatusBadge label={r.status} />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5 text-sm">
                <div><span className="text-gray-500 block text-xs">Monthly</span><span className="font-bold text-gray-900">{toINR(r.price)}</span></div>
                <div><span className="text-gray-500 block text-xs">Started</span><span className="font-medium text-gray-900">{r.start}</span></div>
                <div><span className="text-gray-500 block text-xs">Returns</span><span className="font-medium text-gray-900">{r.end}</span></div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-1">{r.elapsed} of {r.totalM} months completed</p>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: mounted ? `${pct}%` : 0 }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-brand to-orange-400" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-5">
                <Button variant="outline" className="rounded-full h-9 px-4 text-xs font-bold border-gray-200" onClick={() => { setActiveRental(r); setExtendOpen(true); }}>Extend Tenure</Button>
                <Button variant="outline" className="rounded-full h-9 px-4 text-xs font-bold border-red-200 text-red-500 hover:bg-red-50" onClick={() => { setActiveRental(r); setReturnOpen(true); }}>Schedule Return</Button>
                <Button variant="ghost" className="text-brand text-xs font-bold h-9 px-4" onClick={() => onNavigate ? onNavigate("maintenance") : toast.info("Go to Maintenance tab")}>Request Maintenance</Button>
              </div>
            </Card>
          );
        })
        }
      </div>

      <Dialog open={extendOpen} onOpenChange={setExtendOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-bold">Extend Tenure</DialogTitle></DialogHeader>
          {activeRental && (
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Tenure extended!"); setExtendOpen(false); }} className="space-y-4 mt-2">
              <div className="p-3 bg-gray-50 rounded-xl mb-2">
                <p className="text-sm font-bold text-gray-900">{activeRental.name}</p>
                <p className="text-xs text-gray-500">Current end date: {activeRental.end}</p>
              </div>
              <div className="space-y-2">
                <Label>Extend by</Label>
                <Select required>
                  <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select duration" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-brand font-bold bg-orange-50 p-2 rounded-lg">Extension charged at your current rate: {toINR(activeRental.price)}/mo</p>
              <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-2">Confirm Extension</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-bold">Schedule Return</DialogTitle></DialogHeader>
          {activeRental && (
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Return request submitted. We'll contact you to confirm pickup."); setReturnOpen(false); }} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Return Reason</Label>
                <Select required>
                  <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="end">End of Tenure</SelectItem>
                    <SelectItem value="moving">Moving</SelectItem>
                    <SelectItem value="upgrade">Upgrading</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Pickup Date</Label>
                <Input type="date" required className="rounded-xl border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea className="rounded-xl border-gray-200 resize-none h-20" />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-bold mt-2">Submit Return Request</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
