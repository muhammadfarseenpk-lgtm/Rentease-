import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, ShoppingCart, Activity, Truck, RefreshCcw, Eye, AlertCircle, Undo2, PackageX } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./AdminOverview";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function AdminOrders() {
  const [orderSearch, setOrderSearch] = useState("");
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [actionType, setActionType] = useState<"none" | "refund" | "dispute">("none");
  const [actionReason, setActionReason] = useState("");
  
  const { orders, users, products, updateOrderStatus, fileClaim } = useApp();
  
  const displayOrders = orders.map(order => ({
    id: order.id,
    customer: users.find(u => u.id === order.userId)?.name || order.userId,
    product: products.find(p => p.id === order.productId)?.name || order.productId,
    tenure: `${order.tenure} months`,
    amount: toINR(order.amount, true),
    status: order.status,
    date: order.createdAt,
    nextBilling: "—"
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<ShoppingCart className="w-6 h-6" />} label="Total Orders" value={orders.length.toString()} color="bg-orange-50 text-brand" />
        <StatCard icon={<Activity className="w-6 h-6" />} label="Active Rentals" value={orders.filter(o => o.status === 'Active').length.toString()} color="bg-green-50 text-green-600" />
        <StatCard icon={<Truck className="w-6 h-6" />} label="Delivered" value={orders.filter(o => o.status === 'Delivered').length.toString()} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<RefreshCcw className="w-6 h-6" />} label="Returns Due" value="0" color="bg-amber-50 text-amber-600" />
      </div>

      <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">All Orders & Rentals</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by customer or ID..." 
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="pl-9 w-full sm:w-64 rounded-xl border-gray-200"
            />
          </div>
        </div>

        {displayOrders.filter(o => o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase())).length === 0 ? (
          <div className="p-6">
            <EmptyState 
              icon={<PackageX className="w-8 h-8" />} 
              title="No orders found" 
              message={orderSearch ? `No orders match your search "${orderSearch}"` : "There are currently no orders in the system."} 
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/60 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Tenure</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Next Billing</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.filter(o => o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase())).map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{order.product}</td>
                    <td className="px-6 py-4 text-gray-600">{order.tenure}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4"><StatusBadge label={order.status} /></td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 text-gray-500">{order.nextBilling}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-200" onClick={() => { setSelectedOrder(order); setOrderOpen(true); setActionType("none"); }}>
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Order Details <span className="text-sm font-mono text-gray-500 ml-2">{selectedOrder?.id}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Customer</span>
                  <span className="text-sm font-bold text-gray-900">{selectedOrder.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Product</span>
                  <span className="text-sm font-bold text-gray-900">{selectedOrder.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="text-sm font-bold text-gray-900">{selectedOrder.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge label={selectedOrder.status} />
                </div>
              </div>

              {actionType === "none" ? (
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl border-orange-200 text-brand hover:bg-orange-50 font-bold"
                    onClick={() => setActionType("refund")}
                  >
                    <Undo2 className="w-4 h-4 mr-2" /> Issue Refund
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold"
                    onClick={() => setActionType("dispute")}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" /> Open Dispute
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900">
                    {actionType === "refund" ? "Issue Refund" : "Open Dispute"}
                  </h4>
                  
                  {actionType === "refund" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Refund Type</label>
                      <Select defaultValue="full">
                        <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="full">Full Refund</SelectItem>
                          <SelectItem value="partial">Partial Refund</SelectItem>
                          <SelectItem value="deposit">Deposit Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Reason</label>
                    <Textarea 
                      placeholder={`Enter reason for ${actionType}...`} 
                      className="rounded-xl border-gray-200 resize-none h-24"
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-xl"
                      onClick={() => setActionType("none")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className={`flex-1 rounded-xl font-bold text-white ${actionType === "refund" ? "bg-brand hover:bg-orange-600" : "bg-red-600 hover:bg-red-700"}`}
                      onClick={() => {
                        if (actionType === "refund") {
                          updateOrderStatus(selectedOrder.id, "Refunded");
                        } else if (actionType === "dispute") {
                          updateOrderStatus(selectedOrder.id, "Disputed");
                          fileClaim({
                            id: "CLM-" + Date.now(),
                            type: "Dispute",
                            orderRef: selectedOrder.id,
                            customer: selectedOrder.customer,
                            status: "Open",
                            notes: actionReason
                          });
                        }
                        toast.success(`${actionType === "refund" ? "Refund issued" : "Dispute opened"} successfully`);
                        setOrderOpen(false);
                        setActionReason("");
                      }}
                    >
                      Confirm {actionType === "refund" ? "Refund" : "Dispute"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
