import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ShoppingBag, IndianRupee, AlertTriangle, Bell, Info } from "lucide-react";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

const statusColor: Record<string, string> = {
  Active:        "bg-green-50 text-green-700 border-green-200",
  Delivered:     "bg-blue-50 text-blue-700 border-blue-200",
  Cancelled:     "bg-red-50 text-red-700 border-red-200",
  Pending:       "bg-amber-50 text-amber-700 border-amber-200",
  Suspended:     "bg-red-50 text-red-700 border-red-200",
  Open:          "bg-red-50 text-red-700 border-red-200",
  "Under Review":"bg-amber-50 text-amber-700 border-amber-200",
  Resolved:      "bg-green-50 text-green-700 border-green-200",
  Inactive:      "bg-gray-100 text-gray-500 border-gray-200",
  Excellent:     "bg-green-50 text-green-700 border-green-200",
  Good:          "bg-blue-50 text-blue-700 border-blue-200",
  Fair:          "bg-amber-50 text-amber-700 border-amber-200",
};

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusColor[label] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {label}
    </span>
  );
}

export function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string
}) {
  return (
    <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-6 flex items-center gap-4 overflow-hidden">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate">{label}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { orders, claims, users, products } = useApp();

  const displayOrders = orders.slice(0, 3).map(order => ({
    id: order.id,
    customer: users.find(u => u.id === order.userId)?.name || order.userId,
    product: products.find(p => p.id === order.productId)?.name || order.productId,
    status: order.status,
    amount: toINR(order.amount, true)
  }));

  const displayClaims = claims.slice(0, 3).map(claim => {
    const order = orders.find(o => o.id === claim.orderRef);
    const product = products.find(p => p.id === order?.productId)?.name || "Unknown";
    return {
      id: claim.id,
      type: claim.type,
      customer: claim.customer,
      product: product,
      status: claim.status
    };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Users" value={users.length.toString()} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<ShoppingBag className="w-6 h-6" />} label="Active Rentals" value={orders.filter(o => o.status === 'Active').length.toString()} color="bg-orange-50 text-brand" />
        <StatCard icon={<IndianRupee className="w-6 h-6" />} label="Total Revenue" value={toINR(orders.reduce((acc, curr) => acc + curr.amount, 0))} color="bg-green-50 text-green-600" />
        <StatCard icon={<AlertTriangle className="w-6 h-6" />} label="Open Claims" value={claims.filter(c => c.status === 'Open').length.toString()} color="bg-red-50 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <button onClick={() => onNavigate("orders")} className="text-sm text-brand font-semibold hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {displayOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="font-bold text-gray-900">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.id} • {order.product}</p>
                </div>
                <div className="text-right">
                  <StatusBadge label={order.status} />
                  <p className="text-xs text-gray-500 mt-1">{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Bell className="w-4 h-4 text-brand" /> System Alerts</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="p-4 flex gap-3 hover:bg-gray-50/50 transition-colors">
              <div className="mt-0.5"><AlertTriangle className="w-4 h-4 text-amber-500" /></div>
              <div>
                <p className="text-sm font-bold text-gray-900">High volume of support tickets</p>
                <p className="text-xs text-gray-500 mt-1">15 new tickets in the last hour regarding delivery delays.</p>
                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">10 mins ago</p>
              </div>
            </div>
            <div className="p-4 flex gap-3 hover:bg-gray-50/50 transition-colors">
              <div className="mt-0.5"><Info className="w-4 h-4 text-blue-500" /></div>
              <div>
                <p className="text-sm font-bold text-gray-900">New Vendor Registration</p>
                <p className="text-xs text-gray-500 mt-1">Vendor "TechHaven" is pending approval.</p>
                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">2 hours ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
