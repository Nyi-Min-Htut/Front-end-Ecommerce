import React, { useEffect, useState } from "react";
import {
  AddShoppingCart,
  FavoriteBorder,
  Visibility,
} from "@mui/icons-material";
import { getData } from "../../../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ProductByCategory = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const getProducts = async (categoryId) => {
    setLoading(true);
    let url = "products";
    
    if (categoryId && categoryId !== "all") {
      url += "?category_id=" + categoryId;
    }

    try {
      const response = await getData(url, null, 'customer');
      
      if (response.status === 200) {
        let productsData = [];
        
        if (response.data.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
          productsData = response.data.data.data;
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
        }
        
        setProducts(productsData);
      } else {
        toast.error("Something went wrong");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (!product.product_images || product.product_images.length === 0) {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    const mainImage = product.product_images.find(img => img.product_variant_id === null);
    return mainImage ? mainImage.image_url : product.product_images[0].image_url;
  };

  const getProductStock = (product) => {
    if (product.product_variants && product.product_variants.length > 0) {
      return product.product_variants.reduce((total, variant) => total + (variant.stock || 0), 0);
    }
    return product.total_stock || 0;
  };

  const getProductPrice = (product) => {
    if (product.product_variants && product.product_variants.length > 0) {
      const prices = product.product_variants.map(v => parseFloat(v.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return `$${minPrice.toFixed(2)}`;
      }
      return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
    }
    return `$${parseFloat(product.price).toFixed(2)}`;
  };

  const getCategories = async () => {
    try {
      const response = await getData("categories", null, 'customer');
      
      if (response.status === 200) {
        let categoriesData = [];
        
        if (response.data.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
        }
        
        setCategories(categoriesData);
        
        // Find category name from URL param
        if (id && id !== "all") {
          const category = categoriesData.find(cat => cat.id.toString() === id);
          if (category) {
            setCategoryName(category.name);
            setActiveCategory(id);
          }
        } else {
          setActiveCategory("all");
          setCategoryName("");
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Load categories on mount
  useEffect(() => {
    getCategories();
  }, []);

  // Load products when URL param changes
  useEffect(() => {
    if (id) {
      setActiveCategory(id);
      getProducts(id);
    } else {
      setActiveCategory("all");
      getProducts("all");
    }
  }, [id]);

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "all") {
      navigate('/products/category/all');
    } else {
      navigate(`/products/category/${categoryId}`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    toast.success(`${product.name} added to cart!`);
  };

  const handleFavorite = (e, product) => {
    e.stopPropagation();
    toast.info(`${product.name} added to favorites!`);
  };

  const handleQuickView = (e, product) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {id && id !== "all" ? categoryName || 'Category' : 'All Products'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {id && id !== "all" && categoryName
              ? `Discover our amazing collection of ${categoryName.toLowerCase()} products` 
              : 'Explore our wide range of high-quality products tailored just for you'
            }
          </p>
          
          {/* Breadcrumb */}
          {id && id !== "all" && categoryName && (
            <div className="flex justify-center items-center gap-2 mt-6 text-sm">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Home
              </button>
              <span className="text-gray-400">•</span>
              <button 
                onClick={() => navigate('/categories')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Categories
              </button>
              <span className="text-gray-400">•</span>
              <span className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                {categoryName}
              </span>
            </div>
          )}
        </div>

        {/* Category Filters */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200 scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id.toString()
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Results Info */}
        <div className="text-center mb-8">
          <p className="text-gray-500 bg-white inline-block px-6 py-2 rounded-full shadow-sm">
            <span className="font-semibold text-blue-600">{products.length}</span> product{products.length !== 1 ? 's' : ''} found
            {activeCategory !== "all" && categoryName && 
              <span> in <span className="font-semibold text-purple-600">"{categoryName}"</span></span>
            }
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const stock = getProductStock(product);
              const price = getProductPrice(product);
              const hasVariants = product.product_variants && product.product_variants.length > 1;
              
              return (
                <div
                  onClick={() => navigate('/products/' + product.id)}
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-transparent relative"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-56 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                    
                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={(e) => handleFavorite(e, product)}
                        className="bg-white p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:scale-110"
                      >
                        <FavoriteBorder className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => handleQuickView(e, product)}
                        className="bg-white p-2.5 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 hover:scale-110"
                      >
                        <Visibility className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Stock Status Badge */}
                    {stock === 0 ? (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    ) : stock < 5 ? (
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                          Only {stock} left
                        </span>
                      </div>
                    ) : null}
                    
                    {/* Brand Badge */}
                    {product.brand && product.brand.name && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                          {product.brand.name}
                        </span>
                      </div>
                    )}
                    
                    {/* Variants Badge */}
                    {hasVariants && (
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                          {product.product_variants.length} variants
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                      {product.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {price}
                        </span>
                        {stock > 0 && (
                          <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                            {stock} in stock
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={stock === 0}
                        className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg ${
                          stock === 0 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        <AddShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* No products message */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1m4 0h-4m4 6v2m-4-2v2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-8">
                {activeCategory !== "all" && categoryName
                  ? `We couldn't find any products in the ${categoryName} category. Try selecting a different category.`
                  : 'No products are available at the moment. Please check back later.'
                }
              </p>
              {activeCategory !== "all" && categoryName && (
                <button
                  onClick={() => handleCategoryClick("all")}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  View All Products
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductByCategory;