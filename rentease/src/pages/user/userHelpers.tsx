export const statusColor: Record<string, string> = {
  Active:      "bg-green-50 text-green-700 border-green-200",
  Delivered:   "bg-blue-50 text-blue-700 border-blue-200",
  Pending:     "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled:   "bg-red-50 text-red-700 border-red-200",
  Completed:   "bg-gray-100 text-gray-500 border-gray-200",
  Open:        "bg-red-50 text-red-700 border-red-200",
  "In Progress":"bg-amber-50 text-amber-700 border-amber-200",
  Resolved:    "bg-green-50 text-green-700 border-green-200",
};

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusColor[label] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {label}
    </span>
  );
}
