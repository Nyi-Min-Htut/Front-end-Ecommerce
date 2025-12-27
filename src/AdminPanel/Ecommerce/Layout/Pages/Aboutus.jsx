import React from 'react';
import {
  Storefront,
  LocalShipping,
  Shield,
  Group,
  TrendingUp,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Star,
  ShoppingBag
} from '@mui/icons-material';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Storefront className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              From a small idea to a trusted marketplace serving thousands of customers worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg mb-6">
              To provide an exceptional shopping experience by connecting customers with quality products 
              from trusted sellers worldwide, while maintaining the highest standards of service and reliability.
            </p>
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Core Values</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Customer Satisfaction First
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Quality Over Quantity
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Transparent Business Practices
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Sustainable Growth
                </li>
              </ul>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Our Team"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <LocalShipping className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
            <p className="text-gray-600">
              We deliver to your doorstep within 2-5 business days. Free shipping on orders over $100.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Shopping</h3>
            <p className="text-gray-600">
              Your security is our priority. We use SSL encryption to protect all transactions.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Group className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Dedicated Support</h3>
            <p className="text-gray-600">
              Our customer service team is available 24/7 to assist with any questions or concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Leadership
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="CEO"
                className="w-48 h-48 rounded-full object-cover mx-auto mb-6"
              />
              <h3 className="text-xl font-bold text-gray-900">Alex Johnson</h3>
              <p className="text-blue-600 mb-4">CEO & Founder</p>
              <p className="text-gray-600">
                With 15+ years in e-commerce, Alex leads our vision for innovation and growth.
              </p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Head of Operations"
                className="w-48 h-48 rounded-full object-cover mx-auto mb-6"
              />
              <h3 className="text-xl font-bold text-gray-900">Sarah Chen</h3>
              <p className="text-blue-600 mb-4">Head of Operations</p>
              <p className="text-gray-600">
                Ensures seamless logistics and customer satisfaction across all touchpoints.
              </p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Tech Lead"
                className="w-48 h-48 rounded-full object-cover mx-auto mb-6"
              />
              <h3 className="text-xl font-bold text-gray-900">Michael Torres</h3>
              <p className="text-blue-600 mb-4">Technology Director</p>
              <p className="text-gray-600">
                Drives our platform innovation and ensures secure, reliable technology infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12">
          <div className="flex items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Our Commitment to Sustainability</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 text-lg mb-6">
                We're committed to reducing our environmental impact through eco-friendly packaging, 
                carbon-neutral shipping, and partnerships with sustainable suppliers.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  100% Recyclable Packaging Materials
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  Carbon Offset Shipping Program
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  Ethical Sourcing Partners
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Sustainability"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-blue-100">+1 (555) 123-4567</p>
              <p className="text-blue-200 text-sm">Mon-Fri, 9am-6pm EST</p>
            </div>
            
            <div className="text-center">
              <Email className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-blue-100">support@yourstore.com</p>
              <p className="text-blue-200 text-sm">24/7 Support Available</p>
            </div>
            
            <div className="text-center">
              <LocationOn className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-blue-100">123 Commerce Street</p>
              <p className="text-blue-200 text-sm">San Francisco, CA 94107</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Ready to Shop?</h3>
            <a
              href="/"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Start Shopping Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;