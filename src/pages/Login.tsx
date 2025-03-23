
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { isAuthenticated } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to chat if already authenticated
    if (isAuthenticated()) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
      alternateText="Don't have an account?"
      alternateLink="/signup"
      alternateLinkText="Sign up"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
