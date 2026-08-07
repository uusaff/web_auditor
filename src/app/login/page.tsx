"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name);
      }
      router.push("/dashboard");
    } catch (err: any) {
      // Very basic error handling for Firebase codes
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError("Google login failed.");
    }
  };

  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col items-center justify-center bg-transparent py-12 px-6">
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Features */}
        <div className="flex-1 w-full flex flex-col lg:items-start text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-['VictoryStriker'] text-[#ccb999] tracking-widest mb-6">
            JOIN US !
          </h1>
          <p className="text-white/70 font-light text-lg mb-10 max-w-xl mx-auto lg:mx-0">
            Join the most advanced web auditing platform. We don't just find symptoms; we engineer solutions.
          </p>

          <h2 className="text-2xl md:text-3xl font-['VictoryStriker'] text-white tracking-widest mb-6">
            OUR KEY FEATURES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mx-auto lg:mx-0">
            {[
              { title: "Context-Aware", desc: "AI models trained to understand your UI layout." },
              { title: "Deep Crawling", desc: "Multi-layered mapping of your architecture." },
              { title: "Auto-Fix Generation", desc: "Exact, copy-pasteable code patches." },
              { title: "Stealth Scraping", desc: "Bypass enterprise-grade bot protection." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <h3 className="text-[#ccb999] font-bold text-sm tracking-widest uppercase mb-2">{feature.title}</h3>
                <p className="text-white/60 text-xs font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-md">
          <div className="bg-[#101b13]/80 border border-sky-400/20 backdrop-blur-xl rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Subtle background glow inside the card */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <div className="w-12 h-12 relative rounded-full overflow-hidden border border-white/10">
                  <Image src="/usf-logo.jpg" alt="Logo" fill className="object-cover" />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1"
                    >
                      <label htmlFor="name" className="text-xs text-white/50 uppercase tracking-widest ml-4">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        aria-label="Full Name"
                        aria-required="true"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-14 rounded-full bg-white/5 border border-white/10 px-6 text-white placeholder:text-white/30 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                        placeholder="John Doe"
                        required={!isLogin}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs text-white/50 uppercase tracking-widest ml-4">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    aria-label="Email Address"
                    aria-required="true"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 rounded-full bg-white/5 border border-white/10 px-6 text-white placeholder:text-white/30 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="text-xs text-white/50 uppercase tracking-widest ml-4">Password</label>
                  <input
                    id="password"
                    name="password"
                    aria-label="Password"
                    aria-required="true"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 rounded-full bg-white/5 border border-white/10 px-6 text-white placeholder:text-white/30 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 mt-4 bg-white text-black rounded-full font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/40 uppercase tracking-widest">or continue with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center gap-3 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-bold tracking-wide">Google</span>
              </button>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
