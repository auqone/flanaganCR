"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateCustomer: (customer: Partial<Customer>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    customer: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      try {
        const customer = JSON.parse(storedCustomer);
        setAuthState({
          customer,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem("customer");
        setAuthState({
          customer: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual login API call
    // For now, this is a placeholder
    const customer: Customer = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem("customer", JSON.stringify(customer));
    setAuthState({
      customer,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to create account");
    }

    const customer: Customer = await response.json();
    localStorage.setItem("customer", JSON.stringify(customer));
    setAuthState({
      customer,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("customer");
    setAuthState({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateCustomer = (updates: Partial<Customer>) => {
    if (authState.customer) {
      const updatedCustomer = { ...authState.customer, ...updates };
      localStorage.setItem("customer", JSON.stringify(updatedCustomer));
      setAuthState((prev) => ({
        ...prev,
        customer: updatedCustomer,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
