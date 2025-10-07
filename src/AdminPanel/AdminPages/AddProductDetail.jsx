import React, { useEffect, useState } from "react";
import { Grid, Paper, TextField, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, postData } from "../../axios/axios";

export default function AddProductDetail() {
  const id = useParams().id;
  const [variantName, setVariantName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [productDetail, setProductDetail] = useState({});
  const getProductDetail =async(id)=>{
    let response = await getData('products/'+id);
    if(response.status===200)
    {
      setProductDetail(response.data);
      
    }else{
      toast.error("Error in loading product detail");
    }
  }


 

const [attributeValues, setAttributeValues] = useState({});
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleAttrChange = (attrId, value) =>
    setAttributeValues((prev) => ({ ...prev, [attrId]: value }));

  const handleFilesChange = (e) => {
    const f = Array.from(e.target.files || []);
    if (f.length === 0) return;
    setFiles(f);
    const urls = f.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const removePreview = (index) => {
    setFiles((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    setPreviews((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index]);
      copy.splice(index, 1);
      return copy;
    });
  };

  const createProductDetail = async(e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("variantName", variantName);
    formdata.append("product_id", id);
    formdata.append("attributeValues", JSON.stringify(attributeValues));
    formdata.append('price',price);
    formdata.append('stock',stock);
    files.forEach((file) => formdata.append("images", file));

    let response = await postData('products/variant',formdata);
    if(response.status===200)
    {
      toast.success("Product detail added successfully");
      setVariantName("");
      setAttributeValues({});
      setFiles([]);
      setPreviews([]);
    }else{
      toast.error("Error in adding product detail");
    }
  }


  useEffect(()=>{
    getProductDetail(id);
  },[id]);



  return (
  <div>
    {productDetail && (<form onSubmit={createProductDetail}>
    {/* <pre>{JSON.stringify(productDetail.category.attributes, null, 2)}</pre> */}
      <Paper className="p-6 max-w-4xl mx-auto my-8">
        <Typography variant="h6" gutterBottom>
          Product Detail (UI Preview)
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Product ID: {productDetail.id}
        </Typography>

        <TextField
          value={variantName}
          fullWidth
          onChange={(e)=>{
            setVariantName(e.target.value);
          }}
          margin="normal"
          label="Product Name"
        />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {productDetail?.category?.attributes?.map((attr) => (
            <Grid item xs={12} sm={6} md={4} key={attr.id}>
              <TextField
                label={attr.name}
                value={attributeValues[attr.id] || ""}
                onChange={(e) => handleAttrChange(attr.id, e.target.value)}
                fullWidth
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Stock (default)"
              value={stock}
              onChange={(e)=>setStock(e.target.value)}
              fullWidth
              type='number'
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Price (default)"
              value={price}
              type="number"
              onChange={(e)=>setPrice(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Image Upload */}
        <div className="mt-6">
          <Typography variant="subtitle1" gutterBottom>
            Variation Images
          </Typography>
          <input
            id="add-detail-images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            style={{ display: "none" }}
          />
          <label htmlFor="add-detail-images">
            <Button variant="contained" component="span">
              Upload Images
            </Button>
          </label>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {previews.map((src, idx) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <Paper
                  elevation={3}
                  sx={{ position: "relative", borderRadius: 1, overflow: "hidden" }}
                >
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    style={{ width: "100%", height: 120, objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 4, right: 4 }}
                    onClick={() => removePreview(idx)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outlined"
            color="secondary"
            type="submit"
          >
            Reset (UI)
          </Button>
        </div>
      </Paper>
    </form>)}
  </div>
  );
}
