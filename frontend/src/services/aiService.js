import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

const generateFlashcards = async (documentId, options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
            documentId,
            ...options
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate flashcard'}
    }
}

const generateQuiz = async (documentId, options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
            documentId,
            ...options
        });

        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate Quiz'}
    }
}

const generateSummary = async (documentId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
            documentId
        });

        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate Summary'}
    }
}

const chat = async (documentId, message) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
            documentId,
            question: message
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Chat request failed'}
    }
}

const explainConcept = async (documentId, concept) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
            documentId,
            concept
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to explain concept'}
    }
}

const getChatHistory = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY, {
            documentId
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch chat history'}
    }
}

const generateArticle = async (topic, length = "medium") => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_ARTICLE, {
            topic,
            length
        });

        return response.data?.data; // { topic, article }
    } catch (error) {
        throw error.response?.data || { message: "Failed to generate Article" };
    }
};

const generateImage = async (prompt, publish = false) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_IMAGE, {
            prompt,
            publish
        });

        return response.data?.data; // { prompt, image }
    } catch (error) {
        throw error.response?.data || { message: "Failed to generate Image" };
    }
};

const removeBackground = async (imageBase64) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.REMOVE_BACKGROUND, {
            imageBase64
        });

        return response.data?.data; // { image: base64 or url }
    } catch (error) {
        throw error.response?.data || { message: "Failed to remove background" };
    }
};

const removeObject = async (imageBase64, maskBase64) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.REMOVE_BACKGROUND, {
            imageBase64,
            maskBase64
        });

        return response.data?.data; // { image: base64 or url }
    } catch (error) {
        throw error.response?.data || { message: "Failed to remove object" };
    }
};

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
    generateArticle,
    generateImage,
    removeBackground,
    removeObject    
};

export default aiService;