import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { ShoppingCart, Heart, UserCircle, Menu, Search, X, Bell, LayoutDashboard, Package, ShieldCheck, ClipboardList, LifeBuoy, Users, BarChart3, Wrench, LogOut, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { cart, wishlist, user, logout, notifications, markNotificationRead } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm' : 'bg-white/95 border-b border-gray-100'}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-400 text-xl group-hover:scale-105 transition-transform duration-300">RentEase</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link to="/furniture" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand">Furniture</Link>
            <Link to="/appliances" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand">Appliances</Link>
            <Link to="/plans" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand">Plans</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-brand transition-colors" />
            <Input 
              ref={searchInputRef}
              type="search" 
              placeholder="Search products..." 
              className="pl-9 pr-12 w-[240px] xl:w-[320px] bg-gray-50/80 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-brand/20 transition-all rounded-full h-9 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-2 pointer-events-none">
              <span className="hidden xl:inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
                <span className="text-xs">⌘</span>K
              </span>
            </div>
          </form>

          {/* Desktop Icons */}
          <Link to="/wishlist" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="relative hover:bg-brand/5 hover:text-brand transition-colors rounded-full" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span 
                    key={wishlist.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-white" 
                  />
                )}
              </AnimatePresence>
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-brand/5 hover:text-brand transition-colors rounded-full" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence mode="popLayout">
                {cart.length > 0 && (
                  <motion.span 
                    key={cart.length}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white ring-2 ring-white shadow-sm font-bold"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Link>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-brand/5 hover:text-brand transition-colors rounded-full hidden sm:inline-flex" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {notifications?.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white z-50 w-80 rounded-[1.5rem] p-0 overflow-hidden border-gray-100 shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                  <span className="font-bold">Notifications</span>
                  {notifications?.some(n => !n.read) && (
                    <span 
                      className="text-xs text-brand font-medium cursor-pointer hover:underline"
                      onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
                    >
                      Mark all read
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {(!notifications || notifications.length === 0) ? (
                    <div className="p-8 text-center text-sm text-gray-500">No new notifications</div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-orange-50/30' : ''}`} 
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && <span className="w-2 h-2 rounded-full bg-brand mt-1.5 shrink-0" />}
                          </div>
                          <p className={`text-xs ${!notif.read ? 'text-gray-600' : 'text-gray-500'}`}>
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2">{notif.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hidden sm:inline-flex overflow-hidden border-2 border-transparent hover:border-brand/20 transition-all">
                  <UserCircle className="h-6 w-6 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white z-50 w-56 rounded-2xl p-2 border-gray-100 shadow-xl">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                
                {user.role === 'user' && (
                  <>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/orders"><Package className="mr-2 h-4 w-4" /> My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/track/ORD-1234"><Map className="mr-2 h-4 w-4" /> Track Order</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/support"><LifeBuoy className="mr-2 h-4 w-4" /> Support</Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                {user.role === 'vendor' && (
                  <>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/vendor-dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/vendor/products"><ClipboardList className="mr-2 h-4 w-4" /> My Products</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/vendor/orders"><Package className="mr-2 h-4 w-4" /> Orders</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/admin-dashboard"><ShieldCheck className="mr-2 h-4 w-4" /> Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/admin/users"><Users className="mr-2 h-4 w-4" /> Users</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/admin/analytics"><BarChart3 className="mr-2 h-4 w-4" /> Analytics</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link to="/admin/maintenance"><Wrench className="mr-2 h-4 w-4" /> Maintenance</Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                  <div onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Log out</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex">
              <Button variant="default" className="bg-gradient-to-r from-brand to-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white rounded-full font-semibold transition-all duration-300">Sign In</Button>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full hover:bg-gray-100" 
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed inset-0 z-50 bg-white shadow-2xl h-[100dvh] flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
              ) : (
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-400 text-xl">RentEase</span>
              )}
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </Button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search products..." 
                  className="pl-10 w-full h-12 bg-gray-50 border-gray-200 rounded-2xl text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <nav className="flex flex-col gap-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Browse</div>
                <Link to="/furniture" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Furniture</Link>
                <Link to="/appliances" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Appliances</Link>
                <Link to="/plans" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Plans</Link>
              </nav>

              {user ? (
                <nav className="flex flex-col gap-1">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">My Account</div>
                  {user.role === 'user' && (
                    <>
                      <Link to="/profile" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <UserCircle className="mr-3 h-5 w-5 text-gray-400" /> Profile
                      </Link>
                      <Link to="/orders" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Package className="mr-3 h-5 w-5 text-gray-400" /> My Orders
                      </Link>
                      <Link to="/track/ORD-1234" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Map className="mr-3 h-5 w-5 text-gray-400" /> Track Order
                      </Link>
                      <Link to="/support" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <LifeBuoy className="mr-3 h-5 w-5 text-gray-400" /> Support
                      </Link>
                    </>
                  )}
                  {user.role === 'vendor' && (
                    <>
                      <Link to="/vendor-dashboard" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400" /> Dashboard
                      </Link>
                      <Link to="/vendor/products" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <ClipboardList className="mr-3 h-5 w-5 text-gray-400" /> My Products
                      </Link>
                      <Link to="/vendor/orders" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Package className="mr-3 h-5 w-5 text-gray-400" /> Orders
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin-dashboard" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShieldCheck className="mr-3 h-5 w-5 text-gray-400" /> Dashboard
                      </Link>
                      <Link to="/admin/users" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Users className="mr-3 h-5 w-5 text-gray-400" /> Users
                      </Link>
                      <Link to="/admin/analytics" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <BarChart3 className="mr-3 h-5 w-5 text-gray-400" /> Analytics
                      </Link>
                      <Link to="/admin/maintenance" className="px-4 py-3 text-lg font-semibold rounded-2xl hover:bg-brand/5 hover:text-brand transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Wrench className="mr-3 h-5 w-5 text-gray-400" /> Maintenance
                      </Link>
                    </>
                  )}
                </nav>
              ) : (
                <div className="pt-4 mt-auto">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-brand to-orange-400 text-white rounded-2xl h-14 text-lg font-bold shadow-md">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>

            {user && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 pb-8">
                <Button variant="outline" className="w-full rounded-2xl h-12 text-red-600 border-red-200 hover:bg-red-50 font-bold" onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" /> Sign Out
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
