function extractPublicIdFromUrl(url) {
  const parts = url.split("/");
  const fileNameWithExt = parts.pop(); // e.g., xyz.jpg
  const publicId = fileNameWithExt.split(".")[0]; // xyz
  const folder = parts[parts.length - 1]; // e.g., 'products'
  return `${folder}/${publicId}`;
}
module.exports = extractPublicIdFromUrl;
