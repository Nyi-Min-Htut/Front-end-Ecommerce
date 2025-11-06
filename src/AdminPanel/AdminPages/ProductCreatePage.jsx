import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [attributeIds, setAttributeIds] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  let [categories, setCategories] = useState([]);
  const [attributename, setAttributeName] = useState("");
  const [attributeDescription, setAttributeDescription] = useState("");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getCategory = async () => {
    let response = await getData("categories");
    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };

  const getAttributes = async () => {
    let response = await getData("attributes");
    if (response.status === 200) {
      setAttributes(response.data.data);
      console.log(response.data.data);
    }
  };

  useEffect(() => {
    getCategory();
    getAttributes();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 6) {
      alert("You can only upload up to 6 images.");
      files.length = 0;
      return;
    } else {
      setImages(files);
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }
  };
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const createProduct = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.warning("Product name is required");
      return;
    }
    if (!description.trim()) {
      toast.warning("Description is required");
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      toast.warning("Price must be a valid number greater than 0");
      return;
    }
    if (!category) {
      toast.warning("Please select a category");
      return;
    }
    if (images.length === 0) {
      toast.warning("Please upload at least one image");
      return;
    }
    if (images.length > 6) {
      toast.warning("You can upload a maximum of 6 images");
      return;
    }

    // Build FormData
    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", category);
    let response = await postData("products", formData);

    if (response.status === 200) {
      navigate("/admin/products");
    } else {
      toast.error("Failed to create product. Please try again.");
    }
  };



  return (
    <div>
      {/* dialog */}
     
      <form
        onSubmit={createProduct}
        className=" w-4/5 mx-auto my-10 px-40 py-5 rounded-lg shadow-lg"
      >
        <h1 className="text-center text-xl font-bold">Create New Product</h1>

        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Product Name"fdasfdasffdasfjlllf
        />

         <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>fdasfdasffdasfjlllf
        </FormControl>

         <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="category-select-label">Brand</InputLabel>
          <Select
            labelId="category-select-label"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            {categories.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Product Description"
        />

        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          type="number"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Price"
        />

       
      

        <div className="flex flex-col gap-4 w-1/4">
          {/* Upload Button */}
          <input
            accept="image/*"
            id="upload-images"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <label htmlFor="upload-images">
            <Button  component="span">
              Upload Images
            </Button>
          </label>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previews.map((src, idx) => (
                <div className="relative w-32 h-32" key={idx}>
                  {/* Remove button */}
                  <span
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs z-10"
                  >
                    x
                  </span>

                  {/* Image */}
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="rounded-md border w-32 h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Button
            sx={{ mt: 4 }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Confirm Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
