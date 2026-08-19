const cloudinary = require("cloudinary").v2;

module.exports = class UploadController {
  static async uploadImage(req, res, next) {
    try {
      // Check if Cloudinary is configured
      if (
        !process.env.CLOUDINARY_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        console.log("Cloudinary not configured");
        return res.status(500).json({
          message: "Internal server error",
        });
      }

      // Configure cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      if (!req.file) throw { name: "BadRequest", message: "Image is required" };

      const base64File = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64File}`;

      const result = await cloudinary.uploader.upload(dataURI);
      res.json({ imgUrl: result.secure_url });
    } catch (error) {
      next(error);
    }
  }
};
