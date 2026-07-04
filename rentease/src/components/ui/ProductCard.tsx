import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/types";
import { useApp } from "@/hooks/useApp";
import { Button } from "./button";
import { toINR } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const tenures = [3, 6, 12];

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, addToWishlist, removeFromWishlist } = useApp();
  const [selectedTenure, setSelectedTenure] = useState<number>(6);
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    // This will be implemented with a Dialog in a future update
    console.log("Quick view:", product.name);
  };

  // Calculate dynamic price based on tenure (mock logic)
  const monthlyPrice = selectedTenure === 3 ? Math.round(product.price * 1.2) : selectedTenure === 12 ? Math.round(product.price * 0.8) : product.price;

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="block group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="rounded-3xl border border-gray-100 p-4 flex flex-col gap-4 shadow-card hover:shadow-hover hover:-translate-y-1 bg-white overflow-hidden transition-all duration-300 h-full relative">
        <div className="aspect-square bg-gray-50 rounded-2xl relative overflow-hidden group-hover:bg-gray-100 transition-colors">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          
          {/* Wishlist Button */}
          <button 
            onClick={toggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-white hover:bg-white shadow-sm z-10 transition-colors"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            </motion.div>
          </button>

          {/* Quick View Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
          >
            <Button 
              size="sm" 
              variant="secondary" 
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md text-xs font-bold"
              onClick={handleQuickView}
            >
              <Eye className="mr-2 h-3 w-3" /> Quick View
            </Button>
          </motion.div>

          {product.inStock && (
            <span className="absolute top-3 left-3 bg-success text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase shadow-sm">
              In Stock
            </span>
          )}
        </div>
        
        <div className="flex flex-col flex-1">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{product.category}</p>
          <h3 className="text-md font-bold text-gray-900 mt-1 line-clamp-1">{product.name}</h3>
          
          {/* Tenure Chips */}
          <div className="flex gap-1.5 mt-3 mb-2" onClick={(e) => e.preventDefault()}>
            {tenures.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTenure(t)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors ${selectedTenure === t ? 'bg-brand/10 border-brand/30 text-brand' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'}`}
              >
                {t}mo
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
            <div className="text-lg font-bold text-gray-900">
              {toINR(monthlyPrice, true)}
            </div>
            <div className="text-brand text-sm font-bold sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0 transition-all duration-300">
              + Rent
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
