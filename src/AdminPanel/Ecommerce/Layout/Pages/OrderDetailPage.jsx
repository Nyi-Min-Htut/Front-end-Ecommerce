import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getData, postData } from '../../../../axios/axios';
import { toast } from 'react-toastify';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Simple fetch
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await getData(`order_item_details/${id}`, null, 'customer');
        
        if (response.status === 200) {
          setItem(response.data);
          console.log('Item:', response.data);
        } else {
          toast.error('Failed to load');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  // Submit rating
  const submitRating = async () => {
    if (rating === 0) {
      toast.error('Please select rating');
      return;
    }

    setSubmitting(true);
    try {
      const productId = item?.product_variant?.product_id;
      await postData(`rating_product/${productId}`, { rating, review }, 'customer');
      toast.success('Rating submitted!');
      setShowRating(false);
      setRating(0);
      setReview('');
    } catch (error) {
      toast.error('Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  // Get first image
  const getMainImage = () => {
    return item?.product_variant?.product_images?.[0]?.image_url || '';
  };

  // Loading
  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Not found
  if (!item) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Item not found</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const product = item.product_variant;
  const mainImage = getMainImage();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Image */}
          <div className="w-full h-64 bg-gray-200">
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={product?.name || 'Product'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            
            {/* Status Badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
              item.status === 'delivered' ? 'bg-green-100 text-green-700' :
              item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {item.status}
            </span>

            {/* Product Name */}
            <h1 className="text-2xl font-bold mb-2">{product?.name || 'Product Name'}</h1>
            
            {/* Description */}
            <p className="text-gray-600 mb-4">{product?.description || 'No description'}</p>

            {/* Price Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span>Price per item:</span>
                <span className="font-bold">${parseFloat(item.price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Quantity:</span>
                <span className="font-bold">{item.quantity}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-600 border-t pt-2">
                <span>Total:</span>
                <span>${parseFloat(item.total_amount).toFixed(2)}</span>
              </div>
            </div>

            {/* Order Info */}
            <div className="text-sm text-gray-500 mb-4">
              <div>Order ID: #{item.order_id}</div>
              <div>Ordered: {new Date(item.created_at).toLocaleDateString()}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {item.status === 'delivered' && (
                <button
                  onClick={() => setShowRating(true)}
                  className="flex-1 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600"
                >
                  Rate Product
                </button>
              )}
              <button
                onClick={() => navigate(`/products/${product?.product_id}`)}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
              >
                View Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Rate Product</h2>
            
            {/* Simple Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Review */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review (optional)"
              className="w-full p-3 border rounded-lg mb-4"
              rows="3"
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRating(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={submitting || rating === 0}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}