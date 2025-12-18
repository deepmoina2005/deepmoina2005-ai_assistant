import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

// If GET_QUIZZES_FOR_DOC is a string template with `:documentId`, use replace:
const getQuizzesForDocument = async (documentId) => {
  try {
    const url =
      typeof API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC === "function"
        ? API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId)
        : `${API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC}/${documentId}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch quizzes" };
  }
};

const getQuizById = async (quizId) => {
  try {
    const url =
      typeof API_PATHS.QUIZZES.GET_QUIZ_BY_ID === "function"
        ? API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId)
        : `${API_PATHS.QUIZZES.GET_QUIZ_BY_ID}/${quizId}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch quiz" };
  }
};

const submitQuiz = async (quizId, answers) => {
  try {
    const url =
      typeof API_PATHS.QUIZZES.SUBMIT_QUIZ === "function"
        ? API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId)
        : `${API_PATHS.QUIZZES.SUBMIT_QUIZ}/${quizId}`;

    const response = await axiosInstance.post(url, { answers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to submit quiz" };
  }
};

const deleteQuiz = async (quizId) => {
  try {
    const url =
      typeof API_PATHS.QUIZZES.DELETE_QUIZ === "function"
        ? API_PATHS.QUIZZES.DELETE_QUIZ(quizId)
        : `${API_PATHS.QUIZZES.DELETE_QUIZ}/${quizId}`;

    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete quiz" };
  }
};

// Get quiz results
const getQuizResults = async (quizId) => {
  try {
    const url =
      typeof API_PATHS.QUIZZES.GET_QUIZ_RESULTS === "function"
        ? API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId)
        : `${API_PATHS.QUIZZES.GET_QUIZ_RESULTS}/${quizId}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch quiz results" };
  }
};


const quizService= {
  getQuizzesForDocument,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz,
};

export default quizService