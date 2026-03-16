import React, { useEffect, useState } from "react";
import {
  AddShoppingCart,
  FavoriteBorder,
  Visibility,
  KeyboardArrowRight,
  Search,
  Save,
} from "@mui/icons-material";
import { getData, postData } from "../../../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { searchQuery } = useOutletContext();
  const navigate = useNavigate();

  const getProducts = async () => {
    setLoading(true);
    let url = "products";

    // check search first so category doesn't block it
    if (searchQuery) {
      console.log('searchQuery:', searchQuery);
      url += "?search=" + searchQuery;
    } else if (activeCategory && activeCategory !== "all") {
      url += "?category_id=" + activeCategory;
    }

    try {
      const response = await getData(url, null, 'customer');
      if (response.status === 200) {
        setProducts(response.data.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const getProductImage = (product) => {
    // Find the main product image (where product_variant_id is null)
    const mainImage = product.product_images?.find(img => img.product_variant_id === null);
    
    // If no main image found, use the first available image
    return mainImage ? mainImage.image_url : 
           product.product_images?.length > 0 ? product.product_images[0].image_url : 
           'https://via.placeholder.com/400x300?text=No+Image'; // Fallback image
  };

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await getData("categories", null, 'customer');
      if (response.status === 200) {
        console.log(response.data.data);
        setCategories(response.data.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleFavProductClick = async(productId)=>{
    let response = await postData('customer/fav-products/'+productId,null, 'customer');
    if(response.status==200)
    {
      toast.success("The selected product has been added to your favourite list successfully");
    }
  }

    const handleSaveProductClick = async(productId)=>{
    let response = await postData('customer/save-products/'+productId,null, 'customer');
    if(response.status==200)
    {
      toast.success("The selected product has been added to your save list successfully");
    }
  }

  useEffect(() => {
    getProducts();
    getCategories();
    console.log(activeCategory);
  }, [activeCategory, searchQuery]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Loading Skeleton Component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-56 bg-gradient-to-r from-gray-200 to-gray-300"></div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className="p-5">
        <div className="h-6 bg-gray-300 rounded-lg w-3/4 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-300 rounded-lg w-20"></div>
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  // Category Skeleton
  const CategorySkeleton = () => (
    <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
  );

  if (initialLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Category Skeletons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[...Array(6)].map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
        </div>

        {/* Products Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Our Products
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our amazing collection of premium products tailored just for you
        </p>
        {searchQuery && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full"
          >
            <Search className="h-4 w-4" />
            <span>Search results for: "{searchQuery}"</span>
          </motion.div>
        )}
      </motion.div>

      {/* Category Filters */}
      {!categoriesLoading && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow"
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow"
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>
      )}

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="products"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                onClick={() => navigate('/products/' + product.id)}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavProductClick(product.id);
                      }}
                      className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
                    >
                      <FavoriteBorder className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveProductClick(product.id);
                      }}
                      className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
                    >
                      <Save className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" />
                    </button>
                  </div>

                  {/* Discount Badge (example) */}
                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating (example) */}
                  {product.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < product.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-500 ml-1">
                        ({product.reviews || 0})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                    >
                      <AddShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No products message */}
      {!loading && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 12H4M12 4v16"
              />
            </svg>
            <p className="text-gray-600 text-lg mb-2">
              No products found
            </p>
            <p className="text-gray-500">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : "Try selecting a different category or check back later"}
            </p>
            {searchQuery && (
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Clear Search
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Products;