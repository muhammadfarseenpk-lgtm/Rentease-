import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, Tags, Edit2, Archive, Trash2, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./AdminOverview";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function AdminInventory() {
  const [inventorySearch, setInventorySearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState(["Furniture", "Appliances", "Electronics", "Fitness"]);
  const [newCat, setNewCat] = useState("");

  const { inventory, vendors } = useApp();
  
  const displayInventory = inventory.map(item => {
    const vendorIndex = item.id.charCodeAt(item.id.length - 1) % vendors.length;
    const vendor = vendors[vendorIndex] || vendors[0];
    
    return {
      ...item,
      vendor: vendor?.name || "Acme Furniture Co.",
      vendorId: vendor?.id || "v1",
      stock: item.inStock ? 4 : 0,
      price: toINR(item.price),
      image: item.image || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80"
    };
  });

  const filteredInventory = displayInventory.filter(i => 
    (i.name.toLowerCase().includes(inventorySearch.toLowerCase()) || (i.sku || "").toLowerCase().includes(inventorySearch.toLowerCase())) &&
    (vendorFilter === "All" || i.vendorId === vendorFilter)
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package className="w-6 h-6" />} label="Total SKUs" value="5" color="bg-orange-50 text-brand" />
        <StatCard icon={<Package className="w-6 h-6" />} label="In Stock" value="4" color="bg-green-50 text-green-600" />
        <StatCard icon={<Package className="w-6 h-6" />} label="Out of Stock" value="1" color="bg-red-50 text-red-600" />
        <StatCard icon={<Package className="w-6 h-6" />} label="Excellent Condition" value="2" color="bg-amber-50 text-amber-600" />
      </div>

      <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Inventory Directory</h2>
          <div className="flex gap-3 flex-wrap items-center">
            <Button variant="outline" className="border-gray-200 rounded-full h-10 px-4 text-xs font-bold" onClick={() => setCategoryOpen(true)}>
              <Tags className="w-4 h-4 mr-1.5" /> Manage Categories
            </Button>
            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger className="w-[160px] rounded-xl border-gray-200"><SelectValue placeholder="Vendor" /></SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">All Vendors</SelectItem>
                {vendors.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or SKU..." 
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="pl-9 w-full sm:w-64 rounded-xl border-gray-200"
              />
            </div>
          </div>
        </div>

        {filteredInventory.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              icon={<PackageSearch className="w-8 h-8" />} 
              title="No items found" 
              message="Try adjusting your filters or search query." 
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Price/mo</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.sku}</td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-gray-600">{item.vendor}</td>
                    <td className="px-6 py-4"><StatusBadge label={item.condition} /></td>
                    <td className="px-6 py-4">
                      {item.stock === 0 ? (
                        <span className="text-red-500 font-bold">Out of Stock</span>
                      ) : (
                        <span className="text-gray-900 font-bold">{item.stock} units</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold">{item.price}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" className="h-8 text-xs px-3 rounded-full border-gray-200" onClick={() => toast.info(`Editing ${item.name}`)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-bold">Manage Categories</DialogTitle></DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="New Category Name" 
                value={newCat} 
                onChange={(e) => setNewCat(e.target.value)} 
                className="rounded-xl border-gray-200"
              />
              <Button onClick={() => {
                if(newCat.trim()) {
                  setCategories([...categories, newCat.trim()]);
                  setNewCat("");
                  toast.success("Category added");
                }
              }} className="bg-brand text-white rounded-xl font-bold shadow-sm px-4 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                Add
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {categories.map((c, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-900 text-sm">{c}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full" onClick={() => {
                    setCategories(categories.filter(cat => cat !== c));
                    toast.error("Category removed");
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
