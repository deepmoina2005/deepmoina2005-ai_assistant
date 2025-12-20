import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "FATAL ERROR: GEMINI_API_KEY is not set inthe environment variables."
  );
  process.exit(1);
}

export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards from the following text.
    Format each flashcard as:
    Q: [Clear, specific question]
    A: [Concise, accurate answer]
    D: [Difficulty level: easy, medium, or hard]
    
    Separate each flashcard with "---"
    
    Text:
    ${text.substring(0, 1500)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generatedText = response.text;

    // Parse the response
    const flashcards = [];
    const cards = generatedText.split("---").filter((c) => c.trim());

    for (const card of cards) {
      const lines = card.trim().split("\n");
      let question = "",
        answer = "",
        difficulty = "medium";

      for (const line of lines) {
        if (line.startsWith("Q:")) {
          question = line.substring(2).trim();
        } else if (line.startsWith("A:")) {
          answer = line.substring(2).trim();
        } else if (line.startsWith("D:")) {
          const diff = line.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

    return flashcards.slice(0, count);
  } catch (error) {
    console.error("Gemini API Error");
    throw new Error("Failed to generate flashcards");
  }
};

export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate exactly ${numQuestions} multiple choice qestions from the following text.
    Format each question as:
    Q: [Question]
    O1: [option 1]
    O2: [option 2]
    O3: [option 3]
    O4: [option 4]
    C: [Correct option - exactly as written above]
    E: [Brief explanation]
    D: [Difficulty: easy, medium, or hard]
    
    Separate quetions with "---"
    
    Text:
    ${text.substring(0, 1500)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generatedText = response.text;

    const questions = [];
    const questionBlocks = generatedText.split("---").filter((q) => q.trim());

    for (const block of questionBlocks) {
      const lines = block.trim().split("\n");

      let question = "",
        options = [],
        correctAnswer = "",
        explanation = "",
        difficulty = "medium";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("Q:")) {
          question = trimmed.substring(2).trim();
        } else if (trimmed.match(/^O\d:/)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith("C:")) {
          correctAnswer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith("E:")) {
          explanation = trimmed.substring(2).trim();
        } else if (trimmed.startsWith("D:")) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty,
        });
      }
    }

    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error("Gemini API Error");
    throw new Error("Failed to generate quiz");
  }
};

export const generateSummary = async (text) => {
  const prompt = `Provide a concise summary of the following text, highlighting the key concepts, main ideas, and important points.
    Keep the summary clear and structured
    
    Text:
    ${text.substring(0, 20000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error("Gemini API Error");
    throw new Error("Failed to generate summary");
  }
};

export const generateArticle = async (topic, length = "medium") => {
  const prompt = `Write a clean, well-structured, SEO-friendly article on the following topic.
    Target length: ${length}.
    Use proper headings, subheadings, and paragraphs.
    Keep the content engaging and informative.
    
    Topic:
    ${topic}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generatedText = response.text;

    if (!generatedText || !generatedText.trim()) {
      throw new Error("AI returned empty article");
    }

    return generatedText.trim();
  } catch (error) {
    console.error("Gemini API Error (Article Generation):", error);
    throw new Error("Failed to generate article");
  }
};

export const explainConcept = async (text, concept) => {
  if (!text || !concept) {
    throw new Error("Both text and concept are required");
  }

  const prompt = `Explain the following concept clearly and concisely using the provided text as reference.

Concept: ${concept}

Text:
${text.substring(0, 1500)}

Instructions:
- Provide a clear, understandable explanation.
- Use simple language.
- Include examples if necessary.
- Keep it concise but informative.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const explanation = response.text;

    if (!explanation || !explanation.trim()) {
      throw new Error("AI returned empty explanation");
    }

    return explanation.trim();
  } catch (error) {
    console.error("Gemini API Error (Explain Concept):", error);
    throw new Error("Failed to generate concept explanation");
  }
};