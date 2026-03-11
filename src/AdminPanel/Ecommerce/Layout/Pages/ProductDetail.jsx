import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  Modal, Box, Typography, Button, IconButton,
  Radio, RadioGroup, FormControlLabel, FormControl,
  Chip, Skeleton, Badge, Rating
} from '@mui/material'
import {
  AddShoppingCart, Favorite, Share, ArrowBack,
  CheckCircle, LocalShipping, Security, Replay,
  ZoomIn, Remove, Add, Inventory
} from '@mui/icons-material'

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
  const [wishlist, setWishlist] = useState(false)
  const [zoomImage, setZoomImage] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

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
              variant: null,
              variant_name: 'Main Product'
            })
          }
        })

        // Add variant images
        productData.product_variants?.forEach(variant => {
          variant.product_images?.forEach(img => {
            imagesWithVariant.push({
              ...img,
              variant: variant,
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

  const handleImageClick = (image) => {
    setSelectedImage(image)
    if (image.variant && image.variant.id !== selectedVariant?.id) {
      setSelectedVariant(image.variant)
      initializeAttributes(image.variant)
      setQuantity(1)
    }
  }

  const handleVariantChange = (variantId) => {
    const variant = product.product_variants.find(v => v.id === variantId)
    setSelectedVariant(variant)
    initializeAttributes(variant)
    setQuantity(1)

    const variantImage = allImagesWithVariantInfo.find(
      img => img.variant?.id === variantId
    ) || allImagesWithVariantInfo.find(img => !img.variant)

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

  const toggleWishlist = () => {
    setWishlist(!wishlist)
    toast.success(!wishlist ? 'Added to wishlist' : 'Removed from wishlist')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <Skeleton variant="rectangular" height={500} className="rounded-2xl" />
                <div className="flex gap-4 mt-6">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} variant="rectangular" width={100} height={100} className="rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton variant="text" height={40} width="80%" />
                <Skeleton variant="text" height={30} width="60%" />
                <Skeleton variant="text" height={100} />
                <Skeleton variant="rectangular" height={200} className="rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Inventory className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h3>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
          >
            Return to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button and breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center group-hover:border-blue-200 transition-colors mr-3">
              <ArrowBack className="text-lg" />
            </div>
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="mx-2">›</span>
            <span className="hover:text-blue-600 cursor-pointer">{product.category?.name}</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">

            {/* Left Column - Images */}
            <div className="space-y-6">
              {/* Main Image with Zoom */}
              <div className="relative group">
                <div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden cursor-zoom-in"
                  onClick={() => setZoomImage(true)}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage.image_url}
                      alt={product.name}
                      className="w-full h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Inventory className="text-gray-400 text-3xl" />
                        </div>
                        <p className="text-gray-400">No image available</p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  onClick={() => setZoomImage(true)}
                >
                  <ZoomIn className="text-gray-700" />
                </button>

                {/* Stock Badge */}
                {selectedVariant?.stock > 0 && (
                  <div className="absolute top-4 left-4">
                    <Chip
                      icon={<CheckCircle />}
                      label={`${selectedVariant.stock} in stock`}
                      color="success"
                      className="bg-green-100 text-green-800 border border-green-200"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Gallery</h4>
                  <span className="text-sm text-gray-500">{allImagesWithVariantInfo.length} images</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {allImagesWithVariantInfo.map((image) => (
                    <div key={image.id} className="relative flex-shrink-0">
                      <div
                        className={`relative w-24 h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedImage?.id === image.id
                          ? image.variant
                            ? 'ring-3 ring-green-500 ring-offset-2'
                            : 'ring-3 ring-blue-500 ring-offset-2'
                          : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-300'
                          }`}
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {image.variant && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                            <p className="text-xs text-white truncate">{image.variant_name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-8">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {product.brand && (
                    <Chip
                      label={product.brand.name}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200"
                      size="small"
                    />
                  )}
                  <Chip
                    label={product.category?.name}
                    className="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200"
                    size="small"
                  />
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Rating value={4.5} precision={0.5} readOnly />
                      <span className="ml-2 text-gray-600">(128 reviews)</span>
                    </div>
                    <span className="text-green-600 font-semibold">🔥 Best Seller</span>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Price</p>
                    <div className="flex items-center gap-3">
                      <span className="text-5xl font-bold text-gray-900">
                        ${selectedVariant ? selectedVariant.price : product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-2xl text-gray-400 line-through">
                          ${product.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Chip
                      label="SAVE 20%"
                      color="error"
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Variant Selection as Tabs */}
              {product.product_variants?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Option</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.product_variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantChange(variant.id)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${selectedVariant?.id === variant.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        <span>{variant.name}</span>
                        {variant.stock <= 5 && variant.stock > 0 && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            Only {variant.stock} left
                          </span>
                        )}
                        {variant.stock === 0 && (
                          <span className="text-xs bg-red-500 px-2 py-1 rounded-full">
                            Sold out
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Selected Variant Quick Info */}
                  {selectedVariant && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Selected: {selectedVariant.name}</p>
                          <p className="text-xs text-gray-600 mt-1">{selectedVariant.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">${selectedVariant.price}</p>
                          <Chip
                            label={selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
                            size="small"
                            color={selectedVariant.stock > 0 ? 'success' : 'error'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Info Tabs */}
              <div className="space-y-4">
                {/* Tab Headers */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'description'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('specifications')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'specifications'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Specifications
                    {selectedVariant?.attributes?.length > 0 && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {selectedVariant.attributes.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('variant')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'variant'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Variant Details
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[200px]">
                  {/* Description Tab */}
                  {activeTab === 'description' && (
                    <div className="space-y-4">
                      {product.short_description && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700">{product.short_description}</p>
                        </div>
                      )}
                      <div className="prose max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Specifications Tab */}
                  {activeTab === 'specifications' && selectedVariant?.attributes && (
                    <div className="space-y-4">
                      {selectedVariant.attributes.length > 0 ? (
                        <>
                          {/* Grid Layout for Specifications */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedVariant.attributes.map(({ id, name, pivot }) =>
                              pivot?.value ? (
                                <div
                                  key={id}
                                  className="group p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                                >
                                  <div className="space-y-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      {name}
                                    </span>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {pivot.value}
                                    </p>
                                  </div>
                                </div>
                              ) : null
                            )}
                          </div>

                          {/* Compact View for Many Specs */}
                          {selectedVariant.attributes.length > 6 && (
                            <details className="group mt-2">
                              <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
                                View all specifications
                              </summary>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {selectedVariant.attributes.slice(6).map(({ id, name, pivot }) =>
                                  pivot?.value ? (
                                    <div key={id} className="flex justify-between text-sm py-1">
                                      <span className="text-gray-500">{name}:</span>
                                      <span className="font-medium text-gray-900">{pivot.value}</span>
                                    </div>
                                  ) : null
                                )}
                              </div>
                            </details>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No specifications available</p>
                      )}
                    </div>
                  )}

                  {/* Variant Details Tab */}
                  {activeTab === 'variant' && selectedVariant && (
                    <div className="space-y-4">
                      {/* Variant Summary Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200">
                          <p className="text-xs text-gray-500 mb-1">Variant Name</p>
                          <p className="font-semibold text-gray-900">{selectedVariant.name}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                          <p className="text-xs text-gray-500 mb-1">SKU</p>
                          <p className="font-semibold text-gray-900">{selectedVariant.sku || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Variant Description */}
                      {selectedVariant.description && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedVariant.description}</p>
                        </div>
                      )}

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p className={`font-bold ${selectedVariant.stock > 10 
                            ? 'text-green-600' 
                            : selectedVariant.stock > 0 
                              ? 'text-orange-600' 
                              : 'text-red-600'
                          }`}>
                            {selectedVariant.stock}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-bold text-blue-600">${selectedVariant.price}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-xs text-gray-500">Weight</p>
                          <p className="font-bold text-purple-600">{selectedVariant.weight || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Attributes Quick View */}
                      {selectedVariant.attributes?.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm font-medium text-gray-900 mb-3">Variant Specifications</p>
                          <div className="space-y-2">
                            {selectedVariant.attributes.slice(0, 4).map(({ id, name, pivot }) =>
                              pivot?.value ? (
                                <div key={id} className="flex justify-between text-sm">
                                  <span className="text-gray-500">{name}:</span>
                                  <span className="font-medium text-gray-900">{pivot.value}</span>
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Quantity</p>
                    <p className="text-sm text-gray-500">Select how many you want</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Remove />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      disabled={selectedVariant && quantity >= selectedVariant.stock}
                      className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Add />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                    className={`flex-1 py-4 px-8 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${selectedVariant && selectedVariant.stock > 0
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-[1.02]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <AddShoppingCart />
                    {selectedVariant && selectedVariant.stock > 0
                      ? `Add to Cart • $${(selectedVariant.price * quantity).toFixed(2)}`
                      : 'Out of Stock'}
                  </button>

                  <button
                    onClick={toggleWishlist}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center transition-all ${wishlist
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                  >
                    <Favorite className={wishlist ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <LocalShipping className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Replay className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">30-Day Returns</p>
                    <p className="text-sm text-gray-500">Hassle-free returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <Modal open={zoomImage} onClose={() => setZoomImage(false)}>
        <Box className="absolute inset-0 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            {selectedImage && (
              <img
                src={selectedImage.image_url}
                alt={product.name}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            )}
            <button
              onClick={() => setZoomImage(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="text-white text-xl">×</span>
            </button>
          </div>
        </Box>
      </Modal>

      {/* Add to Cart Success Modal */}
      <Modal open={cartModalOpen} onClose={() => setCartModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-green-600 text-4xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Added to Cart Successfully!
              </h2>
              <p className="text-gray-500">Your item has been added to the shopping cart</p>
            </div>

            <div className="flex items-center justify-center gap-6 p-6 bg-gray-50 rounded-xl">
              <img
                src={selectedImage?.image_url}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-xl shadow-sm"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900 mb-1">{product.name}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {selectedImage?.variant_name || selectedVariant?.name}
                </p>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-blue-600 text-lg">
                    ${selectedVariant?.price} × {quantity}
                  </span>
                  <span className="font-bold text-gray-900 text-lg">
                    = ${(selectedVariant?.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button
                onClick={() => setCartModalOpen(false)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  setCartModalOpen(false)
                  window.location.href = '/shopping_cart'
                }}
                className="w-full py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                View Cart & Checkout
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default ProductDetail