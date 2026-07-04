import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Package, Truck, Home, Phone, Star } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "@/hooks/useApp";

export default function OrderTracking() {
  const { orderId } = useParams();
  const { orders } = useApp();

  const order = orders.find(o => o.id === orderId);
  if (!order) return <Navigate to="/orders" replace />;

  let currentStep = 0;
  if (order.status === "active") currentStep = 2; // "active" means dispatched/in transit
  if (order.status === "completed") currentStep = 4; // delivered
  if (order.status === "cancelled") currentStep = 0;

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  const steps = [
    { title: "Order Placed", date: orderDate, icon: <Package className="w-5 h-5" /> },
    { title: "Processing", date: currentStep >= 1 ? orderDate : "Pending", icon: <Check className="w-5 h-5" /> },
    { title: "Dispatched", date: currentStep >= 2 ? "In Transit" : "Pending", icon: <Truck className="w-5 h-5" /> },
    { title: "Out for Delivery", date: currentStep >= 3 ? "Today" : "Pending", icon: <Truck className="w-5 h-5" /> },
    { title: "Delivered", date: currentStep >= 4 ? "Delivered" : "Pending", icon: <Home className="w-5 h-5" /> }
  ];

  if (order.status === "cancelled") {
    steps[1] = { title: "Cancelled", date: orderDate, icon: <Check className="w-5 h-5" /> };
    steps.splice(2, 3); // remove rest
  }

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-8 md:py-12">
      <div className="container">
        
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild className="hover:bg-white rounded-full -ml-4">
            <Link to="/orders"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders</Link>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-1/3 shrink-0 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Track Order</h1>
              <p className="text-gray-500 mt-1 font-medium">{orderId}</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="relative pl-6 space-y-8 border-l-2 border-gray-100 ml-4">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isActive = index === currentStep;
                  
                  return (
                    <div key={index} className="relative">
                      <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${order.status === "cancelled" && index === 1 ? 'bg-red-500 text-white' : isActive ? 'bg-brand text-white shadow-md scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {isCompleted && !isActive && order.status !== "cancelled" ? <Check className="w-4 h-4" /> : step.icon}
                      </div>
                      <div>
                        <h3 className={`font-bold ${isActive ? 'text-brand text-lg' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {order.status !== "cancelled" && (
            <div className="flex-1 space-y-6">
              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-[2.5rem] h-[400px] overflow-hidden relative shadow-inner border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                  alt="Map View" 
                  className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 bg-brand rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white"
                  >
                    <Truck className="w-8 h-8" />
                  </motion.div>
                </div>
              </div>

              {/* Delivery Agent */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/150?u=agent" alt="Agent" className="w-16 h-16 rounded-full border-2 border-brand p-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Mike Johnson</h3>
                    <p className="text-sm text-gray-500">Delivery Executive</p>
                    <div className="flex items-center gap-1 mt-1 text-yellow-400 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-gray-600 font-bold ml-1">4.9</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-12 border-gray-200 text-gray-700">
                    Message
                  </Button>
                  <Button className="flex-1 sm:flex-none rounded-xl h-12 bg-green-500 hover:bg-green-600 text-white">
                    <Phone className="w-4 h-4 mr-2" /> Call
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
