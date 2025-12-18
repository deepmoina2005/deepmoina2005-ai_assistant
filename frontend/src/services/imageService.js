import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

// Get all articles
const getImages = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.IMAGE.GET_ALL_IMAGES);
    return response.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch articles" };
  }
};

// Get single article by ID
const getImageById = async (articleId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.IMAGE.GET_IMAGE_BY_ID(articleId));
    return response.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch article" };
  }
};

// Delete article by ID
const deleteImage = async (imageId) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.IMAGE.DELETE_IMAGE_ID(imageId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete article" };
  }
};

export default {
 getImageById,
 getImages,
 deleteImage
};