const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage (we'll upload to Cloudinary directly)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise} - Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, folder = "opulence/products") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String} - Public ID
 */
const extractPublicId = (url) => {
  if (!url) return null;

  // Extract public ID from URL
  // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");

  if (uploadIndex === -1) return null;

  // Get everything after 'upload/v123456789/'
  const pathParts = parts.slice(uploadIndex + 2);
  const publicIdWithExtension = pathParts.join("/");

  // Remove file extension
  const publicId = publicIdWithExtension.substring(
    0,
    publicIdWithExtension.lastIndexOf(".")
  );

  return publicId;
};

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
};
