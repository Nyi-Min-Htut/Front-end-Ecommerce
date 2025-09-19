import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";


import { getData, postData } from "../../axios/axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogContentText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import role from "./Role";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function employeeCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [roleId, setRoleId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roles, setRoles] = useState([]);
    const [image, setImage] = useState(); // File objects
  const [preview, setPreview] = useState(null); // Blob URLs
  const [confirm_password, setConfirm_password] = useState("");

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

  useEffect(() => {
    getRoles();
  }, []);

  const createEmployee = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("employee name is required");
      return;
    }
    if (!email.trim()) {
      toast.warning("employee email is required");
      return;
    }
    if (!phone.trim()) {
      toast.warning("Phone is required");
      return;
    }
    if (!roleId) {
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
      toast.warning("Phone is required");
      return;
    }

    if (!gender.trim()) {
      toast.warning("Gender is required");
      return;
    }

    if (!image) {
      toast.warning("Please upload an image");
    }

    if(password !== confirm_password)
    {
        toast.warning("Password and Confirm Password must be same");
        return;
    }

    if(password.length < 6)
    {
        toast.warning("Password must be at least 6 characters long");
        return;
    }


    // Build FormData
    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("dob", dob);
    formData.append("address", address);
    formData.append("role_id", roleId);
    formData.append("remarks", remarks);
    formData.append('image',image);
    formData.append('gender',gender)
    formData.append('password',password);

    let response = await postData("employees", formData);

    if (response.status === 200) {
      navigate("/admin/employees");
    } else {
      toast.error("Failed to create employee. Please try again.");
    }
  };

  return (
    <div>
      <form
        onSubmit={createEmployee}
        className=" w-4/5 mx-auto my-10 px-40 py-5 rounded-lg shadow-lg"
      >
        <h1 className="text-center text-xl font-bold">Create New employee</h1>

            <div className="flex justify-center items-center gap-4 mt-10">
      {/* Preview if exists */}
      {preview && (
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
            <img
              src={preview}
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

      {/* Plus Button */}
     { !preview && (
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
      </div>)}
    </div>

        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="employee Name"
        />

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Employee Email"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Password"
        />

        <input
          onChange={(e) => setConfirm_password(e.target.value)}
          value={confirm_password}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Confirm Password"
        />

        <input
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          type="phone"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Employee Phone"
        />

         <input
          onChange={(e) => setDob(e.target.value)}
          value={dob}
          type="date"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Employee Phone"
        />


        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="category-select-label">Roles</InputLabel>
          <Select
            labelId="category-select-label"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
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
        />

        <textarea
          onChange={(e) => setRemarks(e.target.value)}
          value={remarks}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Remark"
        />

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="category-select-label">Gender</InputLabel>
          <Select
            labelId="category-select-label"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value={"male"}>Male</MenuItem>

            <MenuItem value={"female"}>Female</MenuItem>
          </Select>
        </FormControl>

        
        <div>
          <Button
            sx={{ mt: 4 }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Confirm Create employee
          </Button>

          <div className='rounded-full '>

          </div>
        </div>
      </form>
    </div>
  );
}
