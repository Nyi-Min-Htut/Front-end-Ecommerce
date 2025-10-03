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
  const [attributeIds, setAttributeIds] = useState([]);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  let [categories, setCategories] = useState([]);
  const [attributeValue, setAttrValue] = useState("");
  const [selectedAttr, setSelectedAttr] = useState();
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);

  //testing
  const [attributeValues, setAttributeValues] = useState({});



  const [open, setOpen] = useState(false);

  const handleClickOpen = (attr) => {
    setSelectedAttr(attr);
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
    let response = await getData("attributes/category/" + category);
    if (response.status == 200) {
      setAttributes(response.data);
    }
  };

  useEffect(() => {
    getCategory();
    getAttributes();
  }, [category]);

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
    Object.keys(attributeValues).forEach((key) => {
      formData.append(`attributes[${key}]`, attributeValues[key]);
    });
    images.forEach((image) => formData.append("images[]", image));

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

        {/* Attribute */}
        <div className="max-w-4xl mx-auto mt-6 px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Select Attributes</h2>

          {attributes && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {attributes.map((attr, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <label className="block text-gray-700 font-medium mb-2">
                    {attr.name}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter ${attr.name}`}
                    value={attributeValues[attr.id] || ""}
                    onChange={(e) =>
                      setAttributeValues({
                        ...attributeValues,
                        [attr.id]: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}

              {/* Static Stock Input */}
              <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                <label className="block text-gray-700 font-medium mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="Enter stock quantity"
                  value={attributeValues["stock"] || ""}
                  onChange={(e) =>
                    setAttributeValues({
                      ...attributeValues,
                      stock: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Static Price Input */}
              <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                <label className="block text-gray-700 font-medium mb-2">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Enter variation price"
                  value={attributeValues["price"] || ""}
                  onChange={(e) =>
                    setAttributeValues({
                      ...attributeValues,
                      price: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-end'>
          <button
            type="button"
            className="px-5 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              // Only add if at least one attribute value is entered
              const hasValues = Object.values(attributeValues).some(val => val !== "");
              if (!hasValues) {
                toast.warning("Please enter at least one attribute value for the variation.");
                return;
              }
              setVariations([...variations, { ...attributeValues }]);
              setAttributeValues({});
            }}
          >
            Add Variation
          </button>
        </div>

       
{variations.length > 0 && (
  <div className="mt-6">
    <h3 className="font-bold mb-4">Added Variations:</h3>
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            {attributes.map(attr => (
              <TableCell key={attr.id}>{attr.name}</TableCell>
            ))}
            <TableCell>Stock</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variations.map((variation, idx) => (
            <TableRow key={idx} hover>
              {attributes.map(attr => (
                <TableCell key={attr.id}>
                  {variation[attr.id] || "-"}
                </TableCell>
              ))}
              <TableCell>{variation.stock || "-"}</TableCell>
              <TableCell>{variation.price || "-"}</TableCell>
              <TableCell>
                <IconButton
                  color="error"
                  onClick={() => setVariations(variations.filter((_, i) => i !== idx))}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)}



        {/* Just for demo — modal simulation */}
        {open && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Selected Attribute: {selectedAttr}
              </h3>
              <input
                type="text"
                value={attributeValue}
                onChange={(e) => setAttrValue(e.target.value)}
                placeholder={`Enter value for ${selectedAttr}`}
                className="border p-2 w-full rounded"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={handleClose}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Close
                </button>s
                <button
                  onClick={() => {
                    console.log(`Saved ${selectedAttr}: ${attributeValue}`);
                    handleClose();
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

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
