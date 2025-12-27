import React, { useState } from "react";
import { postData } from "../../../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import bgimg from "../../../../assets/img/ahmet-yuksek-mybaeBtxOj8-unsplash.jpg";

import {
  Person,
  Email,
  Phone,
  Fingerprint,
  Cake,
  Home,
  Notes,
  CameraAlt,
  Lock,
  Visibility,
  VisibilityOff,
  Male,
  Female
} from "@mui/icons-material";

const CustomerRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nrc: "",
    phone_number: "",
    date_of_birth: "",
    password: "",
    address: "",
    remark: "",
    gender: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.phone_number.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!formData.date_of_birth) {
      toast.error("Date of birth is required");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!formData.gender) {
      toast.error("Please select gender");
      return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setLoading(true);
  
  try {
    const formDataToSend = new FormData();
    
    // Required fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('date_of_birth', formData.date_of_birth);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('gender', formData.gender);
    
    // Optional fields
    if (formData.email) formDataToSend.append('email', formData.email);
    if (formData.nrc) formDataToSend.append('nrc', formData.nrc);
    if (formData.remark) formDataToSend.append('remark', formData.remark);
    if (imageFile) formDataToSend.append('image', imageFile);
    
    // Default values
    formDataToSend.append('is_verified', false);
    formDataToSend.append('is_ban', false);
    
    // FIX: Check your postData function
    const response = await postData("customers", formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // FIX: Check response structure
    if (response.data?.success || response.status === 200) {
      toast.success("Registration successful!");
      navigate("/login");
    } else {
      toast.error(response.data?.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    // FIX: Proper error handling
    toast.error(
      error.response?.data?.message || 
      error.message || 
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgimg})` }}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Form */}
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-600 mt-2">Join our community today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Image */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <CameraAlt className="text-gray-400 text-3xl" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                    <CameraAlt fontSize="small" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Profile Picture</p>
                  <p className="text-sm text-gray-500">Click the camera to upload</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="relative">
                  <Person className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Full Name *"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Email className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Email (Optional)"
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Phone Number *"
                    required
                  />
                </div>

                {/* NRC */}
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="nrc"
                    value={formData.nrc}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="NRC (Optional)"
                  />
                </div>

                {/* Date of Birth */}
                <div className="relative">
                  <Cake className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="relative">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'gender', value: 'male' } })}
                      className={`flex-1 flex items-center justify-center py-3 rounded-lg border ${
                        formData.gender === 'male'
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300'
                      } transition`}
                    >
                      <Male className="mr-2" />
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'gender', value: 'female' } })}
                      className={`flex-1 flex items-center justify-center py-3 rounded-lg border ${
                        formData.gender === 'female'
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-gray-200 hover:border-gray-300'
                      } transition`}
                    >
                      <Female className="mr-2" />
                      Female
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Password *"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              {/* Address */}
              <div className="relative">
                <Home className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Address *"
                  required
                />
              </div>

              {/* Remark */}
              <div className="relative">
                <Notes className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  rows="2"
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Additional Information (Optional)"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-gray-600 text-sm pt-4">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                  Sign in
                </a>
              </p>
            </form>
          </div>

          {/* Right Side - Decorative */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 p-8 flex flex-col justify-center">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
              <p className="text-blue-100 mb-6">
                Create your account to access exclusive features and services.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-blue-100">Secure & Private</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-blue-100">Easy to Use</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-blue-100">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;