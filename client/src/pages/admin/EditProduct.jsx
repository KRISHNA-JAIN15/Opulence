import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getProduct, updateProduct } from "../../store/productSlice";

const EditProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentProduct, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.products);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      inStock: "",
      category: "",
      isActive: true,
      featured: false,
      discount: 0,
    },
  });

  // Fetch product data
  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
    }
    return () => {
      dispatch(reset());
    };
  }, [id, dispatch]);

  // Update form when product is loaded
  useEffect(() => {
    if (currentProduct && !isLoading) {
      reset({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        inStock: currentProduct.inStock,
        category: currentProduct.category,
        isActive: currentProduct.isActive,
        featured: currentProduct.featured || false,
        discount: currentProduct.discount || 0,
      });
      setImagePreview(currentProduct.image);
    }
  }, [currentProduct, isLoading, reset]);

  // Handle success/error states
  useEffect(() => {
    if (isError) {
      alert(message || "Failed to load product");
      navigate("/admin");
    }
    if (isSuccess && message && !currentProduct) {
      alert(message);
      navigate("/admin");
    }
  }, [isError, isSuccess, message, currentProduct, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("inStock", data.inStock);
    formData.append("category", data.category);
    formData.append("isActive", data.isActive);
    formData.append("featured", data.featured);
    formData.append("discount", data.discount);

    if (data.image) {
      formData.append("image", data.image);
    }

    dispatch(updateProduct({ id, productData: formData }))
      .unwrap()
      .then(() => {
        alert("Product updated successfully!");
        navigate("/admin");
      })
      .catch((error) => {
        alert(error || "Failed to update product");
      });
  };

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Health & Beauty",
    "Toys & Games",
    "Automotive",
    "Jewelry",
    "Other",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center text-gray-600 hover:text-black transition mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide">
          Edit Product
        </h1>
        <p className="text-gray-600 mt-2">Update the product details below.</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Product name is required",
                  minLength: {
                    value: 3,
                    message: "Product name must be at least 3 characters",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Price (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("inStock", {
                    required: "Stock quantity is required",
                    min: {
                      value: 0,
                      message: "Stock cannot be negative",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="0"
                />
                {errors.inStock && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.inStock.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Category *
              </label>
              <select
                {...register("category", {
                  required: "Please select a category",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                {...register("discount", {
                  min: {
                    value: 0,
                    message: "Discount cannot be negative",
                  },
                  max: {
                    value: 100,
                    message: "Discount cannot exceed 100%",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="0"
              />
              {errors.discount && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.discount.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Product Image
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Active Status</h3>
                  <p className="text-sm text-gray-600">
                    Make this product visible to customers
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Featured Product
                  </h3>
                  <p className="text-sm text-gray-600">
                    Show this product in featured sections
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("featured")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/admin"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
