const { uploader } = require("../config/cloudinary");

/**
 * Uploads a file buffer to Cloudinary and returns public info.
 * @param {Buffer} buffer - The file buffer to upload.
 * @param {string} [folder="avatars"] - The Cloudinary folder to upload to.
 * @returns {Promise<{ url: string, publicId: string }>} - Public URL and Cloudinary public ID.
 */
const uploadFromBuffer = (buffer, folder = "avatars") => {
    return new Promise((resolve, reject) => {
        const uploadStream = uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    url: result.secure_url,         // public HTTPS URL
                    public_id: result.public_id,     // used to delete/update later
                });
            }
        );
        uploadStream.end(buffer);
    });
};

module.exports = uploadFromBuffer;
