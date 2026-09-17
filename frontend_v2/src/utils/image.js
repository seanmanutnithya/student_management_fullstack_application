// Full-resolution photos base64-encode to several MB, which blows the ~5MB
// localStorage quota after one or two uploads. Avatars are never shown larger
// than a small circle, so downscale before they ever reach state or storage.
const MAX_DIMENSION = 320;
const JPEG_QUALITY = 0.8;

export function fileToThumbnailDataUrl(
  file,
  { maxDimension = MAX_DIMENSION, quality = JPEG_QUALITY } = {},
) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Not an image file"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));

      const ctx = canvas.getContext("2d");
      // JPEG has no alpha channel; without this a transparent PNG turns black.
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not decode image"));
    };

    img.src = objectUrl;
  });
}
