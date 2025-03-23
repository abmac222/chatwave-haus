
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import { isAuthenticated } from "@/lib/auth";

const Signup = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to chat if already authenticated
    if (isAuthenticated()) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your details to create a new account"
      alternateText="Already have an account?"
      alternateLink="/login"
      alternateLinkText="Sign in"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
