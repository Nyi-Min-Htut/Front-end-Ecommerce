import React, { useState, useEffect } from 'react';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Close
} from '@mui/icons-material';
import { getData, postData } from '../../../../axios/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function ProductListByCustomer() {
  const [activeTab, setActiveTab] = useState('fav'); // 'fav' or 'save'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null); // Track which product is being removed
  
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const url = activeTab === 'fav' 
        ? 'customer/fav-products' 
        : 'customer/save-products';
      
      const response = await getData(url, null, 'customer');

      if (response.status === 200) {
        setProducts(response.data || []);
      } else {
        toast.error('Something went wrong');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  // Toggle remove from favorites/saved
  const handleRemove = async (productId, e) => {
    e.stopPropagation(); // Prevent navigation to product detail
    
    try {
      setRemovingId(productId);
      
      const url = activeTab === 'fav' 
        ? `customer/fav-products/${productId}` 
        : `customer/save-products/${productId}`;
      
      const response = await postData(url, {}, 'customer');

      if (response.status === 200) {
        // Remove product from list
        setProducts(products.filter(p => p.id !== productId));
        toast.success(`Removed from ${activeTab === 'fav' ? 'favorites' : 'saved'}`);
      } else {
        toast.error('Failed to remove');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong');
    } finally {
      setRemovingId(null);
    }
  };

  // Navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Safe function to get product image
  const getProductImage = (product) => {
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images[0].image_url;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  // Safe function to get formatted date
  const getFormattedDate = (dateString) => {
    if (!dateString) return 'Recently added';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently added';
    }
  };

  // Loading Skeleton
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Collection</h1>
          <p className="text-sm text-gray-500">
            {activeTab === 'fav' ? 'Your favorite products' : 'Products you saved for later'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('fav')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'fav' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-red-50'
            }`}
          >
            {activeTab === 'fav' ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            <span className="text-sm font-medium">Favorites</span>
            {!loading && activeTab === 'fav' && products.length > 0 && (
              <span className="bg-white text-red-500 px-1.5 py-0.5 rounded-full text-xs font-bold">
                {products.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('save')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'save' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            {activeTab === 'save' ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
            <span className="text-sm font-medium">Saved</span>
            {!loading && activeTab === 'save' && products.length > 0 && (
              <span className="bg-white text-blue-500 px-1.5 py-0.5 rounded-full text-xs font-bold">
                {products.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          // Products grid
          <div>
            {products.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 max-w-sm mx-auto shadow-sm">
                  {activeTab === 'fav' ? (
                    <>
                      <FavoriteBorder className="text-red-300 text-5xl mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No favorite products yet</p>
                      <p className="text-gray-400 text-xs mt-1">Click the heart icon on products to add them here</p>
                    </>
                  ) : (
                    <>
                      <BookmarkBorder className="text-blue-300 text-5xl mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No saved products yet</p>
                      <p className="text-gray-400 text-xs mt-1">Click the bookmark icon to save products for later</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Show products
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 cursor-pointer hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <div className="relative h-40 bg-gray-100">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      {/* Price tag */}
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        ${parseFloat(product.price).toFixed(2)}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {product.description || 'No description available'}
                      </p>

                      {/* Footer with date and remove button */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          {getFormattedDate(product.pivot?.created_at)}
                        </span>
                        
                        <button
                          onClick={(e) => handleRemove(product.id, e)}
                          disabled={removingId === product.id}
                          className={`
                            transition-colors
                            ${removingId === product.id 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-400 hover:text-red-500'
                            }
                          `}
                          title={`Remove from ${activeTab === 'fav' ? 'favorites' : 'saved'}`}
                        >
                          {removingId === product.id ? (
                            <span className="block w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></span>
                          ) : (
                            <Close fontSize="small" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}