import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowBack,
  Inventory,
  MonetizationOn,
  CalendarToday,
  Category,
  BrandingWatermark,
  Description,
  Star,
  StarBorder,
  LocalOffer,
  QrCode,
  Share,
  Favorite,
  FavoriteBorder,
  AddShoppingCart,
  RateReview,
  Close,
  Send,
  StarHalf
} from '@mui/icons-material';
import { getData, postData } from '../../../../axios/axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductVariantDetail() {
  const { id } = useParams(); // variant id = 8
  const navigate = useNavigate();
  
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Rating modal states
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });

  // Fetch variant details
  useEffect(() => {
    const fetchVariant = async () => {
      try {
        setLoading(true);
        const response = await getData(`product_variants/${id}`, null, 'customer');
        
        if (response.status === 200) {
          // API returns array with one item
          const variantData = response.data[0] || response.data;
          setVariant(variantData);
          setSelectedImage(variantData?.product_images?.[0]?.image_url);
          console.log('Variant:', variantData);
        } else {
          toast.error('Failed to load product');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVariant();
    }
  }, [id]);

  // Format price
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Submit rating to API
  const submitRating = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const productId = variant?.product?.id;
      if (!productId) {
        toast.error('Product ID not found');
        return;
      }

      const response = await postData(
        `rating_product/${productId}`,
        {
          rating: rating,
          review: review
        },
        'customer'
      );

      if (response.status === 200) {
        toast.success('Thank you for your rating!');
        setShowRatingModal(false);
        setRating(0);
        setReview('');
      } else {
        toast.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle mouse move for star slider
  const handleStarMouseMove = (e, starElement) => {
    if (!starElement) return;
    
    const rect = starElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    // Calculate rating based on position (1-5)
    const starIndex = parseInt(starElement.dataset.star);
    const newRating = starIndex - 1 + percentage;
    setHoverRating(Math.min(5, Math.max(0, newRating)));
  };

  // Handle touch move for mobile
  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const starElement = elements.find(el => el.classList.contains('star-slider'));
    
    if (starElement) {
      const rect = starElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const starIndex = parseInt(starElement.dataset.star);
      const newRating = starIndex - 1 + percentage;
      setHoverRating(Math.min(5, Math.max(0, newRating)));
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (hoverRating > 0) {
      setRating(Math.round(hoverRating * 2) / 2); // Round to nearest 0.5
    }
    setTouchPosition({ x: 0, y: 0 });
  };

  // Render star with partial fill
  const renderStar = (index) => {
    const currentRating = hoverRating || rating;
    const starValue = index + 1;
    
    if (currentRating >= starValue) {
      return <Star className="w-8 h-8 text-yellow-400 fill-current" />;
    } else if (currentRating > index && currentRating < starValue) {
      // Partial star
      const percentage = (currentRating - index) * 100;
      return (
        <div className="relative">
          <StarBorder className="w-8 h-8 text-gray-400" />
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <Star className="w-8 h-8 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    } else {
      return <StarBorder className="w-8 h-8 text-gray-400" />;
    }
  };

  // Loading skeleton
  const VariantSkeleton = () => (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="h-96 bg-gray-200"></div>
        <div className="p-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VariantSkeleton />
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const product = variant.product;
  const images = variant.product_images || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowBack className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Product Details</h1>
          <div className="flex-1"></div>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isFavorite ? (
              <Favorite className="w-5 h-5 text-red-500" />
            ) : (
              <FavoriteBorder className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Main Image */}
            <div className="relative h-96 bg-gray-100">
              <img
                src={selectedImage || images[0]?.image_url}
                alt={variant.name}
                className="w-full h-full object-contain"
              />
              
              {/* Stock Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                variant.stock > 10 ? 'bg-green-100 text-green-700' :
                variant.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="p-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">More Images:</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.image_url)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === image.image_url
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={`${variant.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column - Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
          >
            {/* Product Name & Brand */}
            <div>
              <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                <BrandingWatermark className="w-4 h-4" />
                <span>{product?.brand_id ? `Brand ID: ${product.brand_id}` : 'No brand'}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{variant.name}</h1>
              <p className="text-gray-500">{product?.name}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-blue-600">
                {formatPrice(variant.price)}
              </span>
              {product?.price && parseFloat(product.price) > parseFloat(variant.price) && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <Inventory className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Stock</p>
                <p className="text-xl font-bold text-gray-800">{variant.stock} units</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <QrCode className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Variant ID</p>
                <p className="text-xl font-bold text-gray-800">#{variant.id}</p>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Description className="w-5 h-5" />
                Description
              </h3>
              <p className="text-gray-600">{variant.description || product?.description || 'No description available'}</p>
            </div>

            {/* Product Info */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Product Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Product ID</span>
                  <span className="text-gray-800 font-medium">{product?.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Category ID</span>
                  <span className="text-gray-800 font-medium">{product?.category_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-800 font-medium">{formatDate(variant.created_at)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-800 font-medium">{formatDate(variant.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowRatingModal(true)}
                disabled={variant.stock === 0}
                className="flex-1 bg-yellow-400 text-white py-3 rounded-xl font-medium hover:bg-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RateReview className="w-5 h-5" />
                Rate Product
              </button>
              <button
                onClick={() => navigate(`/products/${product?.id}`)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                View Main Product
              </button>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3"
          >
            <div className="p-3 bg-purple-100 rounded-lg">
              <LocalOffer className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Variant Name</p>
              <p className="font-medium text-gray-800">{variant.name}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3"
          >
            <div className="p-3 bg-orange-100 rounded-lg">
              <Category className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Main Product</p>
              <p className="font-medium text-gray-800">{product?.name}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3"
          >
            <div className="p-3 bg-pink-100 rounded-lg">
              <CalendarToday className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Added</p>
              <p className="font-medium text-gray-800">{formatDate(variant.created_at)}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRatingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Rate this Product</h2>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Close className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Product Preview */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                <img
                  src={selectedImage || images[0]?.image_url}
                  alt={variant.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{variant.name}</h3>
                  <p className="text-sm text-gray-500">Product ID: {product?.id}</p>
                </div>
              </div>

              {/* Interactive Star Slider */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  {hoverRating ? (
                    <span className="font-medium text-yellow-600">
                      {hoverRating.toFixed(1)} stars
                    </span>
                  ) : (
                    'Slide or tap to rate'
                  )}
                </p>
                
                {/* Star Slider Container */}
                <div 
                  className="flex justify-center gap-1 mb-4"
                  onMouseLeave={() => setHoverRating(0)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className="star-slider cursor-pointer relative"
                      data-star={index + 1}
                      onMouseMove={(e) => handleStarMouseMove(e, e.currentTarget)}
                      onClick={() => setRating(Math.round((hoverRating || rating) * 2) / 2)}
                    >
                      {renderStar(index)}
                    </div>
                  ))}
                </div>

                {/* Rating Labels */}
                <div className="flex justify-between text-xs text-gray-500 px-2">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Very Good</span>
                  <span>Excellent</span>
                </div>

                {/* Quick Rating Buttons */}
                <div className="flex justify-center gap-2 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        rating === star
                          ? 'bg-yellow-400 text-white scale-110'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write your review (optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  rows="4"
                />
              </div>

              {/* Rating Stats Preview */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Summary</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-8">{star} star</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${star * 20}%` }}
                          className="h-full bg-yellow-400"
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-12">{star * 20}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  disabled={submitting || rating === 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-colors disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Rating</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}