import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  IconButton 
} from '@mui/material'
import { Close, Add, Remove, Delete, ShoppingCart } from '@mui/icons-material'
import axios from 'axios'
import Snowfall from 'react-snowfall'

export default function HomePageLayout() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch cart data from API
  useEffect(() => {
    fetchCartData()
  }, [])

  const fetchCartData = async () => {
    setLoading(false);
  }

  const handleOpenCart = () => setCartOpen(true)
  const handleCloseCart = () => setCartOpen(false)

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return // Prevent zero or negative quantities
    
    try {
      // Call API to update quantity
      await axios.put(`http://localhost:8000/api/cart/${itemId}`, {
        quantity: newQuantity
      })
      
      // Update local state
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${itemId}`)
      setCartItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  )
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <Snowfall color='#82C3D9' />
      <Snowfall color='#edededff' />
      <Snowfall color='#cdcdcdff' />


      <Navbar onSearchChange={setSearchQuery} onCartClick={handleOpenCart} />
      <Outlet context={{ searchQuery }} />

      {/* Cart Modal */}
      <Modal open={cartOpen} onClose={handleCloseCart}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-blue-600 text-3xl" />
              <div>
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <p className="text-gray-500">{cartItems.length} items</p>
              </div>
            </div>
            <IconButton onClick={handleCloseCart} className="bg-gray-100 hover:bg-gray-200">
              <Close />
            </IconButton>
          </div>

          {/* Cart Items */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCart className="text-gray-300 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">Your cart is empty</h3>
                <p className="text-gray-500">Add some products to your cart!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border">
                    
                    {/* Product Image */}
                    <img 
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">Color: {item.color}</p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.features?.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 
                                                     text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600 text-lg">
                          ${item.price}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-white border"
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          
                          <span className="w-10 text-center font-bold">
                            {item.quantity}
                          </span>
                          
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-white border"
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <IconButton 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Delete />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary - Only show if cart has items */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-bold'}>
                    {shipping === 0 ? 'FREE' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                fullWidth 
                variant="contained" 
                className="bg-blue-600 hover:bg-blue-700 py-3"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  )
}