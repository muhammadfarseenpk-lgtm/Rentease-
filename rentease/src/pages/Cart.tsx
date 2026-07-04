import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

export default function Cart() {
  const { cart, removeFromCart, applyCoupon, appliedCoupon } = useApp();
  const navigate = useNavigate();

  const [deliveryDates, setDeliveryDates] = useState<Record<string, string>>({});
  const [deliveryLocations, setDeliveryLocations] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState("");

  const handleUpdateDate = (id: string, date: string) => {
    setDeliveryDates(prev => ({ ...prev, [id]: date }));
  };

  const handleUpdateLocation = (id: string, loc: string) => {
    setDeliveryLocations(prev => ({ ...prev, [id]: loc }));
  };

  const handleApply = () => {
    applyCoupon(couponCode);
  };

  useEffect(() => {
    if (appliedCoupon) toast.success(`Coupon "${appliedCoupon.code}" applied — ${appliedCoupon.discountPercent}% off!`);
  }, [appliedCoupon]);

  const discountRate = appliedCoupon?.discountPercent ? appliedCoupon.discountPercent / 100 : 0;

  const subtotal = cart.reduce((acc, item) => {
    const mult = item.tenure === "3" ? 1.2 : item.tenure === "6" ? 1.1 : item.tenure === "18" ? 0.95 : item.tenure === "24" ? 0.9 : 1;
    return acc + (item.price * mult * item.quantity);
  }, 0);
  
  const deposits = cart.reduce((acc, item) => acc + (((item as any).deposit || item.price * 2) * item.quantity), 0);
  const discountAmount = subtotal * discountRate;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.18; // 18% GST
  const total = taxableAmount + deposits + tax;

  const handleCheckout = () => {
    localStorage.setItem("checkoutMeta", JSON.stringify({ deliveryDates, deliveryLocations, discount: discountRate }));
    navigate("/checkout");
  };

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-12 pb-24">
      <div className="container px-6 lg:px-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <span className="text-6xl mb-4">🛒</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Browse our catalog to find what you need.</p>
            <Link to="/furniture">
              <Button className="bg-brand text-white rounded-xl font-bold h-12 px-8 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, i) => {
                const mult = item.tenure === "3" ? 1.2 : item.tenure === "6" ? 1.1 : item.tenure === "18" ? 0.95 : item.tenure === "24" ? 0.9 : 1;
                const monthly = item.price * mult;
                const uid = item.id + (item.tenure || "12");

                return (
                  <motion.div key={uid} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white overflow-hidden p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                              <span className="bg-orange-50 text-brand border border-orange-200 rounded-full px-2.5 py-0.5 text-xs font-bold">
                                {item.tenure || "12"} months
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 sm:gap-8 items-end">
                          <div>
                            <p className="text-lg font-bold text-brand">{toINR(monthly, true)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Deposit: {toINR((item as any).deposit || item.price * 2)}</p>
                          </div>
                          
                          <div className="flex-1 min-w-[200px] grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold text-gray-500">Delivery Date</Label>
                              <Input 
                                type="date" 
                                value={deliveryDates[uid] || ""} 
                                onChange={e => handleUpdateDate(uid, e.target.value)}
                                min={new Date(Date.now() + 86400000*2).toISOString().split('T')[0]}
                                className="h-8 rounded-lg border-gray-200 text-xs px-2"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold text-gray-500">Location PIN</Label>
                              <Input 
                                type="text"
                                placeholder="Address/PIN"
                                value={deliveryLocations[uid] || ""} 
                                onChange={e => handleUpdateLocation(uid, e.target.value)}
                                className="h-8 rounded-lg border-gray-200 text-xs px-2"
                                maxLength={6}
                              />
                              {(deliveryLocations[uid]?.length === 6) && (
                                <p className="text-[9px] text-green-600 font-bold mt-1">Delivery in 2-3 days</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Monthly Rent Subtotal</span>
                    <span className="font-bold text-gray-900">{toINR(subtotal)}</span>
                  </div>
                  {discountRate > 0 && (
                    <div className="flex justify-between text-green-600 text-sm font-bold">
                      <span>Discount ({appliedCoupon?.code || "WELCOME10"})</span>
                      <span>-{toINR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-600 text-sm font-bold">
                    <span>Security Deposit (refundable)</span>
                    <span>{toINR(deposits)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax (18% GST)</span>
                    <span className="font-bold text-gray-900">{toINR(tax)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <Input 
                    placeholder="Coupon Code" 
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value)}
                    className="rounded-xl h-11 border-gray-200"
                  />
                  <Button onClick={handleApply} variant="outline" className="rounded-xl h-11 font-bold">Apply</Button>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900">Total First Payment</span>
                    <span className="text-2xl font-bold text-brand">{toINR(total)}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-right">Deposits returned within 7 days of item return</p>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 text-white font-bold"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
