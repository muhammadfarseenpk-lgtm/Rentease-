import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, DollarSign, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./userHelpers";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function UserHistory() {
  const { orders, products, user, addToCart } = useApp();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const mockHistory = orders
    .filter(o => o.userId === user?.id)
    .map(o => {
      const product = products.find(p => p.id === o.productId);
      return {
        id: o.id,
        product: product?.name || "Unknown Product",
        tenure: `${o.tenure} mo`,
        monthly: o.amount,
        total: o.amount * (typeof o.tenure === 'number' ? o.tenure : parseInt(o.tenure)),
        dates: o.createdAt,
        status: o.status
      };
    });

  const filtered = mockHistory.filter(h => {
    const mStatus = filter === "All" || h.status === filter;
    const mSearch = h.product.toLowerCase().includes(search.toLowerCase()) || h.id.toLowerCase().includes(search.toLowerCase());
    return mStatus && mSearch;
  });

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleRentAgain = (item: any) => {
    addToCart({ id: item.id, name: item.product, price: item.monthly, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400", category: "Furniture", quantity: 1, tenure: "3" });
    toast.success(`${item.product} added to cart!`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-shadow overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0"><Package className="w-6 h-6 text-brand" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-500 uppercase truncate">Total Rentals</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">7</p>
          </div>
        </Card>
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-shadow overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0"><DollarSign className="w-6 h-6 text-green-600" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-500 uppercase truncate">Total Spent</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">{toINR(1249.97)}</p>
          </div>
        </Card>
        <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6 flex items-center gap-4 hover:shadow-md transition-shadow overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0"><RefreshCw className="w-6 h-6 text-blue-600" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-500 uppercase truncate">Items Returned</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">4</p>
          </div>
        </Card>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex gap-2">
          {["All", "Completed", "Cancelled"].map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filter === f ? "bg-brand text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-200"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search orders..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 w-full sm:w-56 rounded-xl h-10 border-gray-200 text-sm" />
        </div>
      </div>

      <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white overflow-hidden overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              icon={<Package className="w-8 h-8" />} 
              title="No history found" 
              message={search ? `No orders match your search "${search}"` : "You haven't rented anything yet."} 
            />
          </div>
        ) : (
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Tenure</th>
                <th className="px-6 py-4">Monthly</th>
                <th className="px-6 py-4">Total Paid</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map(h => (
                <tr key={h.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{h.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{h.product}</td>
                  <td className="px-6 py-4"><span className="bg-orange-50 text-brand border border-orange-200 rounded-full px-2 py-0.5 text-xs font-bold">{h.tenure}</span></td>
                  <td className="px-6 py-4 text-gray-600">{toINR(h.monthly)}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{toINR(h.total)}</td>
                  <td className="px-6 py-4 text-gray-600 text-xs">{h.dates}</td>
                  <td className="px-6 py-4"><StatusBadge label={h.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" className="h-8 rounded-full px-3 text-xs text-gray-500 hover:text-gray-900" onClick={() => toast.info("Receipt sent to your email")}>Receipt</Button>
                      <Button variant="outline" className="h-8 rounded-full px-3 text-xs font-bold border-brand text-brand hover:bg-orange-50" onClick={() => handleRentAgain(h)}>Rent Again</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {filtered.length > itemsPerPage && (
        <div className="flex justify-between items-center px-2">
          <span className="text-sm text-gray-400 font-medium">Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} results</span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-full h-8 px-4 text-xs font-bold">Prev</Button>
            <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="rounded-full h-8 px-4 text-xs font-bold">Next</Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
