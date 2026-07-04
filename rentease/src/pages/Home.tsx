import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Zap, Truck, RotateCcw, Star, Wrench } from "lucide-react";
import { useApp } from "@/hooks/useApp";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "@/components/ui/ProductCard";
import { toINR } from "@/lib/utils";

const BRANDS = ["SAMSUNG", "LG", "SONY", "IKEA", "ASHLEY", "WHIRLPOOL", "BOSCH"];

export default function Home() {
  const { products, testimonials, recentlyViewed } = useApp();
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sort by popularity for Featured/Trending
  const featuredProducts = [...products]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 3);

  // Sort by createdAt for New Arrivals
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt || "2000-01-01").getTime() - new Date(a.createdAt || "2000-01-01").getTime())
    .slice(0, 4);

  const recentProducts = recentlyViewed
    ?.map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4) || [];

  return (
    <motion.div 
      initial={{ opacity: 1, y: 0 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen pb-20 md:pb-0" // pb for mobile sticky CTA
    >
      {/* Premium Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#fdfaf8] border-b border-gray-100">
        {/* Dynamic Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-200/40 blur-[100px]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-brand/10 blur-[100px]" />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-orange-100 text-brand text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 w-fit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                Welcome to the Future
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-gray-900">
                Live Better. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-rose-400">Pay Monthly.</span>
              </h1>
              <p className="max-w-[450px] text-lg text-gray-500 leading-relaxed">
                Premium furniture and top-tier appliances available on flexible monthly subscriptions. Upgrade, downgrade, or cancel anytime.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link to="/furniture" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] text-white rounded-xl font-bold transition-all duration-300 h-12 px-8">
                    Browse Catalog
                  </Button>
                </Link>
                <Link to="/plans" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full border-gray-200 hover:bg-gray-50 rounded-xl font-bold h-12 px-8">
                    How it Works
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:flex flex-1 relative min-h-[400px] justify-center items-center"
            >
              {/* Decorative Gray Box */}
              <div className="absolute top-10 right-10 w-64 h-64 bg-gray-100 rounded-3xl rotate-6 shadow-inner" />
              
              {/* Hero Image Card */}
              <div className="absolute right-0 w-[80%] bg-white rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col group border border-gray-100">
                <div className="h-64 bg-gray-50 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" alt="Signature Sofa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 bg-white relative">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Signature Series</div>
                  <div className="text-xl font-bold text-gray-900">The Oslo Velvet Sofa</div>
                  <div className="text-brand font-bold text-lg mt-1">{toINR(1299, true)}/mo</div>
                </div>
              </div>

              {/* Floating Pill */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-20 left-0 z-20 bg-white px-4 py-3 rounded-full shadow-xl flex items-center gap-3 border border-gray-50"
              >
                <div className="bg-orange-100 p-2 rounded-full text-brand"><ShieldCheck className="h-4 w-4" /></div>
                <span className="font-bold text-sm text-gray-900">Free Maintenance</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="container py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <ShieldCheck className="h-5 w-5 text-brand" />, title: "Deposit Protected", desc: "100% refundable deposit" },
            { icon: <Truck className="h-5 w-5 text-brand" />, title: "Free Delivery", desc: "Within service areas" },
            { icon: <Wrench className="h-5 w-5 text-brand" />, title: "Free Maintenance", desc: "During your rental period" },
            { icon: <RotateCcw className="h-5 w-5 text-brand" />, title: "Easy Returns", desc: "Hassle-free pickup" },
          ].map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="rounded-2xl border-gray-100 shadow-sm bg-white p-5 text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">{b.icon}</div>
                <p className="font-bold text-gray-900 text-sm">{b.title}</p>
                <p className="text-xs text-gray-400 mt-1">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ticker Strip */}
      <div className="w-full bg-brand text-white overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-4 text-sm font-bold tracking-widest uppercase">
              <span className="mx-4">Free Delivery</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span className="mx-4">Zero Deposit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span className="mx-4">Cancel Anytime</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span className="mx-4">Free Maintenance</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof Brands */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Premium Brands We Stock</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {BRANDS.map((brand) => (
              <span key={brand} className="text-xl md:text-2xl font-black text-gray-800 tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">How it Works</h2>
            <p className="text-gray-500 mt-2">Get your dream home setup in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Animated Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-200 -translate-y-1/2 -z-0">
              <motion.div 
                className="h-full bg-brand"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>

            {[
              { icon: <Zap className="w-8 h-8 text-brand" />, title: "1. Choose", desc: "Select from our wide range of premium furniture and appliances." },
              { icon: <Truck className="w-8 h-8 text-brand" />, title: "2. Receive", desc: "We deliver and assemble everything for free at your preferred time." },
              { icon: <RotateCcw className="w-8 h-8 text-brand" />, title: "3. Enjoy & Upgrade", desc: "Keep it, upgrade to something new, or return it whenever you want." },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-card mb-6 border border-gray-50">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Trending */}
      <section className="w-full py-20 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured & Trending</h2>
              <p className="text-gray-500 mt-2">Our most popular items right now.</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-gray-200"><ArrowRight className="h-4 w-4 rotate-180" /></Button>
              <Button variant="outline" size="icon" className="rounded-full border-gray-200"><ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Brand Card (4th Item) */}
            <div className="bg-dark rounded-[2rem] p-6 flex flex-col justify-between text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-8">
                <Zap className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">The RentEase Promise</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Zero deposits. Free delivery & setup. Free maintenance throughout your tenure. Upgrade anytime.
                </p>
                <Link to="/plans" className="inline-flex items-center text-brand font-bold text-sm hover:text-orange-400 transition-colors">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="w-full py-20 bg-gray-50">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 mt-2">The latest additions to our catalog.</p>
            </div>
            <Link to="/furniture" className="hidden sm:inline-flex text-brand font-bold hover:text-orange-400 transition-colors items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={`new-${product.id}`} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/furniture">
              <Button variant="outline" className="rounded-xl font-bold">
                View All Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-brand/5 border-t border-brand/10">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">What Our Renters Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{t.productCategory} Renter</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="container py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map(p => p && <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>
      )}

      {/* Sticky CTA (Mobile Only) */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40"
          >
            <Link to="/furniture" className="w-full">
              <Button className="w-full bg-gradient-to-r from-brand to-orange-400 text-white rounded-xl h-12 font-bold shadow-md">
                Browse Catalog
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
