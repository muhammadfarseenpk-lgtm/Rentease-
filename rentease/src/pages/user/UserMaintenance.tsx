import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wrench, Star } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./userHelpers";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";

export default function UserMaintenance() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const { maintenanceTasks } = useApp();
  
  const displayRequests = maintenanceTasks.map(t => {
    return {
      id: t.id,
      product: t.product || "Unknown Product",
      issue: t.issue,
      date: t.dateLogged || "Unknown Date",
      status: t.status,
      p: t.priority || "Medium",
      tech: t.notes,
      resolvedDate: "Unknown"
    };
  });

  const handleRate = (id: string, star: number) => {
    setRatings(prev => ({ ...prev, [id]: star }));
    toast.success("Thanks for your feedback!");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <Card className="rounded-[2rem] bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-brand p-3 shrink-0">
            <Wrench className="w-full h-full" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 text-xl">Request Maintenance Support</h2>
            <p className="text-sm text-gray-500 mt-1">We'll send a technician within 24–48 hours at no cost</p>
          </div>
          <Button onClick={() => setRequestOpen(true)} className="bg-gradient-to-r from-brand to-orange-400 text-white rounded-full h-10 px-5 font-bold text-sm shrink-0 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            New Request
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="font-bold text-gray-900 text-lg mb-4">My Maintenance Requests</h2>
        {displayRequests.length === 0 ? (
          <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6">
            <EmptyState 
              icon={<Wrench className="w-8 h-8" />} 
              title="No maintenance requests" 
              message="You haven't submitted any maintenance requests yet." 
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayRequests.map(r => (
              <Card key={r.id} className="rounded-2xl border-gray-100 shadow-sm bg-white p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-500">{r.id}</span>
                  <StatusBadge label={r.status} />
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${r.p === 'High' ? 'border-red-200 text-red-600 bg-red-50' : r.p === 'Medium' ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-gray-200 text-gray-600 bg-gray-50'}`}>
                    {r.p}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <h3 className="font-bold text-gray-900">{r.product}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{r.issue}</p>

              {r.status === "In Progress" && r.tech && (
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs text-blue-800 font-bold">Technician assigned: {r.tech}</span>
                  <Button variant="ghost" className="text-blue-600 text-xs h-6 px-2 font-bold hover:bg-blue-100" onClick={() => toast.info("Tracking available in app")}>Track technician</Button>
                </div>
              )}

              {r.status === "Resolved" && (
                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs text-green-600 font-bold">Resolved on {r.resolvedDate}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Rate service:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button key={i} onClick={() => handleRate(r.id, i)} className="focus:outline-none">
                          <Star className={`w-4 h-4 ${ratings[r.id] && ratings[r.id] >= i ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-200"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
        )}
      </div>

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-brand" /> Request Maintenance
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Maintenance request submitted! Our team will confirm within 2 hours."); setRequestOpen(false); }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Rented Product</Label>
              <Select required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Modern Sofa">Modern Sofa</SelectItem>
                  <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                  <SelectItem value="Office Chair">Office Chair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issue Type</Label>
              <Select required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select issue" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Physical Damage">Physical Damage</SelectItem>
                  <SelectItem value="Not Working">Not Working</SelectItem>
                  <SelectItem value="Performance Issue">Performance Issue</SelectItem>
                  <SelectItem value="Cosmetic Issue">Cosmetic Issue</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea required placeholder="Describe the issue in detail..." className="rounded-xl border-gray-200 resize-none h-20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Input type="date" required min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} className="rounded-xl border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Select required>
                  <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Slot" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="1">9am–12pm</SelectItem>
                    <SelectItem value="2">12pm–3pm</SelectItem>
                    <SelectItem value="3">3pm–6pm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic mt-2">📷 Photo upload available in app</p>
            <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-4 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">Submit Request</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
