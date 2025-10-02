import React, { useState } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  Divider, 
  IconButton
} from '@mui/material'
import {
  Close,
  Add,
  Remove,
  Delete,
  LocalShipping,
  Security,
  ShoppingCart
} from '@mui/icons-material'

export default function HomePageLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const handleOpenCart = () => setCartOpen(true);
  const handleCloseCart = () => setCartOpen(false);

  const cartItems = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 129.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      color: "Black",
      features: ["Noise Cancelling", "Wireless", "20hr Battery"]
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 199.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      color: "Midnight Blue",
      features: ["Heart Rate Monitor", "GPS", "Water Resistant"]
    },
    {
      id: 3,
      name: "Premium Laptop Backpack",
      price: 79.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      color: "Charcoal Gray",
      features: ["Water Resistant", "15\" Laptop", "USB Charging"]
    },
    {
      id: 4,
      name: "Mechanical Keyboard",
      price: 89.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      color: "RGB",
      features: ["Mechanical Switches", "RGB Lighting", "Wireless"]
    },
    {
      id: 5,
      name: "Gaming Mouse",
      price: 59.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
      color: "Black",
      features: ["16000 DPI", "Wireless", "7 Buttons"]
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div>
      <Navbar onSearchChange={setSearchQuery} onCartClick={handleOpenCart} />
      <Outlet context={{ searchQuery }} />

      {/* Single Column Cart Modal */}
      <Modal 
        open={cartOpen} 
        onClose={handleCloseCart}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1, sm: 2 }
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '800px', lg: '1000px' },
            height: { xs: '100%', sm: '90vh' },
            maxHeight: { xs: '100%', sm: '800px' },
            bgcolor: 'background.paper',
            borderRadius: { xs: 0, sm: 2 },
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: { xs: 2, sm: 3 },
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShoppingCart sx={{ fontSize: 28, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Shopping Cart
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cartItems.length} items in your cart
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={handleCloseCart}
              size="large"
              sx={{ 
                bgcolor: 'grey.100',
                '&:hover': { bgcolor: 'grey.200' }
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Scrollable Content - Everything in one column */}
          <Box sx={{ 
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 3 }
          }}>
            {/* Cart Items */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Your Items ({cartItems.length})
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      gap: { xs: 2, sm: 3 },
                      p: { xs: 2, sm: 3 },
                      borderRadius: 2,
                      bgcolor: 'grey.50',
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: 12,
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />

                    {/* Product Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                        {item.name}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Color: {item.color}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.features.map((feature, index) => (
                            <Box
                              key={index}
                              sx={{
                                px: 1,
                                py: 0.5,
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {feature}
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      {/* Price and Quantity */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                      }}>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          ${item.price}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              bgcolor: 'white',
                              border: 1,
                              borderColor: 'grey.300',
                              '&:hover': { bgcolor: 'grey.100' }
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography 
                            sx={{ 
                              minWidth: 40, 
                              textAlign: 'center',
                              fontWeight: 'bold',
                              fontSize: '1.1rem'
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton 
                            size="small"
                            sx={{ 
                              bgcolor: 'white',
                              border: 1,
                              borderColor: 'grey.300',
                              '&:hover': { bgcolor: 'grey.100' }
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    {/* Delete Button */}
                    <IconButton 
                      color="error"
                      sx={{ 
                        bgcolor: 'error.light',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.main' },
                        flexShrink: 0
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Order Summary - At the bottom of scrollable content */}
            <Box sx={{ 
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: { xs: 3, sm: 4 },
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
                Order Summary
              </Typography>

              {/* Trust Badges */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: 4,
                mb: 4,
                p: 3,
                bgcolor: 'white',
                borderRadius: 2
              }}>
                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping sx={{ color: 'primary.main' }} />
                  <Typography variant="body1" fontWeight="bold">Free Shipping</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security sx={{ color: 'primary.main' }} />
                  <Typography variant="body1" fontWeight="bold">Secure Checkout</Typography>
                </Box>
              </Box>

              {/* Discount Code */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                  💰 Apply Discount Code
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box 
                    sx={{ 
                      flex: 1,
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Enter promo code...
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      minWidth: '120px',
                      fontWeight: 'bold'
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>

              {/* Pricing Breakdown */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 1 }}>
                  <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body1" fontWeight="bold">${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 1 }}>
                  <Typography variant="body1" color="text.secondary">Shipping</Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    color={shipping === 0 ? 'success.main' : 'text.primary'}
                  >
                    {shipping === 0 ? 'FREE' : `$${shipping}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 1 }}>
                  <Typography variant="body1" color="text.secondary">Tax</Typography>
                  <Typography variant="body1" fontWeight="bold">${tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h5" fontWeight="bold">Total Amount</Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Checkout Button */}
              <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                sx={{ 
                  py: 2,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                🛒 Proceed to Secure Checkout
              </Button>

              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center"
                sx={{ fontStyle: 'italic' }}
              >
                🔒 Your payment information is secure and encrypted
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}