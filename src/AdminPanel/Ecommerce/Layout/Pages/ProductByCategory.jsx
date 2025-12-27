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
  const { id } = useParams(); // Get category ID from URL params

  const getProducts = async () => {
    console.log('it worked');
    setLoading(true);
    let url = "products";

    if (activeCategory && activeCategory !== "all") {
      url += "?category_id=" + activeCategory;
    }
    console.log
    try {
      const response = await getData(url, null, 'customer');
      if (response.status === 200) {
        setProducts(response.data.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    // Find the main product image (where product_variant_id is null)
    const mainImage = product.product_images.find(img => img.product_variant_id === null);
    
    // If no main image found, use the first available image
    return mainImage ? mainImage.image_url : 
           product.product_images.length > 0 ? product.product_images[0].image_url : 
           '/placeholder-image.jpg';
  };

  const getCategories = async () => {
    try {
      const response = await getData("categories", null, 'customer');
      if (response.status === 200) {
        setCategories(response.data.data);
        
        // Find and set the category name from the ID in URL
        if (id && id !== "all") {
          const category = response.data.data.find(cat => cat.id.toString() === id);
          if (category) {
            setCategoryName(category.name);
            setActiveCategory(id);
          }
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    // Set active category from URL params
    if (id) {
      setActiveCategory(id);
    }
    getCategories();
  }, [id]);

  useEffect(() => {
    getProducts();
  }, [activeCategory]);

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "all") {
      navigate('/products/category/all');
    } else {
      navigate(`/products/category/${categoryId}`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    console.log('Add to cart:', product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleFavorite = (e, product) => {
    e.stopPropagation();
    console.log('Add to favorite:', product);
    toast.info(`${product.name} added to favorites!`);
  };

  const handleQuickView = (e, product) => {
    e.stopPropagation();
    console.log('Quick view:', product);
    toast.info(`Quick view: ${product.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {id && id !== "all" ? `${categoryName} Products` : 'Our Products'}
        </h2>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          {id && id !== "all" 
            ? `Discover amazing ${categoryName.toLowerCase()} products` 
            : 'Discover our amazing collection of products tailored just for you'
          }
        </p>
        
        {/* Breadcrumb */}
        {id && id !== "all" && (
          <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-500">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <span>›</span>
            <button 
              onClick={() => navigate('/categories')}
              className="hover:text-blue-600 transition-colors"
            >
              Categories
            </button>
            <span>›</span>
            <span className="text-blue-600 font-medium">{categoryName}</span>
          </div>
        )}
      </div>

      {/* Category Filters */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeCategory === "all"
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === category.id.toString()
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Results Info */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
          {activeCategory !== "all" && categoryName && 
            ` in "${categoryName}"`
          }
        </p>
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              onClick={() => navigate('/products/' + product.id)}
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => handleFavorite(e, product)}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                  >
                    <FavoriteBorder className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => handleQuickView(e, product)}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-colors duration-200"
                  >
                    <Visibility className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Stock Status */}
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
                
                {/* Brand Badge */}
                {product.brand && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                      {product.brand.name}
                    </span>
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    {product.stock > 0 && (
                      <p className="text-green-600 text-xs mt-1">
                        {product.stock} in stock
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock === 0}
                    className={`p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg ${
                      product.stock === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <AddShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No products message */
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1m4 0h-4m4 6v2m-4-2v2" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              No products found
            </p>
            <p className="text-gray-400 text-sm">
              {activeCategory !== "all" 
                ? `No products found in ${categoryName} category. Try selecting a different category.`
                : 'No products available at the moment.'
              }
            </p>
            {activeCategory !== "all" && (
              <button
                onClick={() => handleCategoryClick("all")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Products
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductByCategory;