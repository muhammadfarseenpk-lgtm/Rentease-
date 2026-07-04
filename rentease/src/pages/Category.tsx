import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/hooks/useApp";
import { toINR } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";

const furnitureSub = ["All", "Bed", "Sofa", "Table", "Chair", "Wardrobe"];
const appliancesSub = ["All", "Fridge", "Washing Machine", "TV", "AC", "Microwave"];

export default function Category() {
  const { pathname } = useLocation();
  const isFurniture = pathname.includes("furniture");
  const categoryLabel = isFurniture ? "Furniture" : "Appliances";
  const categoryValue = isFurniture ? "furniture" : "appliances";
  const subCategories = isFurniture ? furnitureSub : appliancesSub;

  const { products, recentlyViewed } = useApp();
  
  const [activeSubCat, setActiveSubCat] = useState("All");
  const [sort, setSort] = useState("Relevance");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [durationFilter, setDurationFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter out products by top-level category
  const catProducts = products.filter(p => p.category === categoryValue);

  const filteredProducts = useMemo(() => {
    return catProducts.filter(p => {
      if (activeSubCat !== "All" && !p.name.toLowerCase().includes(activeSubCat.toLowerCase())) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (durationFilter !== "All" && (p.minTenure || 1) > parseInt(durationFilter)) return false;
      return true;
    }).sort((a, b) => {
      if (sort === "LowHigh") return a.price - b.price;
      if (sort === "HighLow") return b.price - a.price;
      return 0; // Relevance
    });
  }, [catProducts, activeSubCat, priceRange, durationFilter, sort]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewed.map(id => products.find(p => p.id === id)).filter(Boolean) as any[];
  }, [recentlyViewed, products]);

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-12 pb-24">
      <div className="container px-6 lg:px-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{categoryLabel}</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 flex flex-wrap gap-2">
            {subCategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubCat(sub)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  activeSubCat === sub
                    ? "bg-brand text-white shadow"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center bg-white p-3 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 px-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Price:</span>
              <Input type="number" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                className="w-20 h-8 text-xs rounded-lg border-gray-200" placeholder="Min" />
              <span className="text-gray-400 text-xs">to</span>
              <Input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                className="w-20 h-8 text-xs rounded-lg border-gray-200" placeholder="Max" />
            </div>
            
            <div className="h-6 w-px bg-gray-200 hidden md:block" />
            
            <div className="flex items-center gap-2 px-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Tenure:</span>
              {["All", "1", "3", "6"].map(t => (
                <button 
                  key={t}
                  onClick={() => setDurationFilter(t)}
                  className={`text-xs px-2 py-1 rounded-full font-bold transition-colors ${durationFilter === t ? 'bg-orange-100 text-brand' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {t === "All" ? "All" : `${t}+ mo`}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[140px] rounded-full border-none h-8 bg-transparent focus:ring-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Relevance">Relevance</SelectItem>
                <SelectItem value="LowHigh">Price: Low–High</SelectItem>
                <SelectItem value="HighLow">Price: High–Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-500 font-bold">{filteredProducts.length} products found</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">{isFurniture ? "🛋️" : "📦"}</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products in this category yet</h3>
            <p className="text-gray-500 mb-6">Try selecting a different filter or check back later.</p>
            <Link to="/">
              <Button className="bg-brand text-white rounded-xl font-bold h-11 px-8 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                Browse All
              </Button>
            </Link>
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              onClick={() => setVisibleCount(v => v + 12)}
              className="rounded-full font-bold px-8 h-12 border-gray-200 hover:border-brand hover:text-brand transition-colors"
            >
              Load More Products
            </Button>
          </div>
        )}

        {recentlyViewedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewedProducts.slice(0, 4).map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="bg-white rounded-2xl p-3 border border-gray-100 hover:shadow-md transition-all flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</h4>
                      <p className="text-xs text-brand font-bold mt-1">{toINR(p.price)}/mo</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
