
import { toast } from "sonner";
import { Contact, Message } from "@/data/mockData";
import { getCurrentUser } from "@/lib/auth";

// Define listener types
type MessageListener = (message: Message) => void;
type TypingListener = (contactId: string, isTyping: boolean) => void;
type OnlineStatusListener = (contactId: string, isOnline: boolean) => void;

// Socket event listeners
const messageListeners: MessageListener[] = [];
const typingListeners: TypingListener[] = [];
const onlineStatusListeners: OnlineStatusListener[] = [];

// Mock socket connection status
let isConnected = false;

// Connect to socket
export const connectSocket = (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate connection delay
    setTimeout(() => {
      isConnected = true;
      console.log("Socket connected");
      resolve();
    }, 1000);
  });
};

// Disconnect from socket
export const disconnectSocket = (): void => {
  isConnected = false;
  console.log("Socket disconnected");
};

// Check if socket is connected
export const isSocketConnected = (): boolean => {
  return isConnected;
};

// Add message listener
export const addMessageListener = (listener: MessageListener): void => {
  messageListeners.push(listener);
};

// Remove message listener
export const removeMessageListener = (listener: MessageListener): void => {
  const index = messageListeners.indexOf(listener);
  if (index !== -1) {
    messageListeners.splice(index, 1);
  }
};

// Add typing listener
export const addTypingListener = (listener: TypingListener): void => {
  typingListeners.push(listener);
};

// Remove typing listener
export const removeTypingListener = (listener: TypingListener): void => {
  const index = typingListeners.indexOf(listener);
  if (index !== -1) {
    typingListeners.splice(index, 1);
  }
};

// Add online status listener
export const addOnlineStatusListener = (listener: OnlineStatusListener): void => {
  onlineStatusListeners.push(listener);
};

// Remove online status listener
export const removeOnlineStatusListener = (listener: OnlineStatusListener): void => {
  const index = onlineStatusListeners.indexOf(listener);
  if (index !== -1) {
    onlineStatusListeners.splice(index, 1);
  }
};

// Send a message
export const sendMessage = (
  receiverId: string,
  content: string,
  isAIResponse = false
): Message | null => {
  if (!isConnected && !isAIResponse) {
    toast.error("Not connected to the server");
    return null;
  }
  
  const currentUser = getCurrentUser();
  if (!currentUser && !isAIResponse) {
    toast.error("User not authenticated");
    return null;
  }
  
  const message: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    senderId: isAIResponse ? receiverId : currentUser!.id,
    receiverId: isAIResponse ? currentUser!.id : receiverId,
    content,
    timestamp: new Date().toISOString(),
    read: isAIResponse // AI messages are automatically marked as read
  };
  
  // Notify listeners of the new message
  messageListeners.forEach(listener => listener(message));
  
  return message;
};

// Send typing indicator
export const sendTypingIndicator = (receiverId: string, isTyping: boolean): void => {
  if (!isConnected) {
    return;
  }
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return;
  }
  
  // Notify listeners of typing status
  typingListeners.forEach(listener => listener(currentUser.id, isTyping));
};

// Simulate receiving a message (for demo purposes)
export const simulateMessageFromContact = (contact: Contact, content: string): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return;
  }
  
  const message: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    senderId: contact.id,
    receiverId: currentUser.id,
    content,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  // Simulate typing indicator first
  typingListeners.forEach(listener => listener(contact.id, true));
  
  // Then send the message after a delay
  setTimeout(() => {
    // Stop typing indicator
    typingListeners.forEach(listener => listener(contact.id, false));
    
    // Send the message
    messageListeners.forEach(listener => listener(message));
  }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
};

// Simulate online status changes (for demo purposes)
export const simulateOnlineStatusChange = (): void => {
  const contacts = ["2", "3", "4", "5", "6"]; // Contact IDs
  
  // Randomly change online status of a contact every 30-60 seconds
  setInterval(() => {
    const randomContactIndex = Math.floor(Math.random() * contacts.length);
    const contactId = contacts[randomContactIndex];
    const isOnline = Math.random() > 0.5;
    
    onlineStatusListeners.forEach(listener => listener(contactId, isOnline));
  }, 30000 + Math.random() * 30000);
};
