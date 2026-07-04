import { motion } from "motion/react";
import { Card, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Box, AlertCircle, Wrench, ArrowRight } from "lucide-react";
import { StatCard, StatusBadge } from "./vendorHelpers";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function VendorOverview() {
  const { products: inventory, orders } = useApp();

  const activeRentals = orders.filter(o => o.status === "active");
  const totalRevenue = activeRentals.reduce((acc, o) => acc + o.amount, 0);

  const displayProducts = inventory.map(item => ({
    name: item.name,
    sku: (item as any).sku || `SKU-${item.id.substring(0, 4)}`,
    price: toINR(item.price, true),
    units: `${item.inStock ? 4 : 0} units`,
    status: item.inStock ? "Available" : "Out of Stock"
  })).slice(0, 5);

  const outOfStockCount = inventory.filter(p => !p.inStock).length;

  // Mocked chart data scaled by total revenue for realism
  const baseRev = Math.max(totalRevenue / 30, 500);
  const recentRevenue = [
    { day: "Mon", val: baseRev * 0.4 }, { day: "Tue", val: baseRev * 0.7 }, { day: "Wed", val: baseRev * 0.5 },
    { day: "Thu", val: baseRev * 0.9 }, { day: "Fri", val: baseRev * 0.6 }, { day: "Sat", val: baseRev * 1.0 }, { day: "Sun", val: baseRev * 0.8 }
  ];
  const maxRev = Math.max(...recentRevenue.map(d => d.val));

  const needsAttention = [
    { title: "Low Stock Alert", desc: `${outOfStockCount} items out of stock`, type: "warning", icon: <Box className="w-4 h-4 text-amber-600" /> },
    { title: "Pending Orders", desc: "2 orders await approval", type: "urgent", icon: <Package className="w-4 h-4 text-red-600" /> },
    { title: "Return Scheduled", desc: "1 item due for return today", type: "info", icon: <Wrench className="w-4 h-4 text-blue-600" /> }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard icon={<DollarSign className="w-4 h-4 text-brand" />} label="Total Revenue" value={toINR(totalRevenue)} sub={`+${toINR(totalRevenue * 0.1)} this month`} iconBg="bg-orange-100" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard icon={<Package className="w-4 h-4 text-blue-600" />} label="Active Rentals" value={activeRentals.length.toString()} sub="Growing steadily" iconBg="bg-blue-50" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard icon={<Box className="w-4 h-4 text-purple-600" />} label="Total Products" value={inventory.length.toString()} sub={`${outOfStockCount} out of stock`} iconBg="bg-purple-50" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard icon={<AlertCircle className="w-4 h-4 text-red-500" />} label="Needs Attention" value="3" sub="1 urgent" iconBg="bg-red-50" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-[2rem] border-gray-100 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-900">Inventory Status</CardTitle>
            <button className="text-brand text-xs font-bold hover:underline flex items-center gap-1">Manage all <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="bg-gray-50 px-8 py-4 grid grid-cols-5 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <div>Product</div>
                <div>SKU</div>
                <div>Price/mo</div>
                <div>Stock</div>
                <div>Status</div>
              </div>
              <div className="divide-y divide-gray-100">
                {displayProducts.map((p, i) => (
                  <div key={i} className="grid grid-cols-5 px-8 py-5 items-center hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="font-bold text-gray-900 line-clamp-1 pr-2">{p.name}</span>
                    </div>
                    <div className="font-mono text-xs text-gray-500">{p.sku}</div>
                    <div className="font-bold text-gray-900 text-sm">{p.price}</div>
                    <div className="text-gray-900 font-medium">{p.units}</div>
                    <div><StatusBadge label={p.status} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6">
            <h3 className="font-bold text-gray-900 mb-6">Needs Attention</h3>
            <div className="space-y-4">
              {needsAttention.map((item, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 items-start">
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.type === 'urgent' ? 'bg-red-100' : item.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors text-center">
              View all notifications
            </button>
          </Card>

          <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6">
            <h3 className="font-bold text-gray-900 mb-6">Revenue This Week</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {recentRevenue.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="relative w-full flex justify-center h-full items-end">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${(d.val / maxRev) * 100}%` }} 
                      transition={{ delay: i * 0.06, duration: 0.5 }}
                      className="w-full rounded-lg bg-gradient-to-t from-brand to-orange-300 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute -top-8 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {toINR(d.val)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-bold">{d.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
