import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { getData, postData } from "../../axios/axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton

} from "@mui/material";


import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";




export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  let [categories, setCategories] = useState([]);


  const getCategory = async () => {
    let response = await getData("categories");
    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };



  useEffect(() => {
    getCategory();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files.length);
    console.log(files);
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

    images.forEach((image) => formData.append("images[]", image));

    let response = await postData("products", formData);

    if (response.status === 200) {
      // navigate("");
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
          placeholder="Product Name"
        />

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
          </Select>
        </FormControl>



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
            <Button component="span">
              Upload Images
            </Button>
          </label>
        </div>

        {/* Previews */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((src, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
            >
              {/* Remove button */}
              <span
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-sm z-10"
              >
                ×
              </span>

              {/* Image */}
              <img
                src={src}
                alt={`preview-${idx}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
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
