"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface SpectraUser {
  id: string;
  name: string;
  email: string;
  avatarId?: string;
  provider: "email" | "google" | "facebook" | "guest";
  joinedAt: string;
}

interface AuthContextType {
  user: SpectraUser | null;
  loading: boolean;
  loginWithEmail: (email: string, name?: string) => void;
  loginWithSocial: (provider: "google" | "facebook") => void;
  continueAsGuest: () => void;
  logout: () => void;
  updateUser: (updated: Partial<SpectraUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SpectraUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("spectra_auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // If unauthenticated and not already on auth page, redirect to auth
        if (pathname !== "/auth") {
          router.replace("/auth");
        }
      }
    } catch (e) {
      console.error("Auth init error:", e);
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  const saveUser = (u: SpectraUser) => {
    setUser(u);
    localStorage.setItem("spectra_auth_user", JSON.stringify(u));
    localStorage.setItem("spectra_user_name", u.name);
    window.dispatchEvent(new Event("spectra_auth_updated"));
  };

  const loginWithEmail = (email: string, name?: string) => {
    const displayName = name?.trim() || email.split("@")[0] || "Spectra Member";
    const newUser: SpectraUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: displayName,
      email,
      avatarId: "ghost",
      provider: "email",
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    saveUser(newUser);
    router.push("/me");
  };

  const loginWithSocial = (provider: "google" | "facebook") => {
    const isGoogle = provider === "google";
    const newUser: SpectraUser = {
      id: `${provider}_` + Math.random().toString(36).substring(2, 9),
      name: isGoogle ? "Spectra Explorer" : "Spectra Cinephile",
      email: isGoogle ? "user@gmail.com" : "user@facebook.com",
      avatarId: isGoogle ? "cyber" : "cinema",
      provider,
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    saveUser(newUser);
    router.push("/me");
  };

  const continueAsGuest = () => {
    const guestUser: SpectraUser = {
      id: "guest_" + Math.random().toString(36).substring(2, 9),
      name: "Guest Explorer",
      email: "guest@spectra.local",
      avatarId: "ghost",
      provider: "guest",
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    saveUser(guestUser);
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("spectra_auth_user");
    localStorage.removeItem("spectra_user_name");
    window.dispatchEvent(new Event("spectra_auth_updated"));
    router.push("/auth");
  };

  const updateUser = (updated: Partial<SpectraUser>) => {
    if (!user) return;
    const next = { ...user, ...updated };
    saveUser(next);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        loginWithSocial,
        continueAsGuest,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
