"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "./supabaseClient";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";

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
  loginWithEmail: (email: string, password: string, name?: string, isSignUp?: boolean) => Promise<{ error?: string }>;
  loginWithSocial: (provider: "google" | "facebook") => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<SpectraUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SpectraUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const formatUser = (sbUser: SupabaseAuthUser): SpectraUser => {
    const meta = sbUser.user_metadata || {};
    const provider = (sbUser.app_metadata?.provider as any) || "email";
    return {
      id: sbUser.id,
      name: meta.full_name || meta.name || sbUser.email?.split("@")[0] || "Spectra Member",
      email: sbUser.email || "",
      avatarId: meta.avatarId || "ghost",
      provider: provider === "google" || provider === "facebook" ? provider : "email",
      joinedAt: new Date(sbUser.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check guest mode session
      const isGuest = localStorage.getItem("spectra_guest_session");
      if (isGuest === "true") {
        setUser({
          id: "guest_session",
          name: "Guest Explorer",
          email: "guest@spectra.local",
          avatarId: "ghost",
          provider: "guest",
          joinedAt: "Today",
        });
        setLoading(false);
        return;
      }

      // 2. Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(formatUser(session.user));
      } else {
        if (pathname !== "/auth" && pathname !== "/share") {
          router.replace("/auth");
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes (OAuth redirects, login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        localStorage.removeItem("spectra_guest_session");
        setUser(formatUser(session.user));
      } else if (!localStorage.getItem("spectra_guest_session")) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const loginWithEmail = async (email: string, password: string, name?: string, isSignUp: boolean = false) => {
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) return { error: error.message };
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
      }

      router.push("/me");
      return {};
    } catch (err: any) {
      return { error: err?.message || "Authentication failed" };
    }
  };

  const loginWithSocial = async (provider: "google" | "facebook") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const continueAsGuest = () => {
    localStorage.setItem("spectra_guest_session", "true");
    setUser({
      id: "guest_session",
      name: "Guest Explorer",
      email: "guest@spectra.local",
      avatarId: "ghost",
      provider: "guest",
      joinedAt: "Today",
    });
    router.push("/");
  };

  const logout = async () => {
    localStorage.removeItem("spectra_guest_session");
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  const updateUser = async (updated: Partial<SpectraUser>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updated } : null));

    if (user.provider !== "guest") {
      await supabase.auth.updateUser({
        data: {
          full_name: updated.name || user.name,
          avatarId: updated.avatarId || user.avatarId,
        },
      });
    }
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
