
// Simple AI response patterns
const responsePatterns = [
  {
    pattern: /^hi|hello|hey/i,
    responses: [
      "Hello! How can I assist you today?",
      "Hi there! What can I help you with?",
      "Hey! Nice to hear from you. How can I be of service?",
      "Greetings! How may I help you today?"
    ]
  },
  {
    pattern: /how are you|how's it going/i,
    responses: [
      "I'm functioning perfectly, thank you for asking! How about you?",
      "I'm doing well, thanks! How can I assist you today?",
      "All systems operational! How are you doing?",
      "I'm great! Ready to help with whatever you need."
    ]
  },
  {
    pattern: /thank|thanks/i,
    responses: [
      "You're welcome! Feel free to ask if you need anything else.",
      "Happy to help! Is there anything else you'd like to know?",
      "Anytime! Don't hesitate to reach out if you have more questions.",
      "My pleasure! I'm here if you need further assistance."
    ]
  },
  {
    pattern: /bye|goodbye|see you/i,
    responses: [
      "Goodbye! Have a great day!",
      "See you later! Feel free to message anytime.",
      "Until next time! Take care.",
      "Bye for now! I'll be here when you need me."
    ]
  },
  {
    pattern: /weather|forecast/i,
    responses: [
      "I don't have access to real-time weather data, but I'd be happy to chat about other topics!",
      "While I can't check the weather for you, I can help with many other questions you might have.",
      "I'm unable to access current weather information. Is there something else I can assist with?",
      "Weather forecasts are beyond my capabilities, but I'm here for other types of questions!"
    ]
  },
  {
    pattern: /who are you|what are you/i,
    responses: [
      "I'm an AI assistant designed to help answer questions and provide information.",
      "I'm a virtual assistant here to chat and assist you with various topics.",
      "Think of me as your friendly neighborhood AI, ready to help with information and conversation!",
      "I'm a conversational AI created to assist users like you with information and friendly chat."
    ]
  },
  {
    pattern: /help|assist/i,
    responses: [
      "I'd be happy to help! What do you need assistance with?",
      "I'm here to assist! What questions do you have?",
      "How can I help you today? I'm ready to assist with information or just chat!",
      "Ready to help! What would you like assistance with today?"
    ]
  },
  {
    pattern: /joke|funny/i,
    responses: [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
      "I'm reading a book on anti-gravity. It's impossible to put down!"
    ]
  },
  {
    pattern: /time|what time/i,
    responses: [
      "I don't have access to the current time, but your device should show it!",
      "I can't check the time for you, but your computer or phone clock should be accurate.",
      "Time queries are beyond my current capabilities, but your device likely shows the current time.",
      "While I can't tell you the exact time, your device's clock should be able to help!"
    ]
  },
  {
    pattern: /name|your name/i,
    responses: [
      "I'm MessageSphere's AI Assistant, ready to help!",
      "You can call me AI Assistant. How can I help you today?",
      "I'm the AI Assistant for MessageSphere. What can I do for you?",
      "I go by AI Assistant here on MessageSphere. How may I assist you?"
    ]
  }
];

// Fallback responses for when no pattern matches
const fallbackResponses = [
  "That's interesting! Can you tell me more?",
  "I'm not quite sure how to respond to that. Could you elaborate?",
  "I'm still learning, but I'd be happy to chat about something else!",
  "Interesting point! What else would you like to discuss?",
  "I don't have specific information about that, but I'm happy to help with other topics.",
  "Thanks for sharing. Is there anything specific you'd like to know?",
  "I appreciate your message. How else can I assist you today?",
  "I'm afraid I don't have a specific response for that. Would you like to talk about something else?"
];

// Function to get AI response based on message content
export const getAIResponse = (message: string): string => {
  // Try to match the message with known patterns
  for (const { pattern, responses } of responsePatterns) {
    if (pattern.test(message)) {
      const randomIndex = Math.floor(Math.random() * responses.length);
      return responses[randomIndex];
    }
  }
  
  // If no pattern matches, use a fallback response
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};
