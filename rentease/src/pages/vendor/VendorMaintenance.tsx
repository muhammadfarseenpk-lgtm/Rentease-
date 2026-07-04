import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wrench, CheckCircle, Search, AlertTriangle, Camera, DollarSign, Wrench as WrenchIcon } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./vendorHelpers";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";

export default function VendorMaintenance() {
  const [noteOpen, setNoteOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { maintenanceTasks } = useApp();

  const displayTasks = maintenanceTasks.map(t => {
    return {
      id: t.id,
      product: t.product || "Unknown Product",
      issue: t.issue,
      date: t.dateLogged || "Unknown",
      p: t.priority || "Medium",
      status: t.status,
      cust: "Unknown",
      notes: t.notes
    };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Wrench className="w-4 h-4 text-red-600" />} label="Open Tasks" value="2" iconBg="bg-red-50" />
        <StatCard icon={<Wrench className="w-4 h-4 text-amber-600" />} label="In Progress" value="1" iconBg="bg-amber-50" />
        <StatCard icon={<CheckCircle className="w-4 h-4 text-green-600" />} label="Resolved" value="4" iconBg="bg-green-50" />
        <StatCard icon={<AlertTriangle className="w-4 h-4 text-red-500" />} label="High Priority" value="1" iconBg="bg-red-50" />
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-3 flex-wrap flex-1">
          <Select defaultValue="All">
            <SelectTrigger className="w-[140px] rounded-xl border-gray-200"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="All">
            <SelectTrigger className="w-[140px] rounded-xl border-gray-200"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Priority</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search tasks..." className="pl-9 w-full sm:w-64 rounded-xl border-gray-200" />
          </div>
        </div>
        <Button variant="outline" className="border-gray-200 rounded-full h-10 px-5 font-bold text-sm hover:bg-gray-50" onClick={() => setLogOpen(true)}>
          Log Task
        </Button>
      </div>

      {displayTasks.length === 0 ? (
        <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
          <EmptyState 
            icon={<WrenchIcon className="w-8 h-8" />} 
            title="No maintenance tasks" 
            message="There are currently no maintenance tasks logged." 
          />
        </div>
      ) : (
        <div className="space-y-4">
          {displayTasks.map(t => (
          <Card key={t.id} className="rounded-2xl border-gray-100 shadow-sm bg-white overflow-hidden p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${t.p === 'High' ? 'bg-red-50 text-red-600' : t.p === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500">{t.id}</span>
                  <StatusBadge label={t.p} />
                  <StatusBadge label={t.status} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.product}</h3>
                <p className="text-sm text-gray-600 mt-1">{t.issue}</p>
                {t.notes && <div className="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500 mt-3 border border-gray-100">{t.notes}</div>}
                <div className="flex items-center gap-3 mt-4 text-xs text-gray-400 font-medium">
                  <span>{t.date}</span>
                  <span>•</span>
                  <span>Customer: {t.cust}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                {t.status === 'Resolved' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-200">
                    ✓ Resolved
                  </span>
                ) : (
                  <>
                    <Button variant="outline" className="h-9 rounded-full px-4 text-xs" onClick={() => setNoteOpen(true)}>Add Note</Button>
                    {t.status === 'Open' ? (
                      <Button variant="outline" className="h-9 rounded-full px-4 text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => toast.info(`${t.id} started`)}>Start Work</Button>
                    ) : (
                      <Button className="h-9 rounded-full px-4 text-xs font-bold bg-green-600 hover:bg-green-700 text-white" onClick={() => { setSelectedTaskId(t.id); setResolveOpen(true); }}>Mark Resolved</Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-bold">Add Note</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Note added"); setNoteOpen(false); }} className="space-y-4 mt-2">
            <Textarea required placeholder="Add update or note..." className="rounded-xl border-gray-200 resize-none h-24" />
            <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-2">Save Note</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-xl font-bold">Log Maintenance Task</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            toast.success("Task logged"); 
            setLogOpen(false); 
            setPhotoPreview(null);
          }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-gray-700 font-bold">Damage Photo</Label>
              <div
                className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer
                  ${photoPreview ? "border-brand bg-orange-50/30" : "border-gray-200 bg-gray-50 hover:border-brand hover:bg-orange-50/20"}`}
                onClick={() => document.getElementById("damage-photo-input")?.click()}
              >
                <input
                  id="damage-photo-input"
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
                    <p className="text-xs font-bold text-gray-500">Upload damage photo</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select required>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Modern Sofa">Modern Sofa</SelectItem>
                  <SelectItem value="Smart TV">Smart TV</SelectItem>
                  <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issue</Label>
              <Textarea required className="rounded-xl border-gray-200 resize-none h-20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select required>
                  <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estimated Cost (₹)</Label>
                <Input type="number" placeholder="500" className="rounded-xl border-gray-200" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand text-white rounded-xl h-11 font-bold mt-4">Submit Task</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-bold">Resolve Task</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            toast.success("Task marked as resolved"); 
            setResolveOpen(false); 
          }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Final Cost (₹)</Label>
              <Input type="number" required placeholder="e.g. 1500" className="rounded-xl border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label>Resolution Notes</Label>
              <Textarea required placeholder="What was fixed?" className="rounded-xl border-gray-200 resize-none h-24" />
            </div>
            <Button type="submit" className="w-full bg-green-600 text-white rounded-xl h-11 font-bold mt-2 hover:bg-green-700">Confirm Resolution</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
