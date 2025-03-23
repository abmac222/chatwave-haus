
export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
  lastSeen: string;
  unreadCount: number;
  isAI?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Mock contacts data
export const mockContacts: Contact[] = [
  {
    id: "ai",
    name: "AI Assistant",
    email: "ai@messagesphere.com",
    avatar: "https://ui-avatars.com/api/?name=AI&background=6366F1&color=fff",
    online: true,
    lastSeen: "Active now",
    unreadCount: 0,
    isAI: true
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=0D8ABC&color=fff",
    online: true,
    lastSeen: "Active now",
    unreadCount: 3
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    avatar: "https://ui-avatars.com/api/?name=Robert+Johnson&background=26A69A&color=fff",
    online: false,
    lastSeen: "Last seen 2 hours ago",
    unreadCount: 0
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=EF5350&color=fff",
    online: false,
    lastSeen: "Last seen yesterday",
    unreadCount: 0
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=FF9800&color=fff",
    online: true,
    lastSeen: "Active now",
    unreadCount: 0
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=9C27B0&color=fff",
    online: false,
    lastSeen: "Last seen 3 days ago",
    unreadCount: 0
  }
];

// Load or initialize conversation history from localStorage
export const getConversationHistory = (userId: string, contactId: string): Message[] => {
  const key = `conversation-${userId}-${contactId}`;
  const storedData = localStorage.getItem(key);
  
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  // Return initial messages if no history exists
  if (contactId === "ai") {
    // Initial conversation with AI
    return [
      {
        id: "ai-msg-1",
        senderId: "ai",
        receiverId: userId,
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        read: true
      }
    ];
  } else if (contactId === "2") {
    // Initial conversation with Jane
    return [
      {
        id: "jane-msg-1",
        senderId: "2",
        receiverId: userId,
        content: "Hi there! Have you checked out the new project requirements?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false
      },
      {
        id: "jane-msg-2",
        senderId: "2",
        receiverId: userId,
        content: "I think we need to discuss the timeline.",
        timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(), // 29 minutes ago
        read: false
      },
      {
        id: "jane-msg-3",
        senderId: "2",
        receiverId: userId,
        content: "Let me know when you're free to chat!",
        timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(), // 28 minutes ago
        read: false
      }
    ];
  }
  
  return [];
};

// Save conversation history to localStorage
export const saveConversationHistory = (
  userId: string,
  contactId: string,
  messages: Message[]
): void => {
  const key = `conversation-${userId}-${contactId}`;
  localStorage.setItem(key, JSON.stringify(messages));
};

// Mark messages as read
export const markMessagesAsRead = (
  userId: string,
  contactId: string
): void => {
  const messages = getConversationHistory(userId, contactId);
  const updatedMessages = messages.map(msg => {
    if (msg.senderId === contactId && !msg.read) {
      return { ...msg, read: true };
    }
    return msg;
  });
  
  saveConversationHistory(userId, contactId, updatedMessages);
};

// Get unread count for a contact
export const getUnreadCount = (
  userId: string,
  contactId: string
): number => {
  const messages = getConversationHistory(userId, contactId);
  return messages.filter(msg => msg.senderId === contactId && !msg.read).length;
};

// Update contact's unread count
export const updateContactUnreadCount = (
  contacts: Contact[],
  userId: string
): Contact[] => {
  return contacts.map(contact => ({
    ...contact,
    unreadCount: getUnreadCount(userId, contact.id)
  }));
};
