import { getModel } from './geminiClient';

/**
 * Generates quiz questions using Gemini AI with quota-aware fallback
 * @param {Object} config - Quiz configuration
 * @returns {Promise<Array>} Array of generated questions
 */
export const generateQuizQuestions = async (config) => {
  try {
    // Try flash model first (lower quota usage)
    const model = getModel('gemini-1.5-flash');
    
    // Build the prompt based on configuration
    const prompt = buildQuizPrompt(config);
    
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const text = response?.text();
    
    // Parse the response and return structured questions
    return parseQuizResponse(text, config);
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    
    // Check if it's a quota error
    if (isQuotaError(error)) {
      console.warn('Quota exceeded, generating fallback questions');
      return generateFallbackQuestions(config);
    }
    
    throw new Error('Failed to generate quiz questions. Please check your API key and try again.');
  }
};

/**
 * Generates quiz questions with streaming for progress updates
 * @param {Object} config - Quiz configuration
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Array>} Array of generated questions
 */
export const generateQuizQuestionsWithProgress = async (config, onProgress) => {
  try {
    // Use flash model for better quota management
    const model = getModel('gemini-1.5-flash');
    const prompt = buildQuizPrompt(config);
    
    let fullResponse = '';
    let progress = 0;
    
    onProgress?.(10); // Start progress
    
    // Try streaming first
    try {
      const result = await model?.generateContentStream(prompt);
      
      for await (const chunk of result?.stream) {
        const chunkText = chunk?.text();
        if (chunkText) {
          fullResponse += chunkText;
          progress = Math.min(progress + 15, 90);
          onProgress?.(progress);
        }
      }
    } catch (streamError) {
      console.warn('Streaming failed, falling back to regular generation:', streamError);
      
      // Fallback to non-streaming if streaming fails
      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      fullResponse = response?.text();
      onProgress?.(90);
    }
    
    onProgress?.(100); // Complete
    
    return parseQuizResponse(fullResponse, config);
  } catch (error) {
    console.error('Error generating quiz questions with progress:', error);
    
    // Check if it's a quota error
    if (isQuotaError(error)) {
      console.warn('Quota exceeded, generating fallback questions');
      onProgress?.(100);
      return generateFallbackQuestions(config);
    }
    
    onProgress?.(100);
    throw new Error('Failed to generate quiz questions. Please check your API key and try again.');
  }
};

/**
 * Regenerates a single question with quota-aware handling
 * @param {Object} originalQuestion - The original question to regenerate
 * @param {Object} config - Quiz configuration
 * @returns {Promise<Object>} New generated question
 */
export const regenerateQuestion = async (originalQuestion, config) => {
  try {
    const model = getModel('gemini-1.5-flash'); // Use flash for faster regeneration
    
    const prompt = `
Generate a single ${originalQuestion?.type} question for a ${config?.difficulty} level quiz on the topic "${config?.topic}" in the subject "${config?.subject}".

Requirements:
- Different from: "${originalQuestion?.question}"
- Format: ${getQuestionFormatInstructions(originalQuestion?.type)}
- Include explanation for the correct answer

Return ONLY a JSON object with the question structure.
`;

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const text = response?.text();
    
    return parseQuestionFromResponse(text, originalQuestion?.type);
  } catch (error) {
    console.error('Error regenerating question:', error);
    
    // Return fallback question on quota error
    if (isQuotaError(error)) {
      console.warn('Quota exceeded, generating fallback question');
      return generateFallbackQuestion(originalQuestion, config);
    }
    
    throw new Error('Failed to regenerate question. Please try again.');
  }
};

/**
 * Checks if an error is related to API quota limits
 * @param {Error} error - The error to check
 * @returns {boolean} True if it's a quota error
 */
const isQuotaError = (error) => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = error?.toString()?.toLowerCase() || '';
  
  return errorMessage?.includes('quota') || 
         errorMessage?.includes('429') || 
         errorMessage?.includes('rate limit') ||
         errorString?.includes('quota') ||
         errorString?.includes('429') ||
         errorString?.includes('rate limit');
};

/**
 * Generates a fallback question when regeneration fails
 * @param {Object} originalQuestion - The original question
 * @param {Object} config - Quiz configuration
 * @returns {Object} Fallback question
 */
const generateFallbackQuestion = (originalQuestion, config) => {
  const questionTemplates = {
    'multiple-choice': {
      question: `What is an important concept related to ${config?.topic}?`,
      options: [
        { text: 'This is the correct answer', isCorrect: true },
        { text: 'This is incorrect', isCorrect: false },
        { text: 'This is also incorrect', isCorrect: false },
        { text: 'This is wrong too', isCorrect: false }
      ],
      explanation: 'Please regenerate this question for proper content about the topic.'
    },
    'true-false': {
      question: `${config?.topic} is an important subject to study.`,
      correctAnswer: 'true',
      explanation: 'Please regenerate this question for proper content about the topic.'
    },
    'short-answer': {
      question: `Explain a key concept about ${config?.topic}.`,
      sampleAnswer: 'A brief explanation of the concept',
      keywords: ['concept', 'explanation', config?.topic?.toLowerCase()],
      explanation: 'Please regenerate this question for proper content about the topic.'
    }
  };

  const template = questionTemplates?.[originalQuestion?.type] || questionTemplates?.['multiple-choice'];
  
  return {
    id: Date.now(),
    type: originalQuestion?.type,
    difficulty: config?.difficulty,
    ...template
  };
};

/**
 * Builds a comprehensive prompt for quiz generation
 * @param {Object} config - Quiz configuration
 * @returns {string} The formatted prompt
 */
const buildQuizPrompt = (config) => {
  const questionTypesText = config?.questionTypes?.map(type => {
    switch (type) {
      case 'multiple-choice':
        return 'Multiple Choice (4 options with 1 correct answer)';
      case 'true-false':
        return 'True/False';
      case 'short-answer':
        return 'Short Answer (brief text response)';
      default:
        return type;
    }
  })?.join(', ');

  return `
Generate ${config?.questionCount} quiz questions on the topic "${config?.topic}" for the subject "${config?.subject}" at ${config?.difficulty} difficulty level.

REQUIREMENTS:
- Question types: ${questionTypesText}
- Distribute questions evenly across selected types
- Each question must include an explanation for the correct answer
- Questions should be educational and test understanding of ${config?.topic}
${config?.customInstructions ? `- Additional instructions: ${config?.customInstructions}` : ''}

RESPONSE FORMAT - Return a JSON array where each question follows this structure:

For Multiple Choice questions:
{
  "id": number,
  "type": "multiple-choice",
  "difficulty": "${config?.difficulty}",
  "question": "Question text",
  "options": [
    { "text": "Option A", "isCorrect": false },
    { "text": "Option B", "isCorrect": true },
    { "text": "Option C", "isCorrect": false },
    { "text": "Option D", "isCorrect": false }
  ],
  "explanation": "Why the correct answer is correct"
}

For True/False questions:
{
  "id": number,
  "type": "true-false",
  "difficulty": "${config?.difficulty}",
  "question": "Statement to evaluate",
  "correctAnswer": "true" or "false",
  "explanation": "Explanation of the correct answer"
}

For Short Answer questions:
{
  "id": number,
  "type": "short-answer",
  "difficulty": "${config?.difficulty}",
  "question": "Question requiring brief text response",
  "sampleAnswer": "Example of a good answer",
  "keywords": ["key", "terms", "expected"],
  "explanation": "What makes a good answer"
}

Return ONLY the JSON array, no additional text or formatting.
`;
};

/**
 * Parses the AI response and returns structured question objects
 * @param {string} response - The AI response text
 * @param {Object} config - Quiz configuration for validation
 * @returns {Array} Parsed and validated questions
 */
const parseQuizResponse = (response, config) => {
  try {
    // Clean the response to extract JSON
    let cleanedResponse = response?.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse?.startsWith('```json')) {
      cleanedResponse = cleanedResponse?.replace(/```json\n?/, '')?.replace(/\n?```$/, '');
    } else if (cleanedResponse?.startsWith('```')) {
      cleanedResponse = cleanedResponse?.replace(/```\n?/, '')?.replace(/\n?```$/, '');
    }
    
    const questions = JSON.parse(cleanedResponse);
    
    // Validate and sanitize questions
    return questions?.map((q, index) => ({
      ...q,
      id: index + 1, // Ensure sequential IDs
      difficulty: config?.difficulty, // Ensure consistency
    }))?.filter(q => 
      q?.question && 
      config?.questionTypes?.includes(q?.type)
    )?.slice(0, config?.questionCount); // Limit to requested count
    
  } catch (error) {
    console.error('Error parsing quiz response:', error);
    console.log('Raw response:', response);
    
    // Fallback: return sample questions if parsing fails
    return generateFallbackQuestions(config);
  }
};

/**
 * Parses a single question from AI response
 * @param {string} response - The AI response text
 * @param {string} type - Question type
 * @returns {Object} Parsed question
 */
const parseQuestionFromResponse = (response, type) => {
  try {
    let cleanedResponse = response?.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse?.startsWith('```json')) {
      cleanedResponse = cleanedResponse?.replace(/```json\n?/, '')?.replace(/\n?```$/, '');
    } else if (cleanedResponse?.startsWith('```')) {
      cleanedResponse = cleanedResponse?.replace(/```\n?/, '')?.replace(/\n?```$/, '');
    }
    
    const question = JSON.parse(cleanedResponse);
    return { ...question, id: Date.now() };
    
  } catch (error) {
    console.error('Error parsing question response:', error);
    
    // Return a fallback question
    return {
      id: Date.now(),
      type,
      question: 'Generated question (parsing error occurred)',
      ...(type === 'multiple-choice' && {
        options: [
          { text: 'Option A', isCorrect: true },
          { text: 'Option B', isCorrect: false },
          { text: 'Option C', isCorrect: false },
          { text: 'Option D', isCorrect: false }
        ]
      }),
      ...(type === 'true-false' && {
        correctAnswer: 'true'
      }),
      ...(type === 'short-answer' && {
        sampleAnswer: 'Sample answer',
        keywords: ['key', 'terms']
      }),
      explanation: 'Explanation not available due to parsing error'
    };
  }
};

/**
 * Generates fallback questions when AI generation fails
 * @param {Object} config - Quiz configuration
 * @returns {Array} Fallback questions
 */
const generateFallbackQuestions = (config) => {
  const fallbackQuestions = [];
  const questionCount = Math.min(config?.questionCount, 10);
  
  const questionTemplates = {
    'multiple-choice': (i, topic, difficulty) => ({
      question: `Which of the following is related to ${topic}? (Question ${i + 1})`,
      options: [
        { text: `Key concept about ${topic}`, isCorrect: true },
        { text: 'Unrelated option A', isCorrect: false },
        { text: 'Unrelated option B', isCorrect: false },
        { text: 'Unrelated option C', isCorrect: false }
      ],
      explanation: `This question tests basic knowledge about ${topic}. Please regenerate for better content.`
    }),
    'true-false': (i, topic, difficulty) => ({
      question: `${topic} is an important subject in education. (Statement ${i + 1})`,
      correctAnswer: 'true',
      explanation: `This statement about ${topic} is generally true. Please regenerate for more specific content.`
    }),
    'short-answer': (i, topic, difficulty) => ({
      question: `Describe an important aspect of ${topic}. (Question ${i + 1})`,
      sampleAnswer: `An important aspect of ${topic} would include...`,
      keywords: ['important', 'aspect', topic?.toLowerCase(), 'describe'],
      explanation: `A good answer should demonstrate understanding of key concepts in ${topic}.`
    })
  };
  
  for (let i = 0; i < questionCount; i++) {
    const type = config?.questionTypes?.[i % config?.questionTypes?.length];
    const template = questionTemplates?.[type] || questionTemplates?.['multiple-choice'];
    
    fallbackQuestions?.push({
      id: i + 1,
      type,
      difficulty: config?.difficulty,
      ...template(i, config?.topic, config?.difficulty)
    });
  }
  
  return fallbackQuestions;
};

/**
 * Gets format instructions for different question types
 * @param {string} type - Question type
 * @returns {string} Format instructions
 */
const getQuestionFormatInstructions = (type) => {
  switch (type) {
    case 'multiple-choice':
      return 'JSON object with question, options array (4 items with text and isCorrect), and explanation';
    case 'true-false':
      return 'JSON object with question, correctAnswer ("true" or "false"), and explanation';
    case 'short-answer':
      return 'JSON object with question, sampleAnswer, keywords array, and explanation';
    default:
      return 'JSON object with appropriate structure';
  }
};