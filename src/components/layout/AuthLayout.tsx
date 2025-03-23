
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  alternateText: string;
  alternateLink: string;
  alternateLinkText: string;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  alternateText,
  alternateLink,
  alternateLinkText,
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex flex-1 bg-primary/5 items-center justify-center p-10">
        <div className="max-w-md animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary"></div>
              <h1 className="text-2xl font-bold">MessageSphere</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Connect with friends and AI assistants in a beautifully designed messaging experience.
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="glass-panel rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="text-lg font-medium">Real-time Chat</div>
              <p className="text-sm text-muted-foreground">
                Connect instantly with friends and colleagues
              </p>
            </div>
            <div className="glass-panel rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="text-lg font-medium">Smart AI</div>
              <p className="text-sm text-muted-foreground">
                Get intelligent responses from our AI assistant
              </p>
            </div>
            <div className="glass-panel rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="text-lg font-medium">Sleek Design</div>
              <p className="text-sm text-muted-foreground">
                Enjoy a beautiful, minimal interface
              </p>
            </div>
            <div className="glass-panel rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="text-lg font-medium">Stay Connected</div>
              <p className="text-sm text-muted-foreground">
                See who's online and when messages are read
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="mx-auto w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          
          {children}
          
          <div className="text-center text-sm">
            <p>
              {alternateText}{" "}
              <Link to={alternateLink} className="text-primary hover:underline">
                {alternateLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
