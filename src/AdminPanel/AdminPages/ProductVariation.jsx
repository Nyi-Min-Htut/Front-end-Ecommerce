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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from "@mui/material";

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
import { useNavigate, useParams } from "react-router-dom";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [attributes, setAttributes] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [images, setImages] = useState([]);
  const [variantImages, setVariantImages] = useState([]);       // actual files
  const [variantPreviews, setVariantPreviews] = useState([]);   // for showing previews

  const [previews, setPreviews] = useState([]);
  const [attr, setAttr] = useState({});
  const [stock, setStock] = useState("");

  const { id } = useParams();

  const getProductDetail = async (id) => {
    let response = await getData("products/" + id);
    console.log(response.data);
    if (response.status === 200) {
      setProduct(response.data.data);

      let attrRes = await getData(`categories/${response.data.category_id}/attributes`);
      if (attrRes.status === 200) {
        console.log(attrRes.data);
        setAttributes(attrRes.data);
      }
    }
  };


  useEffect(() => {
    if (id) {
      getProductDetail(id);
    }
  }, [id]);

  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);
    if (files.length > 6) {
      alert("You can only upload up to 6 images.");
      files.length = 0;
      return;
    } else {
      setVariantImages(files);
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setVariantPreviews(previewUrls);
    }
  };
  const handleRemoveImage = (index) => {
    const newImages = [...variantImages];
    const newPreviews = [...variantPreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setVariantImages(newImages);
    setVariantPreviews(newPreviews);
  };
  const [variants, setVariants] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !stock) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    const newVariant = {
      name,
      stock,
      description,
      ...attr,                // dynamic attributes
      images: variantImages,  // array of files
    };

    // Add new variant to the variants array
    setVariants((prev) => [...prev, newVariant]);

    // Clear form for next variant
    setName("");
    setStock("");
    setDescription("");
    setAttr({});
    setVariantImages([]);
    setVariantPreviews([]);
  };

  const handleProductVariantsSubmit = async () => {
    if (variants.length === 0) {
      toast.warning("Please add at least one variant.");
      return;
    }
    const payload = {
      product_id: id,
      variants: variants,
    };
    let response = await postData("products/variations", payload);
    if (response.status === 201) {
      toast.success("Product variants added successfully!");
      navigate("/admin/products");
    } else {
      toast.error("Failed to add product variants.");
    }
  }
  return (
    <div>
      {/* dialog */}

      <form
        onSubmit={handleSubmit}
        className=" w-4/5 mx-auto my-10 px-40 py-5 rounded-lg shadow-lg"
      >
        <h1 className="text-center text-xl font-bold">Add Product Variation</h1>
        <h1 className=''>Attributes</h1>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}

          className="w-full py-3 px-4 mt-5 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Variant Name"
        />

        <input
          onChange={(e) => setStock(e.target.value)}
          type="text"
          value={stock}

          className="w-full py-3 px-4 mt-5 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Stock quantity"
        />

        <textarea
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          value={description}

          className="w-full py-3 px-4 mt-5 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
          placeholder="Description"
        />
        {attributes.map((a) => (
          <input
            key={a.id}
            type="text"
            placeholder={a.name}
            value={attr[a.id] || ""}
            onChange={(e) =>
              setAttr((prev) => ({
                ...prev,        // keep other attribute values
                [a.id]: e.target.value, // update only this one
              }))
            }
            className="w-full py-3 px-4 mt-2 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          />
        ))}

        <div>
          <Button
            sx={{ mt: 4 }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Add Product Variants
          </Button>
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
      </form>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Product Variants
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Description</TableCell>
              {attributes.map((a) => (
                <TableCell key={a.id}>{a.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((variant, index) => (
              <TableRow key={index}>
                <TableCell>{variant.name}</TableCell>
                <TableCell>{variant.stock}</TableCell>
                <TableCell>{variant.description}</TableCell>
                {attributes.map((a) => (
                  <TableCell key={a.id}>{variant[a.id] || "-"}</TableCell>
                ))}
                <TableCell>
                  {variant.images && variant.images.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt={`variant-${index}-img-${i}`}
                      width={50}
                      style={{ marginRight: 5 }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <Button
          onClick={handleProductVariantsSubmit}
          sx={{ mt: 4 }}
          fullWidth
          variant="contained"
          color="primary"
        >
          Add Product Variants
        </Button>
      </div>

    </div>
  );
}
