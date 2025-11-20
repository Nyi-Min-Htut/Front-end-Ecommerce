import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import { getData, postData } from "../../axios/axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [role_id, setRoleId] = useState("");
  const [remark, setRemark] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setImage(null);
    setPreview(null);
  };

  const getRoles = async () => {
    let response = await getData("roles");
    if (response.status === 200) {
      setRoles(response.data.data);
    }
  };

  const getEmployee = async () => {
    try {
      setLoading(true);
      let response = await getData(`employees/${id}`);
      if (response.status === 200) {
        const employee = response.data;
        setName(employee.name || "");
        setEmail(employee.email || "");
        setPhoneNumber(employee.phone_number || "");
        setDob(employee.dob || "");
        setAddress(employee.address || "");
        setRoleId(employee.role_id || "");
        setRemark(employee.remark || "");
        setGender(employee.gender || "");
        setExistingImage(employee.image_url || null);
      } else {
        toast.error("Failed to fetch employee details");
      }
    } catch (error) {
      toast.error("Error fetching employee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
    if (id) {
      getEmployee();
    }
  }, [id]);

  const updateEmployee = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Employee name is required");
      return;
    }
    if (!email.trim()) {
      toast.warning("Employee email is required");
      return;
    }
    if (!phone_number.trim()) {
      toast.warning("Phone number is required");
      return;
    }
    if (!role_id) {
      toast.warning("Please select a role");
      return;
    }
    if (
      !dob ||
      isNaN(new Date(dob)) ||
      new Date().getFullYear() - new Date(dob).getFullYear() > 100 ||
      new Date().getFullYear() - new Date(dob).getFullYear() < 0
    ) {
      toast.warning("Please select a valid date (age 0-100)");
      return;
    }

    if (!address.trim()) {
      toast.warning("Address is required");
      return;
    }

    if (!gender.trim()) {
      toast.warning("Gender is required");
      return;
    }

    // Only validate passwords if they are provided (for update)
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        toast.warning("Password and Confirm Password must be same");
        return;
      }

      if (password.length < 6) {
        toast.warning("Password must be at least 6 characters long");
        return;
      }
    }

    // Build FormData with correct field names
    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone_number", phone_number);
    formData.append("dob", dob);
    formData.append("address", address);
    formData.append("role_id", role_id);
    formData.append("remark", remark);
    formData.append('gender', gender);
    
    // Only append password if provided
    if (password) {
      formData.append('password', password);
    }
    
    // Only append image if a new one is selected
    if (image) {
      formData.append('image', image);
    }
    

    try {
      let response = await postData(`employees/${id}`, formData);

      if (response.status === 200) {
        toast.success("Employee updated successfully");
        navigate("/admin/employees");
      } else {
        toast.error("Failed to update employee. Please try again.");
      }
    } catch (error) {
      toast.error("Error updating employee");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading employee details...</div>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={updateEmployee}
        className=" w-4/5 mx-auto my-10 px-40 py-5 rounded-lg shadow-lg"
      >
        <h1 className="text-center text-xl font-bold">Edit Employee</h1>

        <div className="flex justify-center items-center gap-4 mt-10">
          {/* Show existing image or new preview */}
          {(preview || existingImage) && (
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                <img
                  src={preview || existingImage}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                onClick={handleRemove}
                className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full cursor-pointer text-xs"
              >
                ×
              </span>
            </div>
          )}

          {/* Plus Button - show if no image exists */}
          {!preview && !existingImage && (
            <div>
              <input
                type="file"
                id="upload-image"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="upload-image">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-blue-400 transition">
                  <AddIcon fontSize="large" className="text-gray-400" />
                </div>
              </label>
            </div>
          )}

          {/* Change Image Button - show if existing image exists but no new image selected */}
          {existingImage && !preview && (
            <div>
              <input
                type="file"
                id="change-image"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="change-image">
                <Button variant="outlined" component="span">
                  Change Image
                </Button>
              </label>
            </div>
          )}
        </div>

        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Employee Name"
          required
        />

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Employee Email"
          required
        />

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Change Password (Optional)
          </h3>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full py-3 px-4 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
            placeholder="New Password (leave blank to keep current)"
          />

          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type="password"
            className="w-full py-3 px-4 mt-2 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
            placeholder="Confirm New Password"
          />
          <p className="text-sm text-gray-500 mt-1">
            Only fill these fields if you want to change the password
          </p>
        </div>

        <input
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phone_number}
          type="tel"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Employee Phone Number"
          required
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            onChange={(e) => setDob(e.target.value)}
            value={dob}
            type="date"
            className="w-full py-3 px-4 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
            required
          />
        </div>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role_id}
            label="Role"
            onChange={(e) => setRoleId(e.target.value)}
            required
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <input
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Employee Address"
          required
        />

        <textarea
          onChange={(e) => setRemark(e.target.value)}
          value={remark}
          rows={3}
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Remark"
        />

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="gender-select-label">Gender</InputLabel>
          <Select
            labelId="gender-select-label"
            value={gender}
            label="Gender"
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
          </Select>
        </FormControl>

        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
          >
            Update Employee
          </Button>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={() => navigate("/admin/employees")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}