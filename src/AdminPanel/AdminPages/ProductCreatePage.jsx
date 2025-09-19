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
    if (attributeIds.length === 0) {
      toast.warning("Please select at least one attribute");
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
    attributeIds.forEach((id) => formData.append("attributeIds[]", id));
    images.forEach((image) => formData.append("images[]", image));

    let response = await postData("products", formData);

    if (response.status === 200) {
      navigate("/admin/products");
    } else {
      toast.error("Failed to create product. Please try again.");
    }
  };

  const createAttribute = async (e)=>{
    e.preventDefault();
    if (!attributename.trim()) {
      toast.warning("Attribute name is required");
      return;
    }
    if (!attributeDescription.trim()) {
      toast.warning("Attribute description is required");
      return;
    }
    let formdata = new FormData();
    formdata.append("name", attributename);
    formdata.append("description", attributeDescription);
    let response = await postData("attributes", formdata);
    if (response.status == 200) {
      setAttributeName("");
      setAttributeDescription("");
      getAttributes();
      handleClose();
      toast.success("Attribute created successfully");
      getAttributes();
    }
  }

  return (
    <div>
      {/* dialog */}
        <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div className=" ">
            <h1 className="text-xl font-bold text-center py-5">
              Create New Attributes
            </h1>
            <DialogContent>
              <DialogContentText>
                To create a new category, please enter the category name here.
              </DialogContentText>
              <form onSubmit={createAttribute}>
                <input
                  onChange={(e) => setAttributeName(e.target.value)}
                  value={attributename}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Attribute Name"
                />

                <input
                  onChange={(e) => setAttributeDescription(e.target.value)}
                  value={attributeDescription}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Attribute Description"
                />
                <div className="text-center mt-5 ">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </div>
      </Dialog>
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

        {/* Attribute Dropdown */}
        <div className="flex justify-between items-center text-center">
          <Autocomplete
            sx={{ mt: 3, mb: 3, width: "90%" }}
            multiple
            id="checkboxes-tags-demo"
            options={attributes}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setAttributeIds(value.map((item) => item.id));
            }}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Attributes"
                placeholder="Select attributes"
              />
            )}
          />
          <div>
            <AddCircleOutlineIcon onClick={handleClickOpen} className="text-gray-500 hover:text-blue-300 transform transition-transform duration-300 hover:scale-125" />
          </div>
        </div>

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
