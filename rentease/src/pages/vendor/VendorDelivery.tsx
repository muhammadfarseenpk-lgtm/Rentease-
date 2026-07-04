import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Truck, RefreshCw, Check, AlertCircle, MapPin, Calendar, List, Camera, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./vendorHelpers";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";

export default function VendorDelivery() {
  const [view, setView] = useState<"Deliveries" | "Pickups">("Deliveries");
  const [displayMode, setDisplayMode] = useState<"List" | "Calendar">("List");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [podOpen, setPodOpen] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [podPreview, setPodPreview] = useState<string | null>(null);

  const { deliveries, returns, orders, products, updateDeliveryStatus } = useApp();

  const displayDeliveries = deliveries.map(d => {
    const order = orders.find(o => o.id === d.orderId);
    const product = products.find(p => p.id === order?.productId);
    return {
      id: d.id,
      customer: d.customer,
      product: product?.name || "Unknown Product",
      address: d.address,
      date: d.date,
      time: "10am–1pm",
      status: d.status
    };
  });

  const displayPickups = returns.map(r => {
    const order = orders.find(o => o.id === r.orderRef);
    const product = products.find(p => p.id === order?.productId);
    return {
      id: r.id,
      customer: r.customer,
      product: product?.name || "Unknown Product",
      address: "12 MG Road",
      date: "Unknown",
      reason: r.type,
      status: r.status,
      condition: r.notes || "—"
    };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Truck className="w-4 h-4 text-blue-600" />} label="Scheduled Today" value="3" iconBg="bg-blue-50" />
        <StatCard icon={<RefreshCw className="w-4 h-4 text-amber-600" />} label="Pending Pickups" value="2" iconBg="bg-amber-50" />
        <StatCard icon={<Check className="w-4 h-4 text-green-600" />} label="Completed" value="18" iconBg="bg-green-50" />
        <StatCard icon={<AlertCircle className="w-4 h-4 text-red-500" />} label="Failed" value="1" iconBg="bg-red-50" />
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          <button 
            onClick={() => setView("Deliveries")} 
            className={`rounded-full h-9 px-5 text-sm font-bold transition-colors ${view === "Deliveries" ? "bg-brand text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            Deliveries
          </button>
          <button 
            onClick={() => setView("Pickups")} 
            className={`rounded-full h-9 px-5 text-sm font-bold transition-colors ${view === "Pickups" ? "bg-brand text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            Pickups
          </button>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-full border border-gray-200 shadow-sm">
          <button onClick={() => setDisplayMode("List")} className={`flex items-center gap-1.5 h-8 px-4 rounded-full text-xs font-bold transition-all ${displayMode === 'List' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <List className="w-3.5 h-3.5" /> List
          </button>
          <button onClick={() => setDisplayMode("Calendar")} className={`flex items-center gap-1.5 h-8 px-4 rounded-full text-xs font-bold transition-all ${displayMode === 'Calendar' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <Calendar className="w-3.5 h-3.5" /> Calendar
          </button>
        </div>
      </div>

      {displayMode === "List" ? (
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white overflow-hidden overflow-x-auto">
          {(view === "Deliveries" ? displayDeliveries.length : displayPickups.length) === 0 ? (
            <div className="p-6">
              <EmptyState 
                icon={<Truck className="w-8 h-8" />} 
                title={view === "Deliveries" ? "No deliveries found" : "No pickups found"} 
                message={`There are currently no scheduled ${view.toLowerCase()}.`} 
              />
            </div>
          ) : (
            <table className="w-full text-sm text-left min-w-[900px]">
              <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
                <tr>
                  {view === "Deliveries" ? (
                    <>
                      <th className="px-6 py-5">Delivery ID</th><th className="px-6 py-5">Customer</th><th className="px-6 py-5">Product</th>
                      <th className="px-6 py-5">Address</th><th className="px-6 py-5">Scheduled Date</th><th className="px-6 py-5">Time Slot</th>
                      <th className="px-6 py-5">Status</th><th className="px-6 py-5 text-right">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-5">Pickup ID</th><th className="px-6 py-5">Customer</th><th className="px-6 py-5">Product</th>
                      <th className="px-6 py-5">Address</th><th className="px-6 py-5">Return Date</th><th className="px-6 py-5">Reason</th>
                      <th className="px-6 py-5">Status</th><th className="px-6 py-5">Condition</th><th className="px-6 py-5 text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {view === "Deliveries" ? (
                  displayDeliveries.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{d.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{d.customer}</td>
                      <td className="px-6 py-4 text-gray-600">{d.product}</td>
                      <td className="px-6 py-4 text-gray-600 flex items-center gap-1.5 text-xs"><MapPin className="h-3 w-3 text-gray-400"/> {d.address}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{d.date}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{d.time}</td>
                      <td className="px-6 py-4"><StatusBadge label={d.status} /></td>
                      <td className="px-6 py-4 text-right">
                        {d.status !== "Completed" && (
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" className="h-8 rounded-full text-xs font-bold border-green-200 text-green-700 hover:bg-green-50" onClick={() => { setSelectedDeliveryId(d.id); setPodOpen(true); }}>
                              Mark Delivered
                            </Button>
                            <Button variant="outline" className="h-8 rounded-full text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => setRescheduleOpen(true)}>
                              Reschedule
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  displayPickups.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{p.customer}</td>
                      <td className="px-6 py-4 text-gray-600">{p.product}</td>
                      <td className="px-6 py-4 text-gray-600 flex items-center gap-1.5 text-xs"><MapPin className="h-3 w-3 text-gray-400"/> {p.address}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{p.date}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{p.reason}</td>
                      <td className="px-6 py-4"><StatusBadge label={p.status} /></td>
                      <td className="px-6 py-4">{p.condition !== "—" ? <StatusBadge label={p.condition} /> : "—"}</td>
                      <td className="px-6 py-4 text-right">
                        {p.status !== "Completed" && (
                          <div className="flex justify-end gap-2">
                            <Button className="h-8 rounded-full text-xs font-bold bg-green-600 hover:bg-green-700 text-white" onClick={() => toast.success(`${p.id} pickup confirmed`)}>
                              Confirm Pickup
                            </Button>
                            <Button variant="outline" className="h-8 rounded-full text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => setConditionOpen(true)}>
                              Log Condition
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </Card>
      ) : (
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Calendar View Active</h3>
          <p className="text-gray-500 max-w-md mx-auto">This is a placeholder for the calendar view showing scheduled deliveries and pickups across the month.</p>
        </Card>
      )}

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Reschedule Delivery</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Rescheduled successfully"); setRescheduleOpen(false); }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>New Date</Label>
              <Input type="date" required className="rounded-xl border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label>Time Slot</Label>
              <Select required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select slot" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">9am–12pm</SelectItem>
                  <SelectItem value="2">10am–1pm</SelectItem>
                  <SelectItem value="3">2pm–5pm</SelectItem>
                  <SelectItem value="4">3pm–6pm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea className="rounded-xl border-gray-200 resize-none h-20" />
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white rounded-xl h-11 font-bold mt-4 hover:bg-blue-700">
              Reschedule
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={conditionOpen} onOpenChange={setConditionOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Log Condition</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Condition logged"); setConditionOpen(false); }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select condition" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea className="rounded-xl border-gray-200 resize-none h-24" />
            </div>
            <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-4">
              Save Condition
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={podOpen} onOpenChange={setPodOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Proof of Delivery (POD)</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (selectedDeliveryId) updateDeliveryStatus(selectedDeliveryId, "Completed");
            toast.success("Delivery marked as completed!"); 
            setPodOpen(false); 
            setPodPreview(null);
          }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-gray-700 font-bold">Upload POD Photo</Label>
              <div
                className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer
                  ${podPreview ? "border-brand bg-orange-50/30" : "border-gray-200 bg-gray-50 hover:border-brand hover:bg-orange-50/20"}`}
                onClick={() => document.getElementById("pod-image-input")?.click()}
              >
                <input
                  id="pod-image-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPodPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {podPreview ? (
                  <div className="relative">
                    <img src={podPreview} alt="POD Preview" className="w-full h-40 object-cover rounded-2xl" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPodPreview(null); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                      <Camera className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-500">Take or upload photo</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Notes</Label>
              <Textarea className="rounded-xl border-gray-200 resize-none h-20" placeholder="e.g. Left at front door" />
            </div>
            <Button type="submit" className="w-full bg-green-600 text-white rounded-xl h-11 font-bold mt-4 hover:bg-green-700">
              Submit POD
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
