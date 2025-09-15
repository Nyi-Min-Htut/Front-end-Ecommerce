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

const OrderListPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample order data
  const orders = [
    {
      id: 'ORD-12345',
      date: '2023-10-15',
      status: 'delivered',
      items: 3,
      total: 149.97,
      itemsDetail: [
        { name: 'Wireless Headphones', price: 89.99, image: 'https://via.placeholder.com/80x80?text=Headphones' },
        { name: 'Phone Case', price: 24.99, image: 'https://via.placeholder.com/80x80?text=Case' },
        { name: 'USB-C Cable', price: 34.99, image: 'https://via.placeholder.com/80x80?text=Cable' }
      ]
    },
    {
      id: 'ORD-12346',
      date: '2023-10-10',
      status: 'shipped',
      items: 2,
      total: 84.98,
      itemsDetail: [
        { name: 'Running Shoes', price: 59.99, image: 'https://via.placeholder.com/80x80?text=Shoes' },
        { name: 'Sports Socks', price: 24.99, image: 'https://via.placeholder.com/80x80?text=Socks' }
      ]
    },
    {
      id: 'ORD-12347',
      date: '2023-10-05',
      status: 'processing',
      items: 1,
      total: 199.99,
      itemsDetail: [
        { name: 'Smart Watch', price: 199.99, image: 'https://via.placeholder.com/80x80?text=Watch' }
      ]
    },
    {
      id: 'ORD-12348',
      date: '2023-09-28',
      status: 'cancelled',
      items: 4,
      total: 112.96,
      itemsDetail: [
        { name: 'Water Bottle', price: 19.99, image: 'https://via.placeholder.com/80x80?text=Bottle' },
        { name: 'Yoga Mat', price: 39.99, image: 'https://via.placeholder.com/80x80?text=Mat' },
        { name: 'Resistance Bands', price: 24.99, image: 'https://via.placeholder.com/80x80?text=Bands' },
        { name: 'Gym Gloves', price: 27.99, image: 'https://via.placeholder.com/80x80?text=Gloves' }
      ]
    }
  ];

  const statusFilters = [
    { id: 'all', label: 'All Orders' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'processing', label: 'Processing' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

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

  const viewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="mt-2 text-gray-600">View your past orders and their status</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Order Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <ShoppingBag className="text-gray-500 mr-2" />
                  <span className="font-medium">Order #{order.id}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <CalendarToday className="text-gray-400 mr-1" style={{ fontSize: '1rem' }} />
                  <span>Placed on {order.date}</span>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(order.status)}
                <span className="ml-2 font-medium">{getStatusText(order.status)}</span>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex -space-x-4">
                {order.itemsDetail.slice(0, 4).map((item, index) => (
                  <img
                    key={index}
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg border-2 border-white object-cover"
                  />
                ))}
                {order.items > 4 && (
                  <div className="w-16 h-16 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-sm font-medium">
                    +{order.items - 4}
                  </div>
                )}
              </div>
            </div>

            {/* Order Footer */}
            <div className="p-4 flex justify-between items-center">
              <div>
                <span className="text-gray-600">{order.items} item{order.items !== 1 ? 's' : ''}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => viewOrderDetails(order.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">You don't have any orders with this status yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage ;