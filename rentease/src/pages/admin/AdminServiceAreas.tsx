import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Search, Edit2, Ban, Check, MapPinned } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./AdminOverview";
import { EmptyState } from "@/components/ui/empty-state";
import { useState } from "react";

export default function AdminServiceAreas() {
  const [city, setCity] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const mockAreas = [
    { id: "SA1", city: "Kozhikode", state: "Kerala", pins: "673001, 673002, 673003", vendors: 2, status: "Active", delivery: "24–48 hrs" },
    { id: "SA2", city: "Thrissur", state: "Kerala", pins: "680001, 680020", vendors: 1, status: "Active", delivery: "48–72 hrs" },
    { id: "SA3", city: "Kochi", state: "Kerala", pins: "682001, 682016, 682024", vendors: 2, status: "Active", delivery: "24–48 hrs" },
    { id: "SA4", city: "Trivandrum", state: "Kerala", pins: "695001, 695003", vendors: 1, status: "Inactive", delivery: "72 hrs" }
  ];

  const filteredAreas = mockAreas.filter(a => 
    a.city.toLowerCase().includes(search.toLowerCase()) || 
    a.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Service area "${city}" added`);
    setDialogOpen(false);
    setCity("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Area Management</h2>
          <p className="text-gray-500 text-sm mt-1">Control delivery coverage across cities</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-brand to-orange-400 text-white rounded-full font-bold shadow-sm">
              Add Area
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add Service Area</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddArea} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={e => setCity(e.target.value)} required className="rounded-xl border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" required className="rounded-xl border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pins">PIN Codes</Label>
                <Textarea id="pins" placeholder="e.g. 673001, 673002" required className="rounded-xl border-gray-200 resize-none h-20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery">Estimated Delivery Time</Label>
                <Input id="delivery" placeholder="e.g. 24-48 hrs" required className="rounded-xl border-gray-200" />
              </div>
              <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-2">
                Create Area
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Service Areas List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by city or state..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-64 rounded-xl border-gray-200"
            />
          </div>
        </div>

        {filteredAreas.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              icon={<MapPinned className="w-8 h-8" />} 
              title="No service areas found" 
              message={search ? `No service areas match your search "${search}"` : "There are currently no service areas in the system."} 
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Area</th>
                  <th className="px-6 py-4">PIN Codes</th>
                  <th className="px-6 py-4">Delivery Time</th>
                  <th className="px-6 py-4">Vendors</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAreas.map((area) => (
                  <tr key={area.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-brand flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{area.city}</p>
                        <p className="text-xs text-gray-500">{area.state}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 max-w-[200px] truncate" title={area.pins}>{area.pins}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{area.delivery}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{area.vendors}</td>
                    <td className="px-6 py-4"><StatusBadge label={area.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-200" onClick={() => toast.info(`Editing ${area.city}`)}>
                          <Edit2 className="h-4 w-4 text-gray-500" />
                        </Button>
                        {area.status === 'Active' ? (
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-red-200 hover:bg-red-50" onClick={() => toast.success(`${area.city} deactivated`)}>
                            <Ban className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-green-200 hover:bg-green-50" onClick={() => toast.success(`${area.city} activated`)}>
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
    </motion.div>
  );
}
