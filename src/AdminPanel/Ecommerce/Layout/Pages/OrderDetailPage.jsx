import React, { useState } from 'react';
import {
  ArrowBack,
  ShoppingBag,
  CalendarToday,
  Payment,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  Assignment,
  Star,
  StarBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    id: 'ORD-12345',
    date: '2023-10-15',
    status: 'delivered',
    items: 3,
    total: 149.97,
    subtotal: 149.97,
    shipping: 0,
    tax: 12.50,
    itemsDetail: [
      { 
        id: 1, 
        name: 'Wireless Headphones', 
        price: 89.99, 
        image: 'https://via.placeholder.com/80x80?text=Headphones',
        quantity: 1,
        description: 'Noise cancelling wireless headphones with 30h battery life'
      },
      { 
        id: 2, 
        name: 'Phone Case', 
        price: 24.99, 
        image: 'https://via.placeholder.com/80x80?text=Case',
        quantity: 1,
        description: 'Premium protective case for smartphones'
      },
      { 
        id: 3, 
        name: 'USB-C Cable', 
        price: 34.99, 
        image: 'https://via.placeholder.com/80x80?text=Cable',
        quantity: 1,
        description: 'Fast charging USB-C to USB-C cable, 6ft'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94111',
      country: 'United States'
    },
    paymentMethod: {
      type: 'Credit Card',
      last4: '1234',
      expDate: '12/25'
    },
    trackingNumber: 'TRK-9876543210',
    estimatedDelivery: '2023-10-18'
  });

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="text-green-500" />;
      case 'shipped':
        return <LocalShipping className="text-blue-500" />;
      case 'processing':
        return <Pending className="text-yellow-500" />;
      case 'cancelled':
        return <Cancel className="text-red-500" />;
      default:
        return <Pending className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const handleRateProduct = (productId, stars) => {
    setRating(stars);
    // In a real app, you would save this rating to your backend
  };

  const handleSubmitReview = (productId) => {
    // In a real app, you would submit the review to your backend
    alert(`Review submitted for product ${productId} with rating ${rating} and review: ${review}`);
    setRating(0);
    setReview('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
      >
        <ArrowBack className="mr-2" />
        Back to Orders
      </button>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-gray-600 mt-1">Placed on {order.date}</p>
          </div>
          <div className="flex items-center">
            {getStatusIcon(order.status)}
            <span className="ml-2 font-medium">{getStatusText(order.status)}</span>
          </div>
        </div>

        {order.status === 'shipped' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <LocalShipping className="text-blue-500 mr-2" />
              <span className="font-medium">Shipped</span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Estimated delivery: {order.estimatedDelivery}
            </p>
            <p className="text-sm text-gray-600">
              Tracking number: {order.trackingNumber}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-6">
              {order.itemsDetail.map(item => (
                <div key={item.id} className="flex border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-md font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-gray-600">Qty: {item.quantity}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    
                    {/* Rating Section */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900">Rate this product:</p>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => handleRateProduct(item.id, star)}
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            {star <= rating ? <Star /> : <StarBorder />}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write a review (optional)"
                        className="mt-2 w-full p-2 border border-gray-300 rounded-md text-sm"
                        rows="2"
                      />
                      <button
                        onClick={() => handleSubmitReview(item.id)}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <LocalShipping className="mr-2" />
              Shipping Address
            </h2>
            <div className="text-sm text-gray-600">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Payment className="mr-2" />
              Payment Method
            </h2>
            <div className="text-sm text-gray-600">
              <p>{order.paymentMethod.type} ending in {order.paymentMethod.last4}</p>
              <p>Expires {order.paymentMethod.expDate}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Assignment className="mr-2" />
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;