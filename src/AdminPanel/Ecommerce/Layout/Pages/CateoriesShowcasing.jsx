import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../../../../axios/axios';
import { toast } from 'react-toastify';

const CategoriesShowcasing = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCategories = async () => {
    try {
      const response = await getData("categories", null, 'customer');
      if (response.status === 200) {
        setCategories(response.data.data);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = (categoryId, categoryName) => {
    // Navigate to products page with category filter
    navigate(`/products/category=${categoryId}`);
  };

  // Generate random background colors for categories
  const getCategoryColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
    ];
    return colors[index % colors.length];
  };

  // Generate random icons for categories
  const getCategoryIcon = (index) => {
    const icons = [
      '🛍️', '📱', '💻', '🎧', '👕', '👟', '📚', '🏠',
      '⚡', '🎮', '🌿', '🍳', '💎', '🎨', '⚽', '🎵'
    ];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Explore Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing products across various categories. Find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                {/* Category Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  {/* Category Image/Icon Section */}
                  <div className={`h-40 bg-gradient-to-br ${getCategoryColor(index)} flex items-center justify-center relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute ">
                     <img src={category.image_url} alt="" />
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description || 'Explore amazing products in this category'}
                    </p>

                    {/* Attributes */}
                    {category.attributes && category.attributes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2">KEY FEATURES:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.attributes.slice(0, 3).map((attribute) => (
                            <span
                              key={attribute.id}
                              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                            >
                              {attribute.name}
                            </span>
                          ))}
                          {category.attributes.length > 3 && (
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                              +{category.attributes.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Explore Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.attributes?.length || 0} features
                      </span>
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-2 transition-all duration-200">
                        Explore
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-500">There are no categories available at the moment.</p>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {categories.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Wide Variety of Products
              </h3>
              <p className="text-gray-600 mb-6">
                Browse through {categories.length} unique categories with specialized features and attributes.
              </p>
              <div className="flex justify-center gap-8 text-sm text-gray-500">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                  <div>Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {categories.reduce((total, cat) => total + (cat.attributes?.length || 0), 0)}
                  </div>
                  <div>Total Features</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add pattern grid styles */}
      <style jsx>{`
        .pattern-grid-lg {
          background-image: 
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(to right, currentColor 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default CategoriesShowcasing;