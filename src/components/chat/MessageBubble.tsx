
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { Message } from "@/data/mockData";
import { getCurrentUser } from "@/lib/auth";

interface MessageBubbleProps {
  message: Message;
  isLastInGroup: boolean;
  isAI?: boolean;
}

const MessageBubble = ({ message, isLastInGroup, isAI }: MessageBubbleProps) => {
  const currentUser = getCurrentUser();
  const isUser = message.senderId === currentUser?.id;
  
  const formattedTime = format(new Date(message.timestamp), "h:mm a");
  
  let bubbleClass = "";
  if (isUser) {
    bubbleClass = "message-bubble-user";
  } else if (isAI) {
    bubbleClass = "message-bubble-ai";
  } else {
    bubbleClass = "message-bubble-other";
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-1`}>
      <div className="max-w-[75%]">
        <div className={bubbleClass}>
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>
        
        {isLastInGroup && (
          <div className={`flex items-center mt-1 text-xs text-muted-foreground ${isUser ? "justify-end" : "justify-start"}`}>
            <span className="whitespace-nowrap">{formattedTime}</span>
            
            {isUser && (
              <span className="ml-1">
                {message.read ? (
                  <CheckCheck className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
