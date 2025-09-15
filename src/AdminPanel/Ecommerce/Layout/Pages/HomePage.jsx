import React, { useState } from 'react';
import {
  AddShoppingCart,
  FavoriteBorder,
  Visibility,
  KeyboardArrowRight
} from '@mui/icons-material';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(5);

  // Sample product data
  const products = [
    { id: 1, name: 'Wireless Headphones', price: 89.99, category: 'electronics', image: 'https://root-nation.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2024/09/20240508_151305-scaled.jpg.webp' },
    { id: 2, name: 'Running Shoes', price: 129.99, category: 'sports', image: 'https://via.placeholder.com/300x300?text=Shoes' },
    { id: 3, name: 'Cotton T-Shirt', price: 24.99, category: 'clothing', image: 'https://via.placeholder.com/300x300?text=T-Shirt' },
    { id: 4, name: 'Smart Watch', price: 199.99, category: 'electronics', image: 'https://via.placeholder.com/300x300?text=Watch' },
    { id: 5, name: 'Coffee Maker', price: 59.99, category: 'home', image: 'https://via.placeholder.com/300x300?text=Coffee+Maker' },
    { id: 6, name: 'Yoga Mat', price: 39.99, category: 'sports', image: 'https://via.placeholder.com/300x300?text=Yoga+Mat' },
    { id: 7, name: 'Jeans', price: 49.99, category: 'clothing', image: 'https://via.placeholder.com/300x300?text=Jeans' },
    { id: 8, name: 'Desk Lamp', price: 34.99, category: 'home', image: 'https://via.placeholder.com/300x300?text=Lamp' },
    { id: 9, name: 'Bluetooth Speaker', price: 79.99, category: 'electronics', image: 'https://via.placeholder.com/300x300?text=Speaker' },
    { id: 10, name: 'Water Bottle', price: 19.99, category: 'sports', image: 'https://via.placeholder.com/300x300?text=Bottle' },
    { id: 11, name: 'Winter Jacket', price: 89.99, category: 'clothing', image: 'https://via.placeholder.com/300x300?text=Jacket' },
    { id: 12, name: 'Kitchen Blender', price: 49.99, category: 'home', image: 'https://via.placeholder.com/300x300?text=Blender' },
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'sports', name: 'Sports' },
    { id: 'home', name: 'Home' },
  ];

  // Filter products by category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Products to display
  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  // Load more products
  const loadMore = () => {
    setVisibleProducts(prev => prev + 4);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
        <p className="mt-4 text-lg text-gray-600">Discover our amazing collection of products</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setVisibleProducts(5);
            }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayedProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
                  <AddShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See More Button */}
      {visibleProducts < filteredProducts.length && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            See More Products
            <KeyboardArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      )}

      {/* No products message */}
      {displayedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Products;