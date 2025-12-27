import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CalendarToday,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  Refresh,
  FilterList,
  Search,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getData } from '../../../../axios/axios';

const OrderListPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Status configuration with colors and icons
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: <Pending className="text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800',
      borderColor: 'border-yellow-300'
    },
    processing: {
      label: 'Processing',
      icon: <Refresh className="text-blue-500" />,
      color: 'bg-blue-100 text-blue-800',
      borderColor: 'border-blue-300'
    },
    shipped: {
      label: 'Shipped',
      icon: <LocalShipping className="text-purple-500" />,
      color: 'bg-purple-100 text-purple-800',
      borderColor: 'border-purple-300'
    },
    delivered: {
      label: 'Delivered',
      icon: <CheckCircle className="text-green-500" />,
      color: 'bg-green-100 text-green-800',
      borderColor: 'border-green-300'
    },
    cancelled: {
      label: 'Cancelled',
      icon: <Cancel className="text-red-500" />,
      color: 'bg-red-100 text-red-800',
      borderColor: 'border-red-300'
    }
  };

  const statusFilters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getData('orders/customer',null,'customer');

      if (response.status==200) {
        setOrders(response.data.data);
      }
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate order date from order code (if no date in API)
  const getOrderDate = (orderCode) => {
    // Extract timestamp from order code (ORD-1765386403836-781)
    const timestamp = orderCode.split('-')[1];
    if (timestamp) {
      return formatDate(new Date(parseInt(timestamp)));
    }
    return 'Date not available';
  };

  // Filter orders based on active filter and search term
  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           item.product_variant_name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesFilter && matchesSearch;
  });

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // View order details
  const viewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Loading Orders</h3>
          <p className="mt-1 text-gray-500">Please wait while we fetch your orders...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Something went wrong</h3>
          <p className="mt-1 text-gray-500">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">Track and manage all your orders in one place</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders or items..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button (Mobile) */}
          <div className="md:hidden">
            <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FilterList className="h-5 w-5 mr-2 text-gray-500" />
              Filter
            </button>
          </div>

          {/* Order Count */}
          <div className="text-sm text-gray-600">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Status Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {statusFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const status = statusConfig[order.status] || statusConfig.pending;
          
          return (
            <div 
              key={order.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Order Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleOrderExpansion(order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">{order.order_code}</h3>
                        <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.borderColor} border`}>
                          {status.icon}
                          <span className="ml-1">{status.label}</span>
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <CalendarToday className="h-4 w-4 mr-1" />
                        <span>{getOrderDate(order.order_code)}</span>
                        <span className="mx-2">•</span>
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end mt-3 sm:mt-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">Total amount</div>
                    </div>
                    <div className="ml-4">
                      {expandedOrder === order.id ? (
                        <ExpandLess className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ExpandMore className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  {/* Items List */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={item.id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex-shrink-0">
                            <img
                              src={item.product_image}
                              alt={item.product_variant_name}
                              className="h-16 w-16 object-cover rounded-md"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/80x80?text=Product+${index + 1}`;
                              }}
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h5 className="font-medium text-gray-900">{item.product_variant_name}</h5>
                            <p className="text-sm text-gray-500">Variant ID: {item.product_variant_id}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">Item #{index + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => viewOrderDetails(order.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      View Full Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                        Leave Review
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium">
                        Cancel Order
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                      Track Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? `No orders matching "${searchTerm}"`
                : `You don't have any ${activeFilter !== 'all' ? statusConfig[activeFilter]?.label.toLowerCase() : ''} orders yet.`
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Help Text */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Need help with an order?</strong> Contact our support team or visit our help center for assistance with returns, exchanges, or any other inquiries.
        </p>
      </div>
    </div>
  );
};

export default OrderListPage;