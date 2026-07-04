import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { StatCard } from "./AdminOverview";
import { DollarSign, TrendingUp, Users, RefreshCw, Calendar, Download } from "lucide-react";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function AdminReports() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const monthlyData = [
    { month: "Jan", val: 3200 },
    { month: "Feb", val: 4100 },
    { month: "Mar", val: 3800 },
    { month: "Apr", val: 5200 },
    { month: "May", val: 6100 },
    { month: "Jun", val: 5800 }
  ];
  const maxVal = 6100;

  const { vendors } = useApp();

  const topVendors = vendors.map(v => ({
    name: v.name,
    revenue: toINR(v.revenue, true),
    rawVal: v.revenue
  })).sort((a, b) => b.rawVal - a.rawVal).slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
        <div className="flex gap-3 flex-wrap">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px] rounded-xl border-gray-200 bg-white font-medium">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 3 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-brand hover:bg-orange-600 text-white rounded-xl font-bold shadow-sm" onClick={() => toast.success("Report exported — check your email")}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign className="w-6 h-6" />} label="Total Revenue" value={toINR(28400)} color="bg-green-50 text-green-600" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Avg Order Value" value={toINR(62.30)} color="bg-blue-50 text-blue-600" />
        <StatCard icon={<Users className="w-6 h-6" />} label="New Users (30d)" value="148" sub="↑ 22%" color="bg-orange-50 text-brand" />
        <StatCard icon={<RefreshCw className="w-6 h-6" />} label="Churn Rate" value="3.2%" sub="↓ 0.5%" color="bg-red-50 text-red-600" />
      </div>

      <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white p-6">
        <h3 className="font-bold text-gray-900 mb-8">Monthly Revenue (2025)</h3>
        <div className="flex items-end gap-3 h-48 w-full max-w-3xl">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500 font-medium truncate w-full text-center px-1">₹{(d.val * 83 / 1000).toFixed(0)}k</span>
              <div className="w-full flex-1 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: mounted ? `${(d.val / maxVal) * 100}%` : 0 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="w-full rounded-xl bg-gradient-to-t from-brand to-orange-300 shadow-sm"
                />
              </div>
              <span className="text-xs text-gray-400 font-bold">{d.month}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white p-6 space-y-6">
          <h3 className="font-bold text-gray-900">Revenue by Category</h3>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700">Furniture</span>
              <span className="font-bold text-gray-900">62%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: mounted ? "62%" : 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-brand" 
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700">Appliances</span>
              <span className="font-bold text-gray-900">38%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: mounted ? "38%" : 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-blue-500" 
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white p-6">
          <h3 className="font-bold text-gray-900 mb-6">Top Vendors by Revenue</h3>
          <div className="space-y-5">
            {topVendors.map((vendor, i) => (
              <div key={vendor.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-gray-700 text-sm">
                    <span className="text-gray-400 mr-2">#{i + 1}</span>
                    {vendor.name}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{vendor.revenue}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: mounted ? `${(vendor.rawVal / 5000) * 100}%` : 0 }} 
                    transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand to-orange-300" 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
