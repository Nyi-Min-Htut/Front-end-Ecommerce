import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  LocalShipping,
  ArrowBack,
  ArrowForward,
  Discount,
  Security,
  ClearAll,
  CreditCard,
  AccountBalance
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { postData } from '../../../../axios/axios';

const CartShopping = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        // Select all items by default
        setSelectedItems(items.map(item => item.variant_id || item.product_id));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => {
      if ((item.variant_id || item.product_id) === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => 
      (item.variant_id || item.product_id) !== itemId
    );
    
    setCartItems(updatedCart);
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const removeSelected = () => {
    const updatedCart = cartItems.filter(item => 
      !selectedItems.includes(item.variant_id || item.product_id)
    );
    
    setCartItems(updatedCart);
    setSelectedItems([]);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Selected items removed');
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      setSelectedItems([]);
      localStorage.removeItem('cart');
      toast.success('Cart cleared');
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.variant_id || item.product_id));
    }
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.1);
      toast.success('Promo code applied! 10% discount');
    } else {
      toast.error('Invalid promo code');
    }
  };

  // Calculate totals
  const selectedCartItems = cartItems.filter(item => 
    selectedItems.includes(item.variant_id || item.product_id)
  );

  const subtotal = selectedCartItems.reduce(
    (total, item) => total + (parseFloat(item.price) * item.quantity),
    0
  );

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping + tax - discountAmount;

  // Generate unique order code
  const generateOrderCode = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  // Handle checkout directly
  const handleCheckout = async () => {
    if (selectedCartItems.length === 0) {
      toast.error('Please select items to checkout');
      return;
    }

    // Show checkout modal
    setShowCheckoutModal(true);
  };

  // Submit order to backend
 const submitOrder = async () => {
  // Validate customer info
  if (
    !customerInfo.name.trim() ||
    !customerInfo.phone.trim() ||
    !customerInfo.email.trim() ||
    !customerInfo.address.trim()
  ) {
    toast.error('Please fill all customer information');
    return;
  }

  setLoading(true);

  try {
    const orderData = {
      order_code: generateOrderCode(),
      total_amount: total,
      tax,
      payment_type: paymentMethod,
      status: 'pending',
      invoice_date: new Date().toISOString().split('T')[0],

      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      shipping_address: customerInfo.address,

      items: selectedCartItems.map(item => ({
        product_variant_id: item.variant_id || item.product_id,
        product_id: item.product_id,
        name: item.name,
        variant_name: item.variant_name,
        quantity: item.quantity,
        price: item.price,
        total_amount: parseFloat(item.price) * item.quantity,
        attributes: item.attributes || {},
      })),
    };

    // ✅ USE postData here
    const response = await postData('orders', orderData, 'customer');

    if (response.data?.success) {
      const updatedCart = cartItems.filter(item =>
        !selectedItems.includes(item.variant_id || item.product_id)
      );

      setCartItems(updatedCart);
      setSelectedItems([]);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      setShowCheckoutModal(false);
      setCustomerInfo({ name: '', phone: '', email: '', address: '' });

      toast.success('✅ Order placed successfully!');
    } else {
      throw new Error(response.data?.message || 'Order failed');
    }
  } catch (error) {
    console.error('Order error:', error);
    toast.error(error.message || 'Failed to place order');
  } finally {
    setLoading(false);
  }
};

  // Auto-fill customer info if logged in
  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('customer_auth_user'));
    if (authUser) {
      setCustomerInfo({
        name: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phone_number || '',
        address: authUser.address || ''
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4"
          >
            <ArrowBack className="mr-2" />
            Continue Shopping
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="text-blue-600 text-4xl mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <ClearAll className="mr-2" />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingCart className="text-gray-300 text-6xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              {/* Cart Header */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="ml-3 font-medium">Select All ({cartItems.length} items)</span>
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <button
                      onClick={removeSelected}
                      className="text-red-600 hover:text-red-700 flex items-center"
                    >
                      <Delete className="mr-2" />
                      Remove Selected
                    </button>
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const itemId = item.variant_id || item.product_id;
                  const isSelected = selectedItems.includes(itemId);
                  
                  return (
                    <div
                      key={`${itemId}-${JSON.stringify(item.attributes)}`}
                      className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all ${
                        isSelected ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Checkbox & Image */}
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(itemId)}
                            className="w-5 h-5 text-blue-600 rounded mt-4"
                          />
                          <img
                            src={item.main_image || 'https://via.placeholder.com/150'}
                            alt={item.name}
                            className="w-32 h-32 object-cover rounded-lg ml-4"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              {item.variant_name && (
                                <p className="text-gray-600 text-sm">
                                  Variant: {item.variant_name}
                                </p>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <p className="text-xl font-bold text-blue-600">
                                ${parseFloat(item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                              >
                                <Remove fontSize="small" />
                              </button>
                              <span className="px-4 py-2 border-x font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                              >
                                <Add fontSize="small" />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <p className="text-lg font-bold text-gray-900">
                                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </p>
                              <button
                                onClick={() => removeItem(itemId)}
                                className="text-red-500 hover:text-red-700 p-2"
                              >
                                <Delete />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Order Summary & Checkout */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Trust Badges */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-6">
                    <div className="text-center">
                      <LocalShipping className="text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <Security className="text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Secure Checkout</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({selectedCartItems.length} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount * 100}%)</span>
                      <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {shipping === 0 ? 'FREE' : `$${shipping}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={selectedCartItems.length === 0}
                  className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center ${
                    selectedCartItems.length > 0
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Proceed to Checkout
                  <ArrowForward className="ml-2" />
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Checkout</h2>
                
                {/* Customer Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="09XXXXXXXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Address *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({...prev, address: e.target.value}))}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your shipping address"
                    />
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    {['credit_card', 'paypal', 'cash_on_delivery'].map((method) => (
                      <div key={method} className="flex items-center">
                        <input
                          type="radio"
                          id={method}
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor={method} className="ml-3 capitalize">
                          {method.replace('_', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Order Total: ${total.toFixed(2)}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCartItems.length} items • Free Shipping
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitOrder}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartShopping;