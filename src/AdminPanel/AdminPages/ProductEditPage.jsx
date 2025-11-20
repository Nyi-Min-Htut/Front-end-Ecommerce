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

import { deleteData, getData, postData } from "../../axios/axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogContentText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const [images, setImages] = useState([]); // only 1 image will be here
  const [previews, setPreviews] = useState([]); // also only 1 preview

  const [existingImages, setExistingImages] = useState([]);
  const [originalProductData, setOriginalProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const getCategory = async () => {
    let response = await getData("categories");
    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };

  const getBrands = async () => {
    let response = await getData("brands");
    if (response.status === 200) {
      setBrands(response.data.data);
    }
  };

  const getProduct = async () => {
    setLoading(true);

    const response = await getData(`products/${id}`);

    if (response.status === 200) {
      const product = response.data;

      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setCategory(product.category_id || "");
      setBrand(product.brand_id || "");

      // Show only main images
      setExistingImages(
        (product.product_images || []).filter(
          (img) => img.product_variant_id === null
        )
      );

      setOriginalProductData(product);
    }

    setLoading(false);
  };

  useEffect(() => {
    getCategory();
    getBrands();
    if (id) {
      getProduct();
    }
  }, [id]);

  // --- SINGLE FILE UPLOAD FIX ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages([file]); // store only one image
    setPreviews([URL.createObjectURL(file)]); // single preview
  };

  const handleRemoveImage = () => {
    setImages([]);
    setPreviews([]);
  };

  const handleRemoveExistingImage = async (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));

    const response = await deleteData(`products/images/${imageId}`);
    if (response.status === 200) {
      toast.success("Image deleted successfully");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.warning("Product name is required");
    if (!description.trim()) return toast.warning("Description is required");
    if (!price || isNaN(price) || Number(price) <= 0)
      return toast.warning("Price must be a valid number greater than 0");
    if (!category) return toast.warning("Please select a category");

    let formData = new FormData();

    // --- SEND ONLY ONE NEW IMAGE ---
    if (images.length > 0) {
      formData.append("product_main_img", images[0]);
    }

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", category);
    formData.append("brand_id", brand);

    try {
      const response = await postData(`products/${id}`, formData);

      if (response.status === 200) {
        toast.success("Product updated successfully!");
        navigate("/admin/products");
      } else {
        toast.error("Failed to update product. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating product");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading product details...</div>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={updateProduct}
        className=" w-4/5 mx-auto my-10 px-40 py-5 rounded-lg shadow-lg"
      >
        <h1 className="text-center text-xl font-bold">Edit Product</h1>

        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md"
          placeholder="Product Name"
        />

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="brand-select-label">Brand</InputLabel>
          <Select
            labelId="brand-select-label"
            value={brand}
            label="Brand"
            onChange={(e) => setBrand(e.target.value)}
          >
            {brands.map((brandItem) => (
              <MenuItem key={brandItem.id} value={brandItem.id}>
                {brandItem.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          rows={4}
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md"
          placeholder="Product Description"
        />

        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          type="number"
          step="0.01"
          className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md"
          placeholder="Price"
        />

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Existing Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {existingImages.map((image, idx) => (
                <div className="relative w-32 h-32" key={image.id}>
                  <span
                    onClick={() => handleRemoveExistingImage(image.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs z-10 hover:bg-red-600"
                  >
                    x
                  </span>
                  <img
                    src={image.image_url}
                    alt={`existing-${idx}`}
                    className="rounded-md border w-32 h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload ONE new image */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Add New Image</h3>

          <input
            accept="image/*"
            id="upload-images"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <label htmlFor="upload-images">
            <Button component="span" variant="outlined">
              Upload Image
            </Button>
          </label>

          {/* Preview single new image */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="relative w-32 h-32">
                <span
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs z-10 hover:bg-red-600"
                >
                  x
                </span>

                <img
                  src={previews[0]}
                  alt="preview"
                  className="rounded-md border w-32 h-32 object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
}
