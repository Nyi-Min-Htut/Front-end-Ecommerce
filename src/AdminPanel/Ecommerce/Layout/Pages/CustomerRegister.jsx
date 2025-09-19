import React, { useState } from "react";
import {
  Email,
  Lock,
  Person,
  Phone,
  Cake,
  Home,
  Notes,
  CameraAlt,
  ArrowForward,
  Male,
  Female,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { postData } from "../../../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import bgimg from "../../../../assets/img/ahmet-yuksek-mybaeBtxOj8-unsplash.jpg";

const CustomerRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = formData;
    if (!name) {
      toast.warning("Name is required");
      return false;
    }
    if (!email) {
      toast.warning("Email is required");
      return false;
    }

    if (!phone) {
      toast.warning("Phone is required");
      return false;
    }
    if (!password) {
      toast.warning("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      let response = await postData("customers", formData);
      console.log(response);
      console.log(response.status);
      if (response.status) {
        toast.success("Register successfully");
        navigate("/login");
      } else {
        toast.error("Somethings went wrong");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimg})` }} // <-- correct
    >
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-6">Join us today!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <Person className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="pl-10 w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              placeholder="Email"
              className="pl-10 w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="pl-10 w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="pl-10 pr-10 w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-400"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="pl-10 w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
