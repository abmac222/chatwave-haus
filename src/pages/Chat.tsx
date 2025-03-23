
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactList from "@/components/chat/ContactList";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatLayout from "@/components/layout/ChatLayout";
import { 
  Contact, 
  Message, 
  mockContacts, 
  getConversationHistory, 
  saveConversationHistory,
  markMessagesAsRead,
  updateContactUnreadCount
} from "@/data/mockData";
import { 
  connectSocket, 
  disconnectSocket, 
  addMessageListener, 
  removeMessageListener,
  addOnlineStatusListener,
  removeOnlineStatusListener,
  sendMessage,
  simulateOnlineStatusChange
} from "@/lib/socket";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";

const Chat = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // Initialize contacts with unread counts
    const initialContacts = updateContactUnreadCount(mockContacts, currentUser.id);
    setContacts(initialContacts);
    
    // Connect to socket
    connectSocket()
      .then(() => {
        toast.success("Connected to chat server");
        
        // Start simulating online status changes
        simulateOnlineStatusChange();
      })
      .catch(() => {
        toast.error("Failed to connect to chat server");
      });
    
    // Handle incoming messages
    const handleMessage = (message: Message) => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      // Update messages if the current chat matches the message sender/receiver
      if (
        selectedContact && 
        ((message.senderId === selectedContact.id && message.receiverId === currentUser.id) ||
         (message.senderId === currentUser.id && message.receiverId === selectedContact.id))
      ) {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, message];
          saveConversationHistory(currentUser.id, selectedContact.id, updatedMessages);
          return updatedMessages;
        });
        
        // Mark message as read if it's from the selected contact
        if (message.senderId === selectedContact.id) {
          markMessagesAsRead(currentUser.id, selectedContact.id);
        }
      }
      
      // Update unread count for the contact
      setContacts(prevContacts => {
        return prevContacts.map(contact => {
          if (
            contact.id === message.senderId && 
            message.senderId !== selectedContact?.id && 
            message.receiverId === currentUser.id
          ) {
            return { ...contact, unreadCount: contact.unreadCount + 1 };
          }
          return contact;
        });
      });
    };
    
    // Handle online status changes
    const handleOnlineStatus = (contactId: string, isOnline: boolean) => {
      setContacts(prevContacts => {
        return prevContacts.map(contact => {
          if (contact.id === contactId) {
            return { 
              ...contact, 
              online: isOnline,
              lastSeen: isOnline ? "Active now" : `Last seen ${new Date().toLocaleTimeString()}`
            };
          }
          return contact;
        });
      });
    };
    
    // Add socket event listeners
    addMessageListener(handleMessage);
    addOnlineStatusListener(handleOnlineStatus);
    
    // Cleanup on component unmount
    return () => {
      disconnectSocket();
      removeMessageListener(handleMessage);
      removeOnlineStatusListener(handleOnlineStatus);
    };
  }, [navigate, selectedContact]);
  
  // Load messages when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      // Load conversation history
      const history = getConversationHistory(currentUser.id, selectedContact.id);
      setMessages(history);
      
      // Mark messages as read
      markMessagesAsRead(currentUser.id, selectedContact.id);
      
      // Update contacts with new unread counts
      setContacts(prevContacts => {
        return prevContacts.map(contact => {
          if (contact.id === selectedContact.id) {
            return { ...contact, unreadCount: 0 };
          }
          return contact;
        });
      });
      
      // Show chat window on mobile
      if (isMobile) {
        setShowChat(true);
      }
    }
  }, [selectedContact, isMobile]);
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };
  
  const handleSendMessage = (content: string, isAIResponse = false) => {
    if (!selectedContact) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser && !isAIResponse) return;
    
    // Send message through socket
    const message = sendMessage(selectedContact.id, content, isAIResponse);
    if (!message) return;
    
    // Update local state
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, message];
      saveConversationHistory(currentUser!.id, selectedContact.id, updatedMessages);
      return updatedMessages;
    });
  };
  
  const handleBackToContacts = () => {
    setShowChat(false);
  };
  
  // Mobile layout (conditional rendering)
  if (isMobile) {
    return (
      <div className="flex min-h-screen h-full bg-background animate-fade-in">
        {!showChat ? (
          <div className="w-full">
            <ContactList
              contacts={contacts}
              selectedContact={selectedContact}
              onSelectContact={handleSelectContact}
            />
          </div>
        ) : (
          <div className="w-full animate-slide-in-right">
            {selectedContact && (
              <ChatWindow
                selectedContact={selectedContact}
                messages={messages}
                onSendMessage={handleSendMessage}
                onBackToContacts={handleBackToContacts}
              />
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Desktop layout
  return (
    <ChatLayout
      sidebar={
        <div className="w-80 flex-shrink-0">
          <ContactList
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
          />
        </div>
      }
      content={
        <div className="flex-1">
          {selectedContact ? (
            <ChatWindow
              selectedContact={selectedContact}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3 p-8 max-w-md animate-fade-in">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                </div>
                <h3 className="text-xl font-semibold">Welcome to MessageSphere</h3>
                <p className="text-muted-foreground">
                  Select a contact from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

export default Chat;
