import React, { useEffect, useState } from "react";
import {
  ArrowBack,
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Star,
  StarHalf,
  StarBorder,
  Share,
  Remove,
  Add,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { getData, postData } from "../../../../axios/axios";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample product data
  const [product, setProduct] = useState({
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    category: "electronics",
    rating: 4.5,
    reviews: 128,
    description:
      "Experience crystal-clear sound with our premium wireless headphones. Featuring noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Built-in microphone",
      "Foldable design",
    ],
    colors: ["Black", "White", "Blue"],
    images: [
      "https://via.placeholder.com/600x600?text=Headphones+Front",
      "https://via.placeholder.com/600x600?text=Headphones+Side",
      "https://via.placeholder.com/600x600?text=Headphones+Back",
      "https://via.placeholder.com/600x600?text=Headphones+Case",
    ],
  });

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);
  let { id } = useParams();
  let getProduct = async () => {
    let response = await getData("ecommerce_products/" + id, null, "customer");
    setProduct(response.data);
    console.log(response.data);
    setRelatedProducts(response.data.relatedProducts);
    setSelectedImage(response.data.images[0].image_url);
    if (response.status !== 200) {
      toast.error("Somethings went wrong");
    }
  };

  let toggleLike = async () => {
    setIsFavorite(!isFavorite);
    let formData = new FormData();
    formData.append("product_id", id);
    let response = await postData(
      "ecommerce_products/" + id + "/like",
      formData,
      "customer"
    );
    if (response.status == 200) {
      toast.success("This product is added to the favorite list");
    }
  };
  useEffect(() => {
    getProduct();
  }, [isFavorite]);

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<StarBorder key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
      >
        <ArrowBack className="mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="rounded-lg overflow-hidden mb-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image.image_url)}
                className={`rounded-md overflow-hidden ${
                  selectedImage === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img
                  src={image.image_url}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-2">{renderRatingStars(product.rating)}</div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">
              ${product.price}
            </span>
            <span className="text-gray-500 line-through ml-2">$109.99</span>
            <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
              18% OFF
            </span>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Color Selection */}
          {/* <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Color</h3>
            <div className="flex space-x-3">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full border-2 ${
                    index === 0 ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div> */}

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="p-2 rounded-md border border-gray-300"
              >
                <Remove className="h-5 w-5" />
              </button>
              <span className="px-4 py-2 border-t border-b border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange("increment")}
                className="p-2 rounded-md border border-gray-300"
              >
                <Add className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
              <AddShoppingCart className="mr-2" />
              Add to Cart
            </button>
            <button
              onClick={() => toggleLike()}
              className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              {isFavorite ? (
                <Favorite className="text-red-500" />
              ) : (
                <FavoriteBorder />
              )}
            </button>
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <Share />
            </button>
          </div>

          {/* Features */}
          {/* <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Features</h3>
            <ul className="list-disc list-inside space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          You might also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => {
            const firstImageUrl =
              p.images && p.images.length > 0
                ? p.images[0].image_url
                : "https://via.placeholder.com/600x600?text=No+Image";

            return (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={firstImageUrl}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      ${p.price}
                    </span>
                    <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
                      <AddShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
