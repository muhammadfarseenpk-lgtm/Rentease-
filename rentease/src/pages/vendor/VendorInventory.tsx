import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Package, Trash2, CheckCircle2, XCircle, IndianRupee, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./vendorHelpers";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function VendorInventory({ onAddProduct }: { onAddProduct: () => void }) {
  const [inventorySearch, setInventorySearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { products: inventory } = useApp();

  const displayInventory = inventory.map(item => ({
    id: item.id,
    name: item.name,
    sku: (item as any).sku || `SKU-${item.id}`,
    category: item.category,
    condition: (item as any).condition || "Excellent",
    stock: item.inStock ? 4 : 0,
    price: item.price.toFixed(2),
    minT: "3 months",
    maxT: "12 months"
  }));

  const filtered = displayInventory.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(inventorySearch.toLowerCase()) || i.sku.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCat = categoryFilter === "All" || i.category === categoryFilter;
    const matchesCond = conditionFilter === "All" || i.condition === conditionFilter;
    return matchesSearch && matchesCat && matchesCond;
  });

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${editingProduct?.name} updated successfully`);
    setEditOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Package className="w-4 h-4 text-gray-500" />} label="Total SKUs" value="5" iconBg="bg-gray-100" />
        <StatCard icon={<CheckCircle2 className="w-4 h-4 text-green-600" />} label="In Stock" value="4" iconBg="bg-green-50" />
        <StatCard icon={<XCircle className="w-4 h-4 text-red-500" />} label="Out of Stock" value="1" iconBg="bg-red-50" />
        <StatCard icon={<IndianRupee className="w-4 h-4 text-brand" />} label="Avg Price" value={toINR(51.99, true)} iconBg="bg-orange-50" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search name or SKU..." 
            value={inventorySearch}
            onChange={(e) => setInventorySearch(e.target.value)}
            className="pl-9 w-full sm:w-64 rounded-xl border-gray-200 h-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px] rounded-xl h-10 border-gray-200">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Furniture">Furniture</SelectItem>
            <SelectItem value="Appliances">Appliances</SelectItem>
          </SelectContent>
        </Select>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-[140px] rounded-xl h-10 border-gray-200">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">All Conditions</SelectItem>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          <div className="relative">
            <input 
              type="file" 
              accept=".csv" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={(e) => {
                if (e.target.files?.length) {
                  toast.success("CSV uploaded successfully! Processing products...");
                }
              }} 
            />
            <Button variant="outline" className="border-gray-200 rounded-full h-10 px-4 font-bold text-gray-700 pointer-events-none">
              Bulk CSV
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white rounded-full h-10 px-5 font-bold" onClick={onAddProduct}>
            Add Product
          </Button>
        </div>
      </div>

      <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white overflow-hidden overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              icon={<PackageSearch className="w-8 h-8" />} 
              title="No items found" 
              message={inventorySearch ? `No items match your search "${inventorySearch}"` : "You haven't added any products to your inventory yet."} 
            />
          </div>
        ) : (
          <table className="w-full text-sm text-left min-w-[900px]">
            <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
              <tr>
                <th className="px-6 py-5">Product</th>
                <th className="px-6 py-5">SKU</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price/mo</th>
                <th className="px-6 py-5">Min–Max Tenure</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-6 py-5">Condition</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.sku}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{item.category}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">₹{item.price}<span className="text-gray-400 text-xs font-medium">/mo</span></td>
                  <td className="px-6 py-4 text-gray-600 font-medium text-xs">{item.minT} – {item.maxT}</td>
                  <td className="px-6 py-4">
                    {item.stock === 0 ? <span className="text-red-500 font-bold">Out of Stock</span> : <span className="text-gray-900 font-bold">{item.stock} units</span>}
                  </td>
                  <td className="px-6 py-4"><StatusBadge label={item.condition} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {item.stock > 0 ? (
                        <button className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full" onClick={() => toast.info(`${item.name} marked as Paused`)}>Live</button>
                      ) : (
                        <button className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full" onClick={() => toast.info(`${item.name} marked as Live`)}>Paused</button>
                      )}
                      <Button variant="outline" className="h-8 px-3 text-xs font-bold rounded-full border-gray-200" onClick={() => { setEditingProduct(item); setEditOpen(true); }}>
                        Edit
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-red-200 hover:bg-red-50 text-red-500" onClick={() => toast.error(`${item.name} removed`)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleEditSave} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input required defaultValue={editingProduct.name} className="rounded-xl border-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Price (₹)</Label>
                  <Input type="number" step="0.01" required defaultValue={editingProduct.price} className="rounded-xl border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select defaultValue={editingProduct.category}>
                    <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Appliances">Appliances</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea className="rounded-xl border-gray-200 resize-none h-20" placeholder="Brief product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input defaultValue={editingProduct.sku} className="rounded-xl border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select defaultValue={editingProduct.condition}>
                    <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Min Tenure</Label>
                  <Select defaultValue={editingProduct.minT}>
                    <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Tenure</Label>
                  <Select defaultValue={editingProduct.maxT}>
                    <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                      <SelectItem value="24 months">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stock Units</Label>
                  <Input type="number" defaultValue={editingProduct.stock} className="rounded-xl border-gray-200" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-brand to-orange-400 text-white rounded-xl h-11 font-bold mt-4 shadow-sm hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
