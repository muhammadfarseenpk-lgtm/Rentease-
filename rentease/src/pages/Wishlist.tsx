import { Link } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Bell } from "lucide-react";
import { toast } from "sonner";
import { toINR } from "@/lib/utils";
import { motion } from "motion/react";

export default function Wishlist() {
  const { wishlist, products, removeFromWishlist, addToCart } = useApp();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const moveToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    if (!product.inStock) {
      toast.error("Product is currently out of stock");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
      tenure: "12" // default tenure
    });
    removeFromWishlist(productId);
    toast.success("Moved to cart!");
  };

  const handleNotify = (productId: string) => {
    toast.success("We will notify you when this item is back in stock!");
  };

  return (
    <div className="bg-[#fdfaf8] min-h-screen py-12 pb-24">
      <div className="container px-6 lg:px-20">
        <h1 className="text-3xl font-bold mb-8 tracking-tight text-gray-900">Your Wishlist</h1>
        
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <HeartIcon />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Save items you like and they will appear here. Start browsing to build your dream space.</p>
            <Button asChild className="bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] text-white rounded-xl h-12 px-8 font-bold transition-all">
              <Link to="/furniture">Browse Furniture</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="rounded-[2rem] border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden flex flex-col relative group">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white text-red-500 hover:bg-red-50 shadow-sm"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <CardContent className="p-6 flex-1">
                    <p className="text-xs text-brand font-bold uppercase tracking-wider mb-2">{product.category}</p>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-gray-900">{toINR(product.price)}</span>
                      <span className="text-xs text-gray-500 font-bold">/mo</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    {product.inStock ? (
                      <Button 
                        className="w-full rounded-xl bg-brand text-white font-bold h-11 hover:bg-brand-dark" 
                        onClick={() => moveToCart(product.id)}
                      >
                        Move to Cart
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-full rounded-xl border-gray-200 text-gray-700 font-bold h-11 hover:border-brand hover:text-brand transition-colors" 
                        onClick={() => handleNotify(product.id)}
                      >
                        <Bell className="w-4 h-4 mr-2" /> Notify Me
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <div className="mx-auto w-16 h-16 bg-orange-50 text-brand rounded-full flex items-center justify-center mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </div>
  );
}
