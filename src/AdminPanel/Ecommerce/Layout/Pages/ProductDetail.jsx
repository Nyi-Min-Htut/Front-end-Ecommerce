import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  Modal, Box, Typography, Button, IconButton,
  Radio, RadioGroup, FormControlLabel, FormControl,
  FormLabel
} from '@mui/material'
import { AddShoppingCart, Favorite, Share, ArrowBack } from '@mui/icons-material'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)
  const [allImagesWithVariantInfo, setAllImagesWithVariantInfo] = useState([])

  // Fetch product data
  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8000/api/products/${id}`)

      if (response.data.success) {
        const productData = response.data.data
        setProduct(productData)

        // Create array of all images with their variant info
        const imagesWithVariant = []

        // Add main images (no variant)
        productData.product_images?.forEach(img => {
          if (!img.product_variant_id) {
            imagesWithVariant.push({
              ...img,
              variant: null, // Main product image
              variant_name: 'Main Product'
            })
          }
        })

        // Add variant images
        productData.product_variants?.forEach(variant => {
          variant.product_images?.forEach(img => {
            imagesWithVariant.push({
              ...img,
              variant: variant, // Reference to variant
              variant_name: variant.name
            })
          })
        })

        setAllImagesWithVariantInfo(imagesWithVariant)

        // Set first image as selected
        if (imagesWithVariant.length > 0) {
          const firstImage = imagesWithVariant[0]
          setSelectedImage(firstImage)

          // If first image belongs to a variant, select that variant
          if (firstImage.variant) {
            setSelectedVariant(firstImage.variant)
            initializeAttributes(firstImage.variant)
          } else if (productData.product_variants?.length > 0) {
            // If first image is main, select first variant
            const firstVariant = productData.product_variants[0]
            setSelectedVariant(firstVariant)
            initializeAttributes(firstVariant)
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load product')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const initializeAttributes = (variant) => {
    const initialAttributes = {}
    if (variant.attributes) {
      variant.attributes.forEach(attr => {
        initialAttributes[attr.id] = attr.pivot?.value || ''
      })
    }
    setSelectedAttributes(initialAttributes)
  }

  // Handle image click - change both image AND variant if needed
  const handleImageClick = (image) => {
    setSelectedImage(image)

    // If image belongs to a variant, switch to that variant
    if (image.variant && image.variant.id !== selectedVariant?.id) {
      setSelectedVariant(image.variant)
      initializeAttributes(image.variant)
      setQuantity(1)
    }
  }

  // Handle variant change from radio buttons
  const handleVariantChange = (variantId) => {
    const variant = product.product_variants.find(v => v.id === variantId)
    setSelectedVariant(variant)
    initializeAttributes(variant)
    setQuantity(1)

    // Find first image for this variant to display
    const variantImage = allImagesWithVariantInfo.find(
      img => img.variant?.id === variantId
    ) || allImagesWithVariantInfo.find(img => !img.variant) // fallback to main image

    if (variantImage) {
      setSelectedImage(variantImage)
    }
  }

  const handleAttributeChange = (attributeId, value) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeId]: value
    }))
  }

const handleAddToCart = () => {
  if (!selectedVariant) {
    toast.error('Please select a variant')
    return
  }

  // Create cart item
  const cartItem = {
    product_id: product.id,
    variant_id: selectedVariant.id,
    name: product.name,
    variant_name: selectedVariant.name,
    price: selectedVariant.price,
    quantity: quantity,
    attributes: selectedAttributes,
    main_image: selectedImage?.image_url || product.product_images?.[0]?.image_url,
    stock: selectedVariant.stock,
    selected_image_id: selectedImage?.id
  }

  // Save to localStorage
  const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existingItemIndex = existingCart.findIndex(
    item => item.variant_id === selectedVariant.id &&
      JSON.stringify(item.attributes) === JSON.stringify(selectedAttributes)
  )

  if (existingItemIndex > -1) {
    existingCart[existingItemIndex].quantity += quantity
  } else {
    existingCart.push(cartItem)
  }

  localStorage.setItem('cart', JSON.stringify(existingCart))
  
  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cartCount: existingCart.reduce((sum, item) => sum + item.quantity, 0) }
  }))
  
  toast.success('Added to cart!')
  setCartModalOpen(true)
}
  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600"
        >
          <ArrowBack className="mr-2" />
          Back to products
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">

            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4">
                {selectedImage ? (
                  <img
                    src={selectedImage.image_url}
                    alt={product.name}
                    className="w-full h-96 object-contain rounded-lg bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImagesWithVariantInfo.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.image_url}
                      alt={product.name}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${selectedImage?.id === image.id
                          ? image.variant ? 'border-green-500' : 'border-blue-500'
                          : 'border-transparent hover:border-gray-300'
                        }`}
                      onClick={() => handleImageClick(image)}
                    />

                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Brand and Category */}
              <div className="flex items-center gap-4">

              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              <span className="text-2xl font-bold text-gray-900">
                {product.brand?.name}
              </span>
              <div>
                <span className="text-xl font-bold text-gray-900">
                Category :{product.category?.name}
              </span>
              </div>
              {/* Description */}
              <p className="text-gray-600">
                {product.description}
              </p>

              {/* Variant Selection */}
              {product.product_variants?.length > 0 && (
                <div className="space-y-4">
                  <FormControl component="fieldset">
                    <FormLabel className="font-bold text-gray-900 mb-2">
                      Select Variant {selectedVariant && `(Currently: ${selectedVariant.name})`}
                    </FormLabel>
                    <RadioGroup
                      value={selectedVariant?.id || ''}
                      onChange={(e) => handleVariantChange(parseInt(e.target.value))}
                    >
                      <div className="space-y-2">
                        {product.product_variants.map(variant => (
                          <div
                            key={variant.id}
                            className={`border rounded-lg p-4 ${selectedVariant?.id === variant.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                              }`}
                          >
                            <FormControlLabel
                              value={variant.id}
                              control={<Radio />}
                              label={
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <span className="font-semibold">{variant.name}</span>
                                    {variant.description && (
                                      <p className="text-sm text-gray-500">{variant.description}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-lg text-blue-600">
                                      ${variant.price}
                                    </div>
                                    <div className={`text-sm ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {variant.stock > 0 ? `In stock (${variant.stock})` : 'Out of stock'}
                                    </div>
                                  </div>
                                </div>
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>
              )}

              {/* Attributes Selection */}
              {selectedVariant?.attributes && selectedVariant.attributes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Specifications</h3>
                  {selectedVariant.attributes.map(attribute => (
                    <div key={attribute.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {attribute.name}:
                      </label>
                      <select
                        value={selectedAttributes[attribute.id] || ''}
                        onChange={(e) => handleAttributeChange(attribute.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select {attribute.name}</option>
                        <option value={attribute.pivot?.value || attribute.description}>
                          {attribute.pivot?.value || attribute.description}
                        </option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${selectedVariant ? selectedVariant.price : product.price}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Quantity</p>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 disabled:text-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      disabled={selectedVariant && quantity >= selectedVariant.stock}
                      className="px-4 py-2 text-gray-600 disabled:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 ${selectedVariant && selectedVariant.stock > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <AddShoppingCart />
                  {selectedVariant && selectedVariant.stock > 0
                    ? `Add ${selectedImage?.variant ? selectedImage.variant.name : selectedVariant.name} to Cart - $${(selectedVariant.price * quantity).toFixed(2)}`
                    : 'Out of Stock'}
                </button>

                {/* <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Favorite className="text-gray-600" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share className="text-gray-600" />
                </button> */}
              </div>

              {/* Stock Info */}
              {selectedVariant && (
                <div className={`p-3 rounded-lg ${selectedVariant.stock > 10 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                  {selectedVariant.stock > 10
                    ? `✅ In stock (${selectedVariant.stock} available)`
                    : `⚠️ Only ${selectedVariant.stock} left in stock`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add to Cart Success Modal */}
      <Modal open={cartModalOpen} onClose={() => setCartModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <AddShoppingCart className="text-green-600 text-3xl" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Added to Cart!
            </h2>

            <div className="flex items-center justify-center gap-4">
              <img
                src={selectedImage?.image_url}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="text-left">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {selectedImage?.variant_name || selectedVariant?.name}
                </p>
                <p className="font-bold text-blue-600">
                  ${selectedVariant?.price} × {quantity} = ${(selectedVariant?.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => setCartModalOpen(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  setCartModalOpen(false)
                  window.location.href = '/shopping_cart'
                }}
                className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
              >
                View Cart
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default ProductDetail