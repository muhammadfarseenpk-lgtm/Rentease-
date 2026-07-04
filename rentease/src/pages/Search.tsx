import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "motion/react";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toINR } from "@/lib/utils";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { products, recentlyViewed } = useApp();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minTenure, setMinTenure] = useState<number | null>(null);
  const [sort, setSort] = useState("Relevance");
  const [visibleCount, setVisibleCount] = useState(12);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase()) || 
                            p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesPrice = p.price <= maxPrice;
      const matchesTenure = !minTenure || (p.minTenure && p.minTenure <= minTenure);
      return matchesSearch && matchesCategory && matchesPrice && matchesTenure;
    }).sort((a, b) => {
      if (sort === "LowHigh") return a.price - b.price;
      if (sort === "HighLow") return b.price - a.price;
      return 0; // Relevance
    });
  }, [products, query, categoryFilter, maxPrice, minTenure, sort]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewed.map(id => products.find(p => p.id === id)).filter(Boolean) as any[];
  }, [recentlyViewed, products]);

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-12">
      <div className="container">
        
        <div className="mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Search Results
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            {filteredProducts.length} results for <span className="font-bold text-brand">"{query}"</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-gray-900 mb-6">
                <Filter className="w-5 h-5" /> Filters
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Category</h4>
                  <div className="space-y-2">
                    {["all", "furniture", "appliances"].map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category"
                          checked={categoryFilter === cat}
                          onChange={() => setCategoryFilter(cat)}
                          className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand cursor-pointer"
                        />
                        <span className={`capitalize text-sm font-medium ${categoryFilter === cat ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Max Price: {toINR(maxPrice)}</h4>
                  <input 
                    type="range" 
                    min="0" max="10000" step="100" 
                    value={maxPrice} 
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tenure</h4>
                  <div className="flex flex-wrap gap-2">
                    {[3, 6, 12].map(t => (
                      <button 
                        key={t}
                        onClick={() => setMinTenure(minTenure === t ? null : t)}
                        className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${minTenure === t ? 'bg-orange-100 text-brand' : 'text-gray-500 hover:bg-gray-100 bg-gray-50'}`}
                      >
                        {t}m+
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Sort</h4>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-full rounded-xl border-gray-200 h-10 bg-white">
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
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="w-20 h-20 bg-orange-50 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500 mb-8">We couldn't find anything matching "{query}".</p>
                <Button asChild className="bg-brand text-white rounded-full px-8">
                  <Link to="/furniture">Browse All Furniture</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial="hidden" animate="show"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                  {displayedProducts.map((product) => (
                    <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
            )}

            {visibleCount < filteredProducts.length && (
              <div className="mt-12 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setVisibleCount(v => v + 12)}
                  className="rounded-full font-bold px-8 h-12 border-gray-200 hover:border-brand hover:text-brand transition-colors"
                >
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>

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
