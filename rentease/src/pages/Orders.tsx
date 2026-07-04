import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Truck, Calendar, MapPin, Printer, XCircle, Clock } from "lucide-react";
import { useApp } from "@/hooks/useApp";
import { toast } from "sonner";
import { toINR } from "@/lib/utils";

export default function Orders() {
  const { orders, products } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = (id: string) => {
    toast.success(`Order ${id} cancelled successfully.`);
  };

  const handleExtend = (id: string) => {
    toast.success(`Tenure extended for Order ${id}. Request sent!`);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-[#fdfaf8] min-h-screen py-12">
        <div className="container text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
          <p className="text-gray-500 mb-8">You haven't rented anything yet.</p>
          <Link to="/furniture">
            <Button className="bg-brand text-white rounded-xl font-bold px-8">Browse Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-12">
      <div className="container">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">My Orders</h1>
        
        <div className="space-y-6">
          {orders.map((order) => {
            const product = products.find(p => p.id === order.productId);
            const isDelivered = order.status === "completed";
            const dateStr = new Date(order.createdAt).toLocaleDateString();

            return (
            <div key={order.id} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 justify-between print:border-none print:shadow-none">
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="font-bold text-lg text-gray-900">{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {dateStr}
                  </span>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                    {product ? <img src={product.image} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-gray-400" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{product?.name || "Unknown Item"}</h3>
                    <p className="text-sm text-gray-500 mt-1">Total: <span className="font-bold text-brand">{toINR(order.amount)}</span> ({order.tenure} mo)</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 print:hidden">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-lg text-xs font-bold border-gray-200">
                    <Printer className="w-3 h-3 mr-1" /> Invoice
                  </Button>
                  {!isDelivered && (
                    <Button variant="outline" size="sm" onClick={() => handleCancel(order.id)} className="rounded-lg text-xs font-bold border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                      <XCircle className="w-3 h-3 mr-1" /> Cancel
                    </Button>
                  )}
                  {isDelivered && (
                    <Button variant="outline" size="sm" onClick={() => handleExtend(order.id)} className="rounded-lg text-xs font-bold border-brand text-brand hover:bg-brand hover:text-white">
                      <Clock className="w-3 h-3 mr-1" /> Extend Tenure
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center items-start md:items-end gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 print:hidden">
                {!isDelivered ? (
                  <>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand" /> Arriving Soon
                    </p>
                    <Button asChild className="w-full bg-brand text-white hover:bg-brand-dark rounded-xl h-12 font-bold">
                      <Link to={`/track/${order.id}`}>Track Order</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" /> Delivered to Address
                    </p>
                    <Button variant="outline" asChild className="w-full rounded-xl h-12 font-bold border-gray-200 hover:border-brand hover:text-brand transition-colors">
                      <Link to={`/support?order=${order.id}`}>Get Support</Link>
                    </Button>
                  </>
                )}
              </div>
              
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
