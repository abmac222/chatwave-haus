
import { ReactNode } from "react";

interface ChatLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

const ChatLayout = ({ sidebar, content }: ChatLayoutProps) => {
  return (
    <div className="flex min-h-screen h-full bg-background">
      <div className="w-full flex rounded-lg overflow-hidden">
        {sidebar}
        {content}
      </div>
    </div>
  );
};

export default ChatLayout;
