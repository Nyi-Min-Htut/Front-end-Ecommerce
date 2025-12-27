import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Close,
  Search,
  ShoppingCart,
  Person,
  Favorite,
} from "@mui/icons-material";

const Navbar = ({ onSearchChange, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activePath, setActivePath] = useState("/");
  const location = useLocation();
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem("customer_auth_user"));


  const [cartCount, setCartCount] = useState(0);
  const [cartUpdated, setCartUpdated] = useState(0); // Force re-render

  // Load cart count from localStorage
  const loadCartCount = useCallback(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  }, []);

  // Initial load and route change
  useEffect(() => {
    setActivePath(location.pathname);
    loadCartCount();
  }, [location, loadCartCount]);

  // Enhanced event listener setup
  useEffect(() => {
    const handleCartUpdate = (e) => {
      console.log('Cart update event received:', e.type);
      loadCartCount();
      // Force re-render
      setCartUpdated(prev => prev + 1);
    };

    // Listen to custom event
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Listen to storage events (if cart is updated in another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        handleCartUpdate(e);
      }
    });

    // Polling for cart changes (fallback)
    const intervalId = setInterval(() => {
      loadCartCount();
    }, 1000);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
      clearInterval(intervalId);
    };
  }, [loadCartCount]);

  // Shopping Cart button component
  const ShoppingCartButton = () => (
    <div className="ml-2 relative">
      <button 
        onClick={() => navigate('/shopping_cart')}
        className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="sr-only">Cart</span>
      </button>
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </div>
  );

  // Rest of your Navbar component remains the same...
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchChange) onSearchChange(search);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isCategoryActive = activePath.includes("/categories") || 
                          activePath.includes("/products/category");
  const isHomeActive = activePath === "/" || activePath === "/home";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <button 
                onClick={() => navigate("/")}
                className="text-2xl cursor-pointer font-bold text-blue-600 hover:text-blue-700"
              >
                Phones
              </button>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {/* Navigation buttons */}
              <button
                onClick={() => handleNavigation("/")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isHomeActive
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavigation("/categories")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isCategoryActive
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Categories
              </button>

              <button
                onClick={() => handleNavigation("/orderedlist")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activePath.includes("/orderedlist")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Orders
              </button>

              <button
                onClick={() => handleNavigation("/about_us")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activePath.includes("/about_us")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                About
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <form onSubmit={handleSearch}>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search products..."
                    type="search"
                  />
                </form>
                {!search && (
                  <button
                    onClick={handleSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    <span className="text-sm text-gray-400 hover:text-gray-600">
                      Press Enter or click →
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Search Icon (mobile only) */}
              <button 
                onClick={handleSearch}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:hidden"
              >
                <Search className="h-6 w-6" />
                <span className="sr-only">Search</span>
              </button>

              {/* Wishlist Icon */}
              <button 
                onClick={() => navigate('/wishlist')}
                className="ml-2 p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Favorite className="h-6 w-6" />
                <span className="sr-only">Wishlist</span>
              </button>

              {/* Shopping Cart */}
              <ShoppingCartButton key={cartUpdated} /> {/* Re-render on update */}

              {/* User Account */}
              <div className="ml-2">
                <button 
                  onClick={()=>navigate('/profile')}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {authUser ? (
                    <img
                      src={authUser.image_url}
                      alt="User profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <Person
                    onClick={() => navigate('/login')}
                     className="h-6 w-6" />
                  )}
                  <span className="sr-only">Account</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="mr-2 flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <Close className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - same as before */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavigation("/")}
              className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isHomeActive
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavigation("/categories")}
              className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isCategoryActive
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              }`}
            >
              Categories
            </button>

            <button
              onClick={() => handleNavigation("/orderedlist")}
              className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                activePath.includes("/orderedlist")
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              }`}
            >
              Orders
            </button>

            <button
              onClick={() => handleNavigation("/about_us")}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              About
            </button>

            {/* Mobile Search */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <form onSubmit={handleSearch}>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search products..."
                    type="search"
                  />
                </form>
              </div>
            </div>
          </div>

          {/* User section in mobile menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {authUser?.image_url ? (
                  <img
                    src={authUser.image_url}
                    alt="User profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Person className="h-6 w-6 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {authUser?.name || "Guest"}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {authUser?.email || "Sign in to your account"}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button 
                onClick={() => navigate('/profile')}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Your Profile
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Settings
              </button>
              <button 
                onClick={() => navigate(authUser ? '/logout' : '/login')}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {authUser ? "Sign out" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;