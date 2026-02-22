
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ChatMessage, Topic, QuizQuestion, ChemistrySection, QuizDifficulty } from "../types";

const getClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_API_KEY. Please add it to your .env file.");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Schemas ---

const organizedContentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Major Chemistry Topic (e.g., Organic Chemistry)" },
          subtopics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Specific Subtopic (e.g., Alkanes)" },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
                    },
                    required: ["text", "difficulty"]
                  }
                }
              },
              required: ["name", "questions"]
            }
          }
        },
        required: ["name", "subtopics"]
      }
    }
  }
};

const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      questionText: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of exactly 4 possible answers."
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: "The zero-based index of the correct answer in the options array."
      },
      explanation: { type: Type.STRING, description: "Detailed explanation of why the answer is correct." },
      hint: { type: Type.STRING, description: "A helpful hint that doesn't give away the answer directly." },
      difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"], description: "The difficulty level of this specific question." },
      topic: { type: Type.STRING, description: "The specific chemistry sub-topic this question tests (e.g. 'Stoichiometry' or 'Alkenes')." }
    },
    required: ["questionText", "options", "correctAnswerIndex", "explanation", "hint", "difficulty", "topic"]
  }
};

// --- API Calls ---

export const categorizeQuestions = async (input: string, imageBase64?: string): Promise<Topic[]> => {
  try {
    const ai = getClient();
    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64
        }
      });
      parts.push({ text: "Extract questions from this image and categorize them into Chemistry topics and subtopics." });
    } else {
      parts.push({ text: `Analyze the following raw text containing chemistry questions. Categorize them logically into topics and subtopics.\n\nRaw Text:\n${input}` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: organizedContentSchema,
        systemInstruction: "You are an expert Chemistry professor. Organize the questions hierarchically. Assign a difficulty level to each.",
      },
    });

    const data = JSON.parse(response.text || "{}");
    return data.topics || [];
  } catch (error) {
    console.error("Categorization failed:", error);
    throw new Error("Failed to categorize questions.");
  }
};

export const generateQuizFromTopics = async (topics: Topic[]): Promise<QuizQuestion[]> => {
  try {
    const ai = getClient();
    // Flatten a sample of questions to send as context
    const questionsContext = topics.map(t =>
      t.subtopics.map(s => s.questions.map(q => q.text).join("; ")).join("; ")
    ).join("\n").substring(0, 15000);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following chemistry questions/topics provided by the user, generate a 5-question multiple-choice quiz. 
      
      Format Requirements:
      1. 4 options per question.
      2. 1 correct answer.
      3. A helpful hint.
      4. A detailed explanation.
      5. Tag each question with its specific Topic and Difficulty (Easy/Medium/Hard).
      
      Context Questions:\n${questionsContext}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const data = JSON.parse(response.text || "[]");
    return data;
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw new Error("Failed to generate quiz.");
  }
};

export const generateJEEQuiz = async (
  sections: ChemistrySection[],
  difficulty: QuizDifficulty,
  count: number,
  specificTopics: string[] = []
): Promise<QuizQuestion[]> => {
  try {
    const ai = getClient();
    const sectionStr = sections.join(", ");
    const topicStr = specificTopics.length > 0 ? `\n    Prioritize questions from these specific topics: ${specificTopics.join(", ")}.` : "";

    const prompt = `Generate a ${difficulty} level Chemistry quiz containing exactly ${count} questions.
    
    Focus ONLY on these branches of chemistry: ${sectionStr}.${topicStr}
    
    Difficulty Context:
    - If JEE Main: Questions should be conceptual, formula-based, and moderate difficulty.
    - If JEE Advanced: Questions should be multi-concept, deep, and high difficulty requiring critical thinking.
    
    Format Requirements:
    1. 4 options per question.
    2. 1 correct answer.
    3. A strategic hint.
    4. A rigorous, scientific explanation.
    5. Tag each question with its specific sub-topic and difficulty (Easy/Medium/Hard).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const data = JSON.parse(response.text || "[]");
    return data;
  } catch (error) {
    console.error("JEE Quiz generation failed:", error);
    throw new Error("Failed to generate JEE quiz.");
  }
}

export const generateAnimatedSVG = async (topic: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create an educational, simplified SVG diagram for the chemistry concept: '${topic}'. 
      
      Requirements:
      1. Use internal CSS animations (<style>) or SMIL (<animate>) to make the diagram dynamic (e.g., electrons orbiting, molecules vibrating, reaction bubbling).
      2. Use a transparent background.
      3. Ensure colors are scientific and high contrast (whites, cyans, blues, oranges).
      4. Return ONLY the raw SVG code. Do not wrap in markdown code blocks.`,
      config: {
        responseMimeType: "text/plain",
      },
    });

    let text = response.text || "";
    // Clean up if the model accidentally returns markdown
    text = text.replace(/```svg/g, '').replace(/```/g, '').trim();
    return text;
  } catch (error) {
    console.error("SVG generation failed:", error);
    throw new Error("Failed to generate animated diagram.");
  }
};

export const generateRoast = async (
  questionText: string,
  correctAnswer: string,
  wrongAnswer: string,
  topic: string
): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `You are a sassy chemistry teacher with a great sense of humor. A student just got a question wrong.

Question: ${questionText}
Correct Answer: ${correctAnswer}
Student's Wrong Answer: ${wrongAnswer}
Topic: ${topic}

Generate a SHORT, FUNNY, SASSY roast (1-2 sentences max) that:
1. Is playful and humorous, not mean-spirited
2. References chemistry concepts, elements, or reactions
3. Makes the student laugh while learning
4. Is Gen-Z friendly with a bit of attitude

Examples of the style:
- "You just violated the Octet rule. Carbon is crying right now. 😭"
- "That answer had less stability than a free radical in a thunderstorm. ⚡"
- "Even noble gases are more reactive than your answer was correct. 💀"
- "Your answer just broke more bonds than a divorce attorney. 💔"
- "That's not how equilibrium works, bestie. Le Chatelier is rolling in his grave. 🪦"

Generate ONE roast now (keep it short and punchy):`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "text/plain",
        temperature: 1.2, // Higher temperature for more creative/funny responses
      },
    });

    return response.text?.trim() || "Oops! Even my roast generator couldn't handle that answer. 💀";
  } catch (error) {
    console.error("Roast generation failed:", error);
    // Return a fallback roast if API fails
    return "That answer was more unstable than a carbocation in water. Try again! 💧";
  }
};

export const generateChatReply = async (messages: ChatMessage[], userMessage: string): Promise<string> => {
  try {
    const ai = getClient();
    const recent = messages.slice(-10).map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join("\n");
    const prompt = `You are a helpful chemistry tutor assisting a student. Keep responses concise, step-by-step, and encouraging.

Conversation so far:
${recent}

Student: ${userMessage}
Tutor:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "text/plain",
      },
    });

    return response.text?.trim() || "Sorry, I couldn't generate a reply.";
  } catch (error) {
    console.error("Chat generation failed:", error);
    throw new Error("Failed to generate chat reply.");
  }
};
