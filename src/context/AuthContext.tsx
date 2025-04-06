// AuthContext.tsx
import React, { createContext, useContext, useState } from "react";

interface AuthState {
  isRegistered: boolean;
  pendingVerification: boolean;
  email: string | null;
  setRegistrationComplete: (email: string) => void;
  setVerificationComplete: () => void;
  reset: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const setRegistrationComplete = (userEmail: string) => {
    setEmail(userEmail);
    setIsRegistered(true);
    setPendingVerification(true);

    // For added security, store a timestamped token in sessionStorage
    const verificationToken = {
      email: userEmail,
      timestamp: Date.now(),
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };
    sessionStorage.setItem(
      "pendingVerification",
      JSON.stringify(verificationToken)
    );
  };

  const setVerificationComplete = () => {
    setPendingVerification(false);
    sessionStorage.removeItem("pendingVerification");
  };

  const reset = () => {
    setIsRegistered(false);
    setPendingVerification(false);
    setEmail(null);
    sessionStorage.removeItem("pendingVerification");
  };

  return (
    <AuthContext.Provider
      value={{
        isRegistered,
        pendingVerification,
        email,
        setRegistrationComplete,
        setVerificationComplete,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
