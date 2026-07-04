import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Truck, RefreshCw, Star, Heart, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const { products, cart, addToCart, wishlist, addToWishlist, removeFromWishlist, reviews, addReview, addToRecentlyViewed, user } = useApp();
  
  const product = products.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-bold text-gray-500">Product not found</p>
    </div>
  );
  
  const [tenure, setTenure] = useState("12");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  
  const handleSubmitReview = () => {
    if (!user) { toast.error("Login to write a review"); return; }
    if (!newReview.trim()) { toast.error("Please write your review"); return; }
    addReview({
      id: "rev-" + Date.now(),
      productId: product.id,
      userName: user.name,
      rating,
      comment: newReview,
      date: new Date().toISOString().split("T")[0],
    });
    toast.success("Review submitted!");
    setNewReview("");
    setRating(5);
  };
  
  const [activeImage, setActiveImage] = useState(product?.image || "");
  
  useEffect(() => {
    if (product) addToRecentlyViewed(product.id);
  }, [product, addToRecentlyViewed]);

  if (!product) return <Navigate to="/" replace />;
  const galleryImages = product.images?.length ? product.images : [product.image, product.image, product.image];
  const productReviews = reviews.filter(r => r.productId === product.id);
  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  
  const inWish = wishlist.includes(product.id);
  
  const getMultiplier = () => {
    switch(tenure) {
      case "3": return 1.2;
      case "6": return 1.1;
      case "12": return 1.0;
      case "18": return 0.95;
      case "24": return 0.90;
      default: return 1.0;
    }
  };

  const monthlyPrice = product.pricingTiers?.find(t => t.months === parseInt(tenure))?.monthlyRate || product.price * getMultiplier();
  const deposit = product.deposit || product.price * 2;
  const firstPayment = monthlyPrice + deposit;

  // Min delivery date calculation
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const minDate = tomorrow.toISOString().split("T")[0];

  const maxDelivery = new Date();
  maxDelivery.setDate(maxDelivery.getDate() + 30);
  const maxDate = maxDelivery.toISOString().split("T")[0];

  // Next 7 days for availability calendar
  const next7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-12 pb-24">
      <div className="container px-6 lg:px-20">
        <Link to={`/${product.category.toLowerCase()}`} className="text-sm text-gray-500 hover:text-brand font-bold mb-6 inline-block">
          ← Back to {product.category}
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-gray-50 rounded-[2rem] aspect-square overflow-hidden relative border border-gray-100 shadow-sm">
              <img src={activeImage} alt={product.name} className="object-cover w-full h-full" />
              <button 
                onClick={() => {
                  if (inWish) { removeFromWishlist(product.id); toast.info("Removed from wishlist"); }
                  else { addToWishlist(product.id); toast.success("Added to wishlist"); }
                }}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10 border-none"
              >
                <Heart className={`w-6 h-6 ${inWish ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
              {galleryImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === img ? 'border-brand shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">{product.category}</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-brand">{toINR(monthlyPrice, true)}</span>
              </div>
              <div className="inline-block bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-sm font-bold">
                Deposit: {toINR(deposit)}
              </div>
              <p className="text-xs text-gray-400 mt-2">Deposit fully refunded on timely return</p>
              <p className="text-sm font-bold text-gray-900 mt-2">First month + deposit = {toINR(firstPayment)}</p>
            </div>

            <div className="space-y-3">
              <Label className="font-bold text-gray-900 text-base">Select Tenure</Label>
              <div className="flex flex-wrap gap-2">
                {["3", "6", "12", "18", "24"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTenure(t)}
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${tenure === t ? "bg-brand text-white shadow" : "bg-white border border-gray-200 text-gray-600 hover:border-brand"}`}
                  >
                    {t} Months
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Monthly: {toINR(monthlyPrice)} · Total: {toINR(monthlyPrice * parseInt(tenure))} over {tenure} months
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="font-bold text-gray-900">Choose Delivery Date</Label>
                <Input 
                  type="date" 
                  min={minDate} 
                  max={maxDate} 
                  value={deliveryDate} 
                  onChange={e => setDeliveryDate(e.target.value)} 
                  className="rounded-xl h-11 border-gray-200" 
                />
                
                {/* Availability Calendar */}
                <div className="mt-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-brand" />
                    <span className="text-sm font-bold text-gray-900">Availability</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {next7Days.map((d, i) => {
                      const dateStr = d.toISOString().split("T")[0];
                      const isBlackout = product.blackoutDates?.includes(dateStr);
                      return (
                        <div key={i} className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border shrink-0 ${isBlackout ? 'bg-red-50 border-red-100 text-red-400' : 'bg-green-50 border-green-100 text-green-700'}`}>
                          <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('en-US', {weekday: 'short'})}</span>
                          <span className="text-sm font-black">{d.getDate()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="font-bold text-gray-900">Delivery Location</Label>
                <div className="flex gap-2">
                  <Input 
                    value={pinCode} 
                    onChange={e => setPinCode(e.target.value)} 
                    placeholder="PIN e.g. 673001" 
                    className="rounded-xl h-11 border-gray-200 w-1/3"
                    maxLength={6}
                  />
                  <Input 
                    value={deliveryLocation} 
                    onChange={e => setDeliveryLocation(e.target.value)} 
                    placeholder="Full Address" 
                    className="rounded-xl h-11 border-gray-200 flex-1" 
                  />
                </div>
                {pinCode.length === 6 && <p className="text-xs text-green-600 font-bold">Delivery available to your area ✓</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 py-4 border-y border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500"><ShieldCheck className="w-4 h-4 text-brand"/> Free Maintenance</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500"><Truck className="w-4 h-4 text-brand"/> Free Delivery</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500"><RefreshCw className="w-4 h-4 text-brand"/> Easy Returns</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500"><Star className="w-4 h-4 text-brand"/> No Hidden Fees</div>
            </div>

            <Button 
              disabled={!product.inStock}
              onClick={() => {
                addToCart({ ...product, quantity: 1, tenure });
                toast.success(`${product.name} added! Delivery on ${deliveryDate || 'your chosen date'}`);
              }}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand to-orange-400 text-white text-lg font-bold hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300"
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            
            <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white mt-8">
              <div className="p-6 font-bold text-gray-900 border-b border-gray-50">Rental Details</div>
              <div className="divide-y divide-gray-50">
                {[
                  ["Category", product.category],
                  ["Monthly Price (₹)", `${toINR(product.price)} (base)`],
                  ["Security Deposit", `${toINR(deposit)} (refundable)`],
                  ["Min Tenure", "3 months"],
                  ["Max Tenure", "24 months"],
                  ["Delivery", "Free within service areas"],
                  ["Maintenance", "Included in rental"],
                  ["Condition", "Excellent"]
                ].map(([k, v], i) => (
                  <div key={i} className="flex justify-between px-6 py-3">
                    <span className="text-sm text-gray-500">{k}</span>
                    <span className="text-sm font-bold text-gray-900 text-right">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {productReviews.length > 0 ? productReviews.map(r => (
                <div key={r.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900">{r.userName}</span>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} />)}
                  </div>
                  <p className="text-gray-600">{r.comment}</p>
                </div>
              )) : (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              )}
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Review Comment</Label>
                  <textarea 
                    value={newReview}
                    onChange={e => setNewReview(e.target.value)}
                    className="w-full mt-2 rounded-xl border-gray-200 p-3 h-24"
                    placeholder="How was your experience?"
                  />
                </div>
                <Button 
                  onClick={handleSubmitReview}
                  className="bg-brand text-white font-bold rounded-xl w-full h-11"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
