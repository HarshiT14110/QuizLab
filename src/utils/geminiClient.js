import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initializes the Gemini client with the API key from environment variables.
 * @returns {GoogleGenerativeAI} Configured Gemini client instance.
 */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Get a generative model instance
 * @param {string} modelName - The model to use (default: gemini-1.5-flash)
 * @returns {GenerativeModel} The generative model instance
 */
export const getModel = (modelName = 'gemini-1.5-flash') => {
  return genAI?.getGenerativeModel({ model: modelName });
};

export default genAI;