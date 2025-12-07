import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      costPrice: "",
      returnDays: 0,
      inStock: "",
      category: "",
      brand: "",
      sku: "",
      weight: "",
      dimensions: "",
      material: "",
      color: "",
      warranty: "",
      origin: "",
      tags: "",
      keyFeatures: "",
      isActive: true,
      featured: false,
      discount: 0,
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach((file) => {
        if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImages((prev) => [
              ...prev,
              { file, preview: reader.result, id: Date.now() + Math.random() },
            ]);
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please select valid image files under 5MB");
        }
      });
      setValue("images", [...images, ...files]);
    }
  };

  const removeImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setValue(
      "images",
      images.filter((img) => img.id !== imageId).map((img) => img.file)
    );
  };

  const onSubmit = async (data) => {
    // Check if images are uploaded
    if (images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("costPrice", data.costPrice || 0);
      formData.append("returnDays", data.returnDays || 0);
      formData.append("inStock", data.inStock);
      formData.append("category", data.category);
      formData.append("brand", data.brand || "");
      formData.append("sku", data.sku || "");
      formData.append("weight", data.weight || "");
      formData.append("dimensions", data.dimensions || "");
      formData.append("material", data.material || "");
      formData.append("color", data.color || "");
      formData.append("warranty", data.warranty || "");
      formData.append("origin", data.origin || "");
      formData.append("tags", data.tags || "");
      formData.append("keyFeatures", data.keyFeatures || "");
      formData.append("isActive", data.isActive);
      formData.append("featured", data.featured);
      formData.append("discount", data.discount);

      if (images.length > 0) {
        images.forEach((img, index) => {
          formData.append("images", img.file);
        });
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Product added successfully!");
        navigate("/admin");
      } else {
        alert(result.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          Add New Product
        </h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to add a new product to your store.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 - Basic Info */}
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
                <span className="text-gray-500 text-sm font-normal ml-2">
                  ({watch("description")?.length || 0}/1000)
                </span>
              </label>
              <textarea
                rows={4}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Description cannot exceed 1000 characters",
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

            {/* Price and Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Selling Price (₹) *
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
                  Cost Price (₹)
                  <span className="text-gray-500 text-xs font-normal ml-1">
                    (Purchase price)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("costPrice", {
                    min: {
                      value: 0,
                      message: "Cost price cannot be negative",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="0.00"
                />
                {errors.costPrice && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.costPrice.message}
                  </p>
                )}
              </div>
            </div>

            {/* Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  {...register("discount", {
                    valueAsNumber: true,
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

            {/* Stock and Category */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Key Features */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Key Features
                <span className="text-gray-500 text-sm font-normal ml-2">
                  (one per line)
                </span>
              </label>
              <textarea
                rows={4}
                {...register("keyFeatures")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="Premium quality materials&#10;Durable construction&#10;Easy maintenance"
              />
            </div>
          </div>

          {/* Column 2 - Product Details */}
          <div className="space-y-6">
            {/* Brand and SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  {...register("brand")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  {...register("sku")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="Enter SKU"
                />
              </div>
            </div>

            {/* Weight and Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  {...register("weight")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="e.g., 1.2 kg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  {...register("dimensions")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="e.g., 25 x 15 x 10 cm"
                />
              </div>
            </div>

            {/* Material and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  {...register("material")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="e.g., Premium Grade"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  {...register("color")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="e.g., Multiple Options"
                />
              </div>
            </div>

            {/* Warranty and Origin */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Warranty
                </label>
                <input
                  type="text"
                  {...register("warranty")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="e.g., 2 Years"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  {...register("origin")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="e.g., Made in Europe"
                />
              </div>
            </div>

            {/* Return Policy */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Return Window (Days)
                <span className="text-gray-500 text-sm font-normal ml-2">
                  (0 = Non-returnable)
                </span>
              </label>
              <input
                type="number"
                {...register("returnDays", { min: 0, max: 365 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="e.g., 7 for 7-day return policy"
                min="0"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the number of days customers can return this product after
                delivery. Enter 0 if product is non-returnable.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Tags
                <span className="text-gray-500 text-sm font-normal ml-2">
                  (comma-separated)
                </span>
              </label>
              <input
                type="text"
                {...register("tags")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="e.g., premium, durable, comfortable"
              />
            </div>
          </div>

          {/* Column 3 - Images & Settings */}
          <div className="space-y-6">
            {/* Multiple Images Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Product Images *
                <span className="text-gray-500 text-sm font-normal ml-2">
                  ({images.length} images)
                </span>
              </label>

              {/* Upload Area */}
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition mb-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 5MB each (Max 5 images)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={images.length >= 5}
                />
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, index) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <X size={14} />
                      </button>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
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
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
