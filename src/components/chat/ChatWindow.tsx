import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Contact, Message } from "@/data/mockData";
import MessageBubble from "./MessageBubble";
import { getCurrentUser } from "@/lib/auth";
import { getAIResponse } from "@/data/aiResponses";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatWindowProps {
  selectedContact: Contact;
  messages: Message[];
  onSendMessage: (message: string, isAIResponse?: boolean) => void;
  onBackToContacts?: () => void;
}

const ChatWindow = ({
  selectedContact,
  messages,
  onSendMessage,
  onBackToContacts
}: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUser = getCurrentUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      
      // If AI, simulate typing indicator then response
      if (selectedContact.isAI) {
        setIsTyping(true);
        
        // Simulate AI typing delay (1-3 seconds)
        const typingDelay = 1000 + Math.random() * 2000;
        
        setTimeout(() => {
          setIsTyping(false);
          
          // Get AI response
          const aiResponse = getAIResponse(newMessage.trim());
          
          // Add AI response
          onSendMessage(aiResponse, true);
        }, typingDelay);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Auto adjust height
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  // Group messages by sender (for read receipts and timestamps)
  const groupedMessages = messages.reduce((acc, message, index) => {
    const lastGroup = acc[acc.length - 1];
    
    if (
      lastGroup &&
      lastGroup[0].senderId === message.senderId &&
      // Group messages only if they are within 5 minutes of each other
      Math.abs(
        new Date(message.timestamp).getTime() -
        new Date(lastGroup[lastGroup.length - 1].timestamp).getTime()
      ) < 5 * 60 * 1000
    ) {
      lastGroup.push(message);
    } else {
      acc.push([message]);
    }
    
    return acc;
  }, [] as Message[][]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        {isMobile && onBackToContacts && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onBackToContacts}
            aria-label="Back to contacts"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={selectedContact.avatar}
                alt={selectedContact.name}
                className="h-full w-full object-cover"
              />
            </div>
            {selectedContact.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></span>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-medium">{selectedContact.name}</span>
            <span className="text-xs text-muted-foreground">
              {selectedContact.online ? "Active now" : selectedContact.lastSeen}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar fade-mask">
        <div className="space-y-3">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {group.map((message, messageIndex) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLastInGroup={messageIndex === group.length - 1}
                  isAI={selectedContact.isAI}
                />
              ))}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-muted/70 rounded-full flex items-center justify-center px-2">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse-subtle" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse-subtle" style={{ animationDelay: "300ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse-subtle" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {selectedContact.name} is typing...
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedContact.name}...`}
            className="resize-none min-h-[40px] max-h-[120px]"
            rows={1}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
