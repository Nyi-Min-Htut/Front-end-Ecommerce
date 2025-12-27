import React, { use, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { deleteData, getData } from '../../axios/axios';
import AddIcon from '@mui/icons-material/Add';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogContentText,
} from "@mui/material";
import { toast } from 'react-toastify';

export default function ProductDetailAP() {
    const [open, setOpen] = useState(false);
      const [deleteId, setDeleteId] = useState(null);
    
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  let { id } = useParams();
  let navigate = useNavigate();
  const getProductDetail = async () => {
    try {
      let response = await getData("products/" + id);
      if (response.data) {
        setProduct(response.data);
        // Set first product image as selected
        if (response.data.product_images && response.data.product_images.length > 0) {
          setSelectedImage(response.data.product_images[0].image_url);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }

    const deleteVaraint = async () => {
      let response = await deleteData('products/variants/' + deleteId);
      if (response.status === 200) {
        toast.success("Variant deleted successfully");
        getProductDetail(id);
      } else {
        toast.error("Error deleting variant");
      }
  
      setOpen(false);
    }

  useEffect(() => {
    getProductDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Product not found</div>
      </div>
    );
  }

  // Filter only main product images (without variant_id)
  const mainProductImages = product.product_images?.filter(img => img.product_variant_id === null) || [];

  // Get all images including variants for thumbnail gallery
  const allImages = product.product_images || [];

  return (
    <div className="container mx-auto px-4 py-8">

      {/* dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => deleteVaraint()} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Breadcrumb */}
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={()=>navigate('/admin/products_variations_create/'+id)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm">
            Add Product Variants
          </button>

        </div>
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <span>Products</span> &gt; <span>{product.category?.name || 'Uncategorized'}</span> &gt; <span className="text-gray-800">{product.name}</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images */}
          <div className="lg:w-1/2">
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400">No image available</div>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 0 && (
                <div className="flex flex-col">
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {allImages.map((image, index) => (
                      <div
                        key={image.id}
                        className={`flex-shrink-0 w-20 h-20 border-2 rounded cursor-pointer transition-all ${selectedImage === image.image_url ? 'border-blue-500 shadow-md' : 'border-gray-200'
                          }`}
                        onClick={() => setSelectedImage(image.image_url)}
                      >
                        <img
                          src={image.image_url}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Image counter */}
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {allImages.length} image(s) • Click to view
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Information */}
          <div className="lg:w-1/2">
            {/* Product Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                <p className="text-gray-900">{product.category?.name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Brand</h4>
                <p className="text-gray-900">{product.brand?.name || 'N/A'}</p>
              </div>
            </div>

            {/* Stock Information */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Stock Information</h4>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">{product.stock} units</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min((product.stock / 100) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Product ID & Dates */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Product ID:</span>
                  <span className="ml-2 font-mono">{product.id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="ml-2">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variants Table Section */}
        {product.product_variants && product.product_variants.length > 0 && (
          <div className="mt-12">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Product Variants</h2>
              <p className="text-gray-600 mt-1">
                {product.product_variants.length} variant(s) available
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variant Details
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attributes
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.product_variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                      {/* Variant Image */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {variant.product_images && variant.product_images.length > 0 ? (
                            <div className="flex space-x-1">
                              {variant.product_images.slice(0, 3).map((image, idx) => (
                                <div key={image.id} className="relative">
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                    src={image.image_url}
                                    alt={`Variant ${idx + 1}`}
                                  />
                                  {idx === 2 && variant.product_images.length > 3 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">
                                        +{variant.product_images.length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Variant Details */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {variant.name || `Variant #${variant.id}`}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {variant.description || 'No description'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {variant.id}
                        </div>
                      </td>

                      {/* Attributes */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {variant.attributes && variant.attributes.length > 0 ? (
                            variant.attributes.map((attr) => (
                              <span
                                key={attr.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                title={`${attr.name}: ${attr.pivot.value}`}
                              >
                                {attr.name}: {attr.pivot.value}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No attributes</span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ${parseFloat(variant.price).toFixed(2)}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${variant.stock > 10 ? 'text-green-600' :
                              variant.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {variant.stock}
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${variant.stock > 10 ? 'bg-green-500' :
                                  variant.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              style={{
                                width: `${Math.min((variant.stock / 50) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {variant.stock > 0 ? 'Active' : 'Out of Stock'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <AddIcon
                          onClick={() => {
                            navigate('/admin/variants/' + variant.id + '/edit');
                          }}
                          className='bg-green-100 hover:bg-green-300 cursor-pointer rounded-full p-1'
                            />

                          <DeleteOutlineIcon
                          onClick={()=>{
                            setDeleteId(variant.id);
                            setOpen(true);
                          }}
                          className='bg-red-100 hover:bg-red-300 cursor-pointer rounded-full p-1'
                          />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Total variants: <strong>{product.product_variants.length}</strong>
                  </span>
                  <span>
                    Total stock across variants: <strong>
                      {product.product_variants.reduce((total, variant) => total + (variant.stock || 0), 0)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Variants Message */}
        {(!product.product_variants || product.product_variants.length === 0) && (
          <div className="mt-12 text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-lg mb-2">No variants available</div>
            <p className="text-gray-500 text-sm">This product doesn't ve any variants yet.</p>
          </div>
        )}
      </div>

      {/* Add to top right of product info section */}

    </div>
  );
}