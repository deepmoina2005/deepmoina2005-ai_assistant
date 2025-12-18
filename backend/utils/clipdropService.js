import "dotenv/config"
import axios from "axios";
import FormData from "form-data";

if (!process.env.CLIPDROP_API_KEY) {
  console.error("FATAL ERROR: CLIPDROP_API_KEY is missing.");
  process.exit(1);
}

const CLIPDROP_KEY = process.env.CLIPDROP_API_KEY;

const toBase64 = (buffer) => Buffer.from(buffer, "binary").toString("base64");

export const generateImage = async (prompt) => {
  try {
    const formData = new FormData();       // ✅ FIXED (uses form-data)
    formData.append("prompt", prompt);

    const res = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": CLIPDROP_KEY,
          ...formData.getHeaders(),        // ✅ NOW WORKS
        },
        responseType: "arraybuffer",
      }
    );

    return toBase64(res.data);
  } catch (err) {
    console.error("Image Generation Error:", err.response?.data || err);
    throw new Error("Image generation failed");
  }
};

export const removeBackground = async (imageBase64) => {
  if (!CLIPDROP_KEY) throw new Error("ClipDrop API key missing");

  try {
    let base64Data = imageBase64;

    // Strip data URL prefix if present
    if (base64Data.startsWith("data:")) {
      base64Data = base64Data.split(",")[1];
    }

    if (typeof base64Data !== "string") {
      throw new Error("Invalid imageBase64 format");
    }

    const formData = new FormData();
    formData.append("image_file", Buffer.from(base64Data, "base64"), {
      filename: "image.png",
      contentType: "image/png",
    });

    const res = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          "x-api-key": CLIPDROP_KEY,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    return toBase64(res.data);
  } catch (err) {
    console.error("Remove Background Error:", err.response?.data || err);
    throw new Error("Background removal failed");
  }
};

export const removeObject = async (imageBase64, maskBase64) => {
  try {
    const formData = new FormData();
    formData.append("image_file", Buffer.from(imageBase64, "base64"), {
      filename: "image.png",
      contentType: "image/png",
    });
    formData.append("mask_file", Buffer.from(maskBase64, "base64"), {
      filename: "mask.png",
      contentType: "image/png",
    });

    const res = await axios.post(
      "https://clipdrop-api.co/remove-object/v1",
      formData,
      {
        headers: {
          "x-api-key": CLIPDROP_KEY,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    return toBase64(res.data);
  } catch (err) {
    console.error("Remove Object Error:", err.response?.data || err);
    throw new Error("Object removal failed");
  }
};