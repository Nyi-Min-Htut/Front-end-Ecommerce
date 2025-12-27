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
import loginBg from "../../../../assets/img/william-pickard-UJz_2r73aAk-unsplash.jpg";

const CustomerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
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
    const { name, email, phone_number, password, confirmPassword } = formData;
   
    if (!phone_number) {
      toast.warning("Phone is required");
      return false;
    }
    if (!password) {
      toast.warning("Password is required");
      return false;
    }
 
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      let response = await postData("customers/login", formData);

      if (response.status==200) {
        const token = response.data.token;
        const user = response.data.customer;

        localStorage.setItem('customer_token',token);
        localStorage.setItem('customer_auth_user',JSON.stringify(user));
        toast.success("Login successfully");
        navigate('/');
      } else {
        toast.error("Somethings went wrong");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }} // <-- correct
    >
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Login Account
        </h1>
        <p className="text-center text-gray-500 mb-6">Join us today!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4 text-sm">
          If you don't have account, please
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            {" "}
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
