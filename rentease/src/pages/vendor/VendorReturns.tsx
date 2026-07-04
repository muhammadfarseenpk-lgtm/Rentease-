import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, RefreshCcw, AlertTriangle, CheckCircle2, XCircle, Undo2, ClipboardX, RefreshCw, Truck, Check, Camera } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./vendorHelpers";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";

export default function VendorReturns() {
  const [view, setView] = useState<"Returns" | "Damage">("Returns");
  const [search, setSearch] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [cond, setCond] = useState("Excellent");
  const [repairOpen, setRepairOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { returns, claims, orders, products, users } = useApp();

  const displayReturns = returns.map(r => {
    const order = orders.find(o => o.id === r.orderRef);
    const product = products.find(p => p.id === order?.productId);
    const customer = users.find(u => u.id === order?.userId);
    return {
      id: r.id,
      customer: customer?.name || "Unknown",
      product: product?.name || "Unknown",
      type: r.type,
      date: "Unknown",
      status: r.status,
      condition: r.notes || "—",
      reason: r.type || "General",
      notes: r.notes || ""
    };
  });

  const displayDamages = claims.filter(c => c.type === "Damage").map(c => {
    const order = orders.find(o => o.id === c.orderRef);
    const product = products.find(p => p.id === order?.productId);
    const customer = users.find(u => u.id === order?.userId);
    return {
      id: c.id,
      ref: c.orderRef,
      product: product?.name || "Unknown",
      cust: customer?.name || c.customer,
      desc: c.notes || "Damage claim",
      date: order?.createdAt || "Unknown",
      status: c.status,
      p: "Medium"
    };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<RefreshCw className="w-4 h-4 text-amber-600" />} label="Pending Returns" value="2" iconBg="bg-amber-50" />
        <StatCard icon={<Truck className="w-4 h-4 text-blue-600" />} label="Scheduled Pickups" value="1" iconBg="bg-blue-50" />
        <StatCard icon={<Check className="w-4 h-4 text-green-600" />} label="Completed" value="3" iconBg="bg-green-50" />
        <StatCard icon={<AlertTriangle className="w-4 h-4 text-red-500" />} label="Damage Reports" value="1" iconBg="bg-red-50" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <button onClick={() => setView("Returns")} className={`rounded-full h-9 px-5 text-sm font-bold transition-colors ${view === "Returns" ? "bg-brand text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Returns</button>
          <button onClick={() => setView("Damage")} className={`rounded-full h-9 px-5 text-sm font-bold transition-colors ${view === "Damage" ? "bg-brand text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Damage Reports</button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-full bg-white" />
        </div>
      </div>

      {view === "Returns" ? (
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white overflow-hidden overflow-x-auto">
          {displayReturns.filter(r => r.customer.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <div className="p-6">
              <EmptyState 
                icon={<ClipboardX className="w-8 h-8" />} 
                title="No returns found" 
                message={search ? `No returns match your search "${search}"` : "You currently have no return requests."} 
              />
            </div>
          ) : (
            <table className="w-full text-sm text-left min-w-[900px]">
              <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
                <tr>
                  <th className="px-6 py-5">Return ID</th><th className="px-6 py-5">Customer</th><th className="px-6 py-5">Product</th>
                  <th className="px-6 py-5">Return Type</th><th className="px-6 py-5">Scheduled Date</th><th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Condition</th><th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayReturns.filter(r => r.customer.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{r.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{r.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{r.product}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${r.type === 'Damage Claim' ? 'bg-red-50 text-red-700 border-red-200' : r.type === 'Early Return' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{r.type}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{r.date}</td>
                    <td className="px-6 py-4"><StatusBadge label={r.status} /></td>
                    <td className="px-6 py-4">{r.condition !== "—" ? <StatusBadge label={r.condition} /> : "—"}</td>
                    <td className="px-6 py-4 text-right">
                      {r.status !== "Completed" && (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" className="h-8 rounded-full text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => toast.success(`Pickup scheduled for ${r.product}`)}>Schedule Pickup</Button>
                          <Button variant="outline" className="h-8 rounded-full text-xs font-bold border-green-200 text-green-700 hover:bg-green-50" onClick={() => setApproveOpen(true)}>Approve Return</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {displayDamages.map(d => (
            <Card key={d.id} className="rounded-2xl border-gray-100 shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${d.p === 'High' ? 'bg-red-50 text-red-600' : d.p === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500">{d.id}</span>
                  <StatusBadge label={d.p} />
                  <StatusBadge label={d.status} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4">{d.product}</h3>
              <p className="text-xs text-gray-500 mt-1">{d.cust} • {d.ref}</p>
              <p className="text-sm text-gray-600 mt-3">{d.desc}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">{d.date}</span>
                {d.status !== "Resolved" && (
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-full px-4 text-xs font-bold border-orange-200 text-brand hover:bg-orange-50" onClick={() => setRepairOpen(true)}>Log Repair Cost</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full h-9 px-4 text-xs font-bold" onClick={() => toast.success(`${d.id} resolved`)}>Resolve</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-bold">Approve Return</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Return approved"); setApproveOpen(false); }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Condition on Return</Label>
              <Select value={cond} onValueChange={setCond} required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {cond === "Damaged" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Damage Notes</Label>
                  <Textarea required className="rounded-xl border-gray-200 resize-none h-20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-bold">Damage Photo Proof</Label>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer
                      ${photoPreview ? "border-brand bg-orange-50/30" : "border-gray-200 bg-gray-50 hover:border-brand hover:bg-orange-50/20"}`}
                    onClick={() => document.getElementById("return-damage-photo")?.click()}
                  >
                    <input
                      id="return-damage-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setPhotoPreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {photoPreview ? (
                      <div className="relative">
                        <img src={photoPreview} alt="Damage Preview" className="w-full h-32 object-cover rounded-2xl" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPhotoPreview(null); }}
                          className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-red-500 text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                          <Camera className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-xs font-bold text-gray-500">Upload photo evidence</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Refund/Penalty</Label>
              <Select required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">No action</SelectItem>
                  <SelectItem value="partial">Partial refund</SelectItem>
                  <SelectItem value="full">Full refund</SelectItem>
                  <SelectItem value="penalty">Apply penalty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-4">Approve</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={repairOpen} onOpenChange={setRepairOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-bold">Log Repair Cost</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Repair cost logged"); setRepairOpen(false); }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Repair Cost (₹)</Label>
              <Input type="number" required className="rounded-xl border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea required className="rounded-xl border-gray-200 resize-none h-20" />
            </div>
            <div className="space-y-2">
              <Label>Charged To</Label>
              <Select required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select party" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-4">Log Cost</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
