import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ShieldCheck, MapPin, Truck, Box, Banknote, Smartphone, Info, Check } from "lucide-react";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid PIN code is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { cart, clearCart, addOrder, user } = useApp();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [globalDate, setGlobalDate] = useState("");
  const [useGlobalDate, setUseGlobalDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register, trigger, watch, setValue, formState: { errors } } = useHookForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched"
  });

  const [meta, setMeta] = useState<any>({ deliveryDates: {}, deliveryLocations: {}, discount: 0 });
  useEffect(() => {
    const m = localStorage.getItem("checkoutMeta");
    if (m) setMeta(JSON.parse(m));
  }, []);

  if (cart.length === 0 && step !== 4) {
    return <Navigate to="/cart" replace />;
  }

  const subtotal = cart.reduce((acc, item) => {
    const mult = item.tenure === "3" ? 1.2 : item.tenure === "6" ? 1.1 : item.tenure === "18" ? 0.95 : item.tenure === "24" ? 0.9 : 1;
    return acc + (item.price * mult * item.quantity);
  }, 0);
  const deposits = cart.reduce((acc, item) => acc + ((item.deposit || item.price * 2) * item.quantity), 0);
  const discountAmount = subtotal * (meta.discount || 0);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.18; // 18% GST
  const total = taxableAmount + deposits + tax;

  const handleNextStep1 = async () => {
    const valid = await trigger(["fullName", "address", "city", "state", "zipCode"]);
    if (valid) setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!agreedToTerms) { return; }
    if (paymentMethod === "online") { return; }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    const newOrderId = "ORD-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    setOrderId(newOrderId);
    cart.forEach(item => {
      addOrder({
        id: newOrderId + "-" + item.id,
        userId: user?.id ?? "guest",
        productId: item.id,
        tenure: Number(item.tenure) || 12,
        amount: item.price * (item.tenure === "3" ? 1.2 : item.tenure === "6" ? 1.1 : 1),
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
    });
    clearCart();
    localStorage.removeItem("checkoutMeta");
    setIsSubmitting(false);
    setStep(4);
  };

  const steps = [
    { id: 1, label: "Address" },
    { id: 2, label: "Delivery" },
    { id: 3, label: "Payment" },
    { id: 4, label: "Confirm" }
  ];

  if (step === 4) {
    return (
      <div className="bg-[#fdfaf8] min-h-[calc(100vh-140px)] flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="w-full max-w-lg bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 text-center">
          <CheckCircle2 className="w-20 h-20 text-brand mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h2>
          <p className="text-gray-500 font-mono font-bold mb-8">Order #{orderId}</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-bold text-xl text-gray-900">{toINR(total)}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
              <p className="font-bold text-gray-900 flex items-center gap-2"><Truck className="w-4 h-4 text-brand"/> {globalDate || "Within 2-5 days"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
              <p className="font-bold text-gray-900 flex items-start gap-2"><MapPin className="w-4 h-4 text-brand mt-0.5 shrink-0"/> {watch("address")}, {watch("city")}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/user-dashboard">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white rounded-xl h-11 px-8 font-bold">
                Track Order
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto border-gray-200 rounded-xl h-11 px-8 font-bold">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-12 pb-24">
      <div className="container px-6 lg:px-20 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 top-4 right-0 h-0.5 bg-gray-200 -z-10" />
          <div className="absolute left-0 top-4 h-0.5 bg-brand -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
          
          {steps.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-[#fdfaf8] px-2">
              <div className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center transition-colors ${
                step > s.id ? "bg-brand text-white" : step === s.id ? "border-2 border-brand bg-white text-brand" : "bg-gray-100 text-gray-400"
              }`}>
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-xs font-bold ${step >= s.id ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                  
                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="mb-8">
                      <Label className="text-gray-500 mb-3 block">Saved Addresses</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user.addresses.map((addr) => (
                          <div 
                            key={addr.id} 
                            onClick={() => {
                              setValue("fullName", user.name);
                              setValue("address", addr.street);
                              setValue("city", addr.city);
                              setValue("state", addr.state);
                              setValue("zipCode", addr.zipCode);
                            }}
                            className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-brand transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-brand" />
                              <span className="font-bold text-sm text-gray-900 capitalize">{addr.type}</span>
                              {addr.isDefault && <span className="bg-orange-50 text-brand text-[10px] px-2 py-0.5 rounded-full ml-auto">Default</span>}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mt-2">{addr.street}, {addr.city}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="e.g. Arjun Nair" {...register("fullName")} className="rounded-xl border-gray-200" />
                      {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Address Line</Label>
                      <Input placeholder="House/Flat No, Street" {...register("address")} className="rounded-xl border-gray-200" />
                      {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input placeholder="e.g. Kozhikode" {...register("city")} className="rounded-xl border-gray-200" />
                        {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input placeholder="e.g. Kerala" {...register("state")} className="rounded-xl border-gray-200" />
                        {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2 w-1/2 pr-2">
                      <Label>PIN Code</Label>
                      <Input placeholder="673001" {...register("zipCode")} className="rounded-xl border-gray-200" />
                      {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode.message}</p>}
                    </div>
                    <Button type="button" onClick={handleNextStep1} className="w-full h-11 rounded-xl bg-brand text-white font-bold mt-4">
                      Continue to Delivery
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Options</h2>
                  
                  <div className="space-y-4 mb-8">
                    {cart.map(item => {
                      const uid = item.id + (item.tenure || "12");
                      const date = meta.deliveryDates?.[uid] || globalDate || "Not set";
                      return (
                        <div key={uid} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover"/></div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900">{item.name}</p>
                            <span className="bg-orange-50 text-brand px-2 py-0.5 rounded-full text-[10px] font-bold">{item.tenure || "12"} months</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase text-gray-500 font-bold">Delivery Date</p>
                            <p className={`text-xs font-bold ${date === "Not set" ? "text-red-500" : "text-gray-900"}`}>{date}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-4 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={useGlobalDate} onChange={e => setUseGlobalDate(e.target.checked)} className="rounded border-gray-300 text-brand focus:ring-brand" />
                      <span className="text-sm font-bold text-gray-700">Apply one date to all items</span>
                    </label>
                    {useGlobalDate && (
                      <Input type="date" value={globalDate} onChange={e => setGlobalDate(e.target.value)} className="rounded-xl border-gray-200" />
                    )}
                  </div>

                  <div className="space-y-2 mb-6">
                    <Label>Delivery Notes (optional)</Label>
                    <Textarea placeholder="Any special delivery instructions?" className="rounded-xl border-gray-200 resize-none h-20" />
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mb-6">
                    <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-xs text-blue-800 font-medium">Delivery within 2–5 working days from your chosen date. Our team will call you 24 hours prior to confirm the time slot.</p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 font-bold">Back</Button>
                    <Button onClick={handleNextStep2} className="flex-1 h-11 rounded-xl bg-brand text-white font-bold">Continue to Payment</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Choose Payment Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Cash on Delivery */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cod")}
                          className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                            paymentMethod === "cod"
                              ? "border-brand bg-orange-50/60 shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            paymentMethod === "cod" ? "bg-brand text-white" : "bg-gray-100 text-gray-500"
                          }`}>
                            <Banknote className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Cash on Delivery</p>
                            <p className="text-xs text-gray-500 mt-0.5">Pay when your item arrives</p>
                            <p className="text-xs text-green-600 font-bold mt-1">✓ No extra charges</p>
                          </div>
                          {paymentMethod === "cod" && (
                            <div className="ml-auto shrink-0">
                              <CheckCircle2 className="h-5 w-5 text-brand" />
                            </div>
                          )}
                        </button>

                        {/* Online Payment (future) */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("online")}
                          className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                            paymentMethod === "online"
                              ? "border-brand bg-orange-50/60 shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            paymentMethod === "online" ? "bg-brand text-white" : "bg-gray-100 text-gray-500"
                          }`}>
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Online Payment</p>
                            <p className="text-xs text-gray-500 mt-0.5">UPI, Net Banking, Wallets</p>
                            <div className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                              Coming Soon
                            </div>
                          </div>
                          {paymentMethod === "online" && (
                            <div className="ml-auto shrink-0">
                              <CheckCircle2 className="h-5 w-5 text-brand" />
                            </div>
                          )}
                        </button>

                      </div>

                      {/* Online payment notice */}
                      {paymentMethod === "online" && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700 font-medium">
                            Online payment integration (Razorpay/UPI) is coming soon.
                            For now, please use Cash on Delivery to complete your order.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Terms checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group mb-6">
                      <div
                        onClick={() => setAgreedToTerms(v => !v)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          agreedToTerms ? "bg-brand border-brand" : "border-gray-300 group-hover:border-brand"
                        }`}
                      >
                        {agreedToTerms && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-600">
                        I agree to the{" "}
                        <span className="text-brand font-bold cursor-pointer hover:underline">Damage Policy</span>
                        {" "}and{" "}
                        <span className="text-brand font-bold cursor-pointer hover:underline">Late Fee Policy</span>
                        . I understand the security deposit is refundable on timely return.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setStep(2)} className="flex-1 font-bold" disabled={isSubmitting}>Back</Button>
                    <div className="flex-[2] flex flex-col items-center">
                      <Button 
                        onClick={handlePlaceOrder} 
                        disabled={!agreedToTerms || isSubmitting || paymentMethod === "online"} 
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white font-bold"
                      >
                        {isSubmitting ? "Placing Order..." : paymentMethod === "cod" ? "Place Order (Pay on Delivery)" : "Online Payment Coming Soon"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="md:col-span-1">
            <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3 mb-6">
                {cart.map(item => {
                  const mult = item.tenure === "3" ? 1.2 : item.tenure === "6" ? 1.1 : item.tenure === "18" ? 0.95 : item.tenure === "24" ? 0.9 : 1;
                  const itemMonthly = item.price * mult;
                  return (
                    <div key={item.id + item.tenure} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate pr-4">{item.quantity}x {item.name} <span className="text-xs text-gray-400">({item.tenure}mo)</span></span>
                      <span className="font-bold text-gray-900">{toINR(itemMonthly * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-100 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>{toINR(subtotal)}</span>
                </div>
                {meta.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Discount</span><span>-{toINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-amber-600 font-bold">
                  <span>Deposits</span><span>{toINR(deposits)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (18% GST)</span><span>{toINR(tax)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-brand">{toINR(total)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
