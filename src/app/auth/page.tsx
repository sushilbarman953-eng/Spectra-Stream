"use client";

import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Film,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { soundFx } from "@/lib/soundFx";

export default function AuthPage() {
  const { loginWithEmail, loginWithSocial, continueAsGuest } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    soundFx.playCinematicPop();

    const res = await loginWithEmail(
      email,
      password,
      mode === "register" ? name : undefined,
      mode === "register"
    );

    if (res?.error) {
      setErrorMsg(res.error);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#08080c]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#0e0e14]/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 shadow-glow mb-2">
            <Film className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Spectra Cinema
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-xs text-zinc-400">
            {mode === "login"
              ? "Sign in to synchronize your watchlist, history, and offline vault"
              : "Register to unlock 4K streaming, device sync, and offline media"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => {
              soundFx.playCinematicPop();
              setMode("login");
              setErrorMsg("");
            }}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === "login"
                ? "bg-white text-black shadow-glow font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playCinematicPop();
              setMode("register");
              setErrorMsg("");
            }}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === "register"
                ? "bg-white text-black shadow-glow font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Social Authentication */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playCinematicPop();
              loginWithSocial("google");
            }}
            className="w-full py-2.5 px-4 rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold flex items-center justify-center gap-3 transition active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-3.1v-3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 16.1C3.5 19.9 7.4 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playCinematicPop();
              loginWithSocial("facebook");
            }}
            className="w-full py-2.5 px-4 rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold flex items-center justify-center gap-3 transition active:scale-[0.98]"
          >
            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            Or with email
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {errorMsg}
            </div>
          )}

          {mode === "register" && (
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-2xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
              />
            </div>
          )}

          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 rounded-2xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
            />
          </div>

          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 pl-10 pr-10 rounded-2xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 text-zinc-500 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-2xl bg-white text-black font-black text-xs shadow-glow hover:bg-zinc-200 active:scale-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                <span>{mode === "login" ? "Enter Spectra" : "Create Account"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              soundFx.playCinematicWhoosh();
              continueAsGuest();
            }}
            className="text-[11px] font-semibold text-zinc-400 hover:text-white underline underline-offset-4 transition"
          >
            Skip for now & continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
