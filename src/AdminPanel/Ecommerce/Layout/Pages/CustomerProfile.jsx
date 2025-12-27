import React, { useState, useEffect } from 'react';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Cake,
  Edit,
  Save,
  Cancel,
  VerifiedUser,
  Block,
  Male,
  Female,
  Security,
  ShoppingBag,
  History,
  CameraAlt,
  Logout,
  Lock,
  CheckCircle,
  Error,
  Image as ImageIcon,
  CalendarToday,
  Info,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from '../../../../axios/axios';
import { toast } from 'react-toastify';
import Snowfall from 'react-snowfall';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  // Status badges configuration
  const statusBadges = {
    is_verified: {
      true: {
        text: 'Verified',
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'bg-emerald-100 text-emerald-800',
        border: 'border-emerald-200'
      },
      false: {
        text: 'Not Verified',
        icon: <Error className="h-4 w-4" />,
        color: 'bg-amber-100 text-amber-800',
        border: 'border-amber-200'
      }
    },
    is_ban: {
      true: {
        text: 'Banned',
        icon: <Block className="h-4 w-4" />,
        color: 'bg-rose-100 text-rose-800',
        border: 'border-rose-200'
      },
      false: {
        text: 'Active',
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'bg-emerald-100 text-emerald-800',
        border: 'border-emerald-200'
      }
    }
  };

  // Gender configuration
  const genderConfig = {
    male: { icon: <Male className="h-5 w-5 text-blue-500" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    female: { icon: <Female className="h-5 w-5 text-pink-500" />, color: 'text-pink-600', bg: 'bg-pink-50' },
    other: { icon: <Person className="h-5 w-5 text-purple-500" />, color: 'text-purple-600', bg: 'bg-purple-50' }
  };

  // Fetch customer profile
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch orders when tab changes
  useEffect(() => {
      fetchOrders();
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getData('customer/profile', null, 'customer');
      console.log(response.data);
      if (response.status == 200) {
        const profileData = response.data;
        setProfile(profileData);
        setEditedProfile(profileData);
        setImagePreview(profileData.image_url);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await getData('orders/customer', null, 'customer');
      console.log(response);
      console.log(response.data);
      
      if (response.status == 200) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setEditedProfile(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setEditedProfile(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? e.target.checked : value 
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      
      // Add changed fields
      Object.keys(editedProfile).forEach(key => {
        if (editedProfile[key] !== profile[key] && editedProfile[key] !== undefined) {
          if (key === 'image') {
            formData.append('image', editedProfile.image);
          } else if (key === 'password' && editedProfile.password) {
            formData.append('password', editedProfile.password);
          } else if (key !== 'image_url' && key !== 'image_path') {
            formData.append(key, editedProfile[key]);
          }
        }
      });

      const response = await postData('customer/profile', formData, 'customer', {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.status === 200 && response.data.success) {
        setProfile(response.data.data);
        setIsEditing(false);
        setSaving(false);
        // Show success notification
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      setSaving(false);
      alert('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setImagePreview(profile?.image_url);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        const response = await postData('customer/logout', {}, 'customer');
        
        if (response.status === 200 && response.data.success) {
          // Clear any stored tokens
          localStorage.removeItem('customer_token');
          sessionStorage.removeItem('customer_token');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error logging out:', err);
        // Force logout anyway
        localStorage.removeItem('customer_token');
        navigate('/login');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getGenderDisplay = (gender) => {
    if (!gender) return 'Not specified';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <Snowfall color='#82C3D9'/>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your account and view order history</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Logout className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full border-4 border-white shadow-2xl overflow-hidden">
                      <img
                        src={imagePreview || `https://ui-avatars.com/api/?name=${profile.name}&background=random&color=fff&bold=true&size=256`}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                        <CameraAlt className="h-5 w-5" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleInputChange}
                          name="image"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-20 pb-6 px-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Email className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex justify-center gap-3 mb-6">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusBadges.is_verified[profile.is_verified ? 'true' : 'false'].color} ${statusBadges.is_verified[profile.is_verified ? 'true' : 'false'].border}`}>
                      {statusBadges.is_verified[profile.is_verified ? 'true' : 'false'].icon}
                      <span className="ml-1.5">{statusBadges.is_verified[profile.is_verified ? 'true' : 'false'].text}</span>
                    </span>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusBadges.is_ban[profile.is_ban ? 'true' : 'false'].color} ${statusBadges.is_ban[profile.is_ban ? 'true' : 'false'].border}`}>
                      {statusBadges.is_ban[profile.is_ban ? 'true' : 'false'].icon}
                      <span className="ml-1.5">{statusBadges.is_ban[profile.is_ban ? 'true' : 'false'].text}</span>
                    </span>
                  </div>

                  {/* Gender Badge */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg ${genderConfig[profile.gender]?.bg || 'bg-gray-100'}`}>
                    {genderConfig[profile.gender]?.icon || <Person className="h-5 w-5 text-gray-500" />}
                    <span className={`ml-2 font-medium ${genderConfig[profile.gender]?.color || 'text-gray-700'}`}>
                      {getGenderDisplay(profile.gender)}
                    </span>
                  </div>
                </div>

                {/* Member Since */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <CalendarToday className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Member since</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(profile.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                      >
                        <Cancel className="h-5 w-5 mr-2" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Person className="h-5 w-5 inline mr-2" />
                  Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5 inline mr-2" />
                  Recent Orders
                </button>
              </div>
            </div>

            {/* Profile Details Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Person className="h-4 w-4 inline mr-2 text-gray-400" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editedProfile.name || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-gray-900 font-medium">{profile.name}</p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Email className="h-4 w-4 inline mr-2 text-gray-400" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedProfile.email || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-gray-900 font-medium">{profile.email}</p>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-2 text-gray-400" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone_number"
                          value={editedProfile.phone_number || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-gray-900 font-medium">{profile.phone_number || 'Not set'}</p>
                        </div>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Cake className="h-4 w-4 inline mr-2 text-gray-400" />
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="date_of_birth"
                          value={editedProfile.date_of_birth || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-gray-900 font-medium">
                            {formatDate(profile.date_of_birth)}
                            {profile.date_of_birth && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({calculateAge(profile.date_of_birth)} years old)
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* NRC Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Security className="h-4 w-4 inline mr-2 text-gray-400" />
                        NRC Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="nrc"
                          value={editedProfile.nrc || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-gray-900 font-medium">{profile.nrc || 'Not set'}</p>
                        </div>
                      )}
                    </div>

                    {/* Password Change (only in edit mode) */}
                    {isEditing && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Lock className="h-4 w-4 inline mr-2 text-gray-400" />
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={editedProfile.password || ''}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Address (full width) */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <LocationOn className="h-4 w-4 inline mr-2 text-gray-400" />
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={editedProfile.address || ''}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-900">{profile.address || 'Not set'}</p>
                      </div>
                    )}
                  </div>

                  {/* Remark (full width) */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Info className="h-4 w-4 inline mr-2 text-gray-400" />
                      Remark
                    </label>
                    {isEditing ? (
                      <textarea
                        name="remark"
                        value={editedProfile.remark || ''}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-900">{profile.remark || 'No remarks'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Recent Orders</h3>
                  
                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div
                          key={order.id}
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-gray-900">{order.order_code}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                  order.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                  order.status === 'cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                  'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {order.items?.length || 0} items • ${parseFloat(order.total_amount).toFixed(2)}
                              </p>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => navigate('/orders')}
                          className="w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-medium"
                        >
                          View All Orders
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <ShoppingBag className="h-10 w-10 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h4>
                      <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-xl mr-4">
                <AccountCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Account Status</p>
                <p className="text-xl font-bold text-blue-900">
                  {profile.is_ban ? 'Banned' : 'Active'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-500 rounded-xl mr-4">
                <VerifiedUser className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-700">Verification</p>
                <p className="text-xl font-bold text-emerald-900">
                  {profile.is_verified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-xl mr-4">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Total Orders</p>
                <p className="text-xl font-bold text-purple-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-center">
              <div className="p-3 bg-amber-500 rounded-xl mr-4">
                <CalendarToday className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Member Since</p>
                <p className="text-xl font-bold text-amber-900">
                  {new Date(profile.created_at).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;