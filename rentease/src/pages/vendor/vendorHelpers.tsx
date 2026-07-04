import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const statusColor: Record<string, string> = {
  Active:       "bg-green-50 text-green-700 border-green-200",
  Available:    "bg-green-50 text-green-700 border-green-200",
  Rented:       "bg-blue-50 text-blue-700 border-blue-200",
  Scheduled:    "bg-blue-50 text-blue-700 border-blue-200",
  "Out of Stock":"bg-red-50 text-red-700 border-red-200",
  Completed:    "bg-gray-100 text-gray-500 border-gray-200",
  Pending:      "bg-amber-50 text-amber-700 border-amber-200",
  "In Progress":"bg-amber-50 text-amber-700 border-amber-200",
  Resolved:     "bg-green-50 text-green-700 border-green-200",
  Open:         "bg-red-50 text-red-700 border-red-200",
  High:         "bg-red-50 text-red-700 border-red-200",
  Medium:       "bg-amber-50 text-amber-700 border-amber-200",
  Low:          "bg-gray-100 text-gray-500 border-gray-200",
  Excellent:    "bg-green-50 text-green-700 border-green-200",
  Good:         "bg-blue-50 text-blue-700 border-blue-200",
  Fair:         "bg-amber-50 text-amber-700 border-amber-200",
  Damaged:      "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusColor[label] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {label}
    </span>
  );
}

export function StatCard({ icon, label, value, sub, iconBg }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; iconBg: string
}) {
  return (
    <Card className="rounded-[2rem] border-gray-100 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50/50 border-b border-gray-50">
        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</CardTitle>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>{icon}</div>
      </CardHeader>
      <CardContent className="p-6 overflow-hidden">
        <div className="text-2xl lg:text-3xl font-bold text-gray-900 min-w-0 truncate">{value}</div>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}
