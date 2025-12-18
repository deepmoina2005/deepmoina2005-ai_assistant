import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

// Get all articles
const getArticles = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.ARTICLE.GET_ALL_ARTICLES);
    return response.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch articles" };
  }
};

// Get single article by ID
const getArticleById = async (articleId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.ARTICLE.GET_ARTICLE_BY_ID(articleId));
    return response.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch article" };
  }
};

// Delete article by ID
const deleteArticle = async (articleId) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.ARTICLE.DELETE_ARTICLE_ID(articleId));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete article" };
  }
};

export default {
  getArticles,
  getArticleById,
  deleteArticle
};