import React, { useEffect, useState } from "react";
import {
  AddShoppingCart,
  FavoriteBorder,
  Visibility,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { getData } from "../../../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate, useOutletContext } from "react-router-dom";

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const {searchQuery} = useOutletContext();
  const navigate = useNavigate();

  const getProducts = async () => {
  let url = "products";

  // check search first so category doesn't block it
  if (searchQuery) {
    console.log('searchQuery:', searchQuery);
    url += "?search=" + searchQuery;
  } else if (activeCategory && activeCategory !== "all") {
    url += "?category_id=" + activeCategory;
  }

  const response = await getData(url,null,'customer');
  if (response.status === 200) {
    setProducts(response.data.data);
    console.log("it worked");
  } else {
    toast.error("Something went wrong");
  }
};

 const getProductImage = (product) => {
    // Find the main product image (where product_variant_id is null)
    const mainImage = product.product_images.find(img => img.product_variant_id === null);
    
    // If no main image found, use the first available image
    return mainImage ? mainImage.image_url : 
           product.product_images.length > 0 ? product.product_images[0].image_url : 
           '/placeholder-image.jpg'; // Fallback image
  };

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    let response;
    response = await getData("categories",null,'customer');
    if (response.status === 200) {
      console.log(response.data.data);
      setCategories(response.data.data);
    } else {
      toast.error("Somethings went wrong");
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
    console.log(activeCategory);
  }, [activeCategory,searchQuery]);



  // Filter products by category

  // Products to display

  // Load more products
  const loadMore = () => {
    setVisibleProducts((prev) => prev + 4);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
        <p className="mt-4 text-lg text-gray-600">
          Discover our amazing collection of products
        </p>
      </div>

      {/* Category Filters */}
      {categories && (
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              onClick={()=>navigate('/products/'+product.id)}
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                    <FavoriteBorder className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                    <Visibility className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
                    <AddShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* See More Button */}

      {/* No products message */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
