"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, loginWithGoogle, logout, loading } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="relative z-50 w-full h-20 bg-black/10 border-b border-sky-400/20 backdrop-blur-sm px-6 md:px-12 flex items-center justify-between">
      
      {/* Left Actions: Logo (moved back to left) */}
      <div className="flex items-center">
        <Link href="/" className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-transform hover:scale-105">
           <Image src="/logo.png" alt="Logo" fill sizes="64px" className="object-contain" />
        </Link>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-full max-w-[800px] text-sm tracking-[0.2em] font-light text-white/90 whitespace-nowrap">
        
        {/* Left Side Links */}
        <div className="flex-1 flex justify-end gap-8 pr-10">
          <Link href="/" className={`transition-colors uppercase ${pathname === '/' ? 'text-[#ccb999] font-bold' : 'hover:text-white'}`}>Home</Link>
          <Link href="/about" className={`transition-colors uppercase ${pathname === '/about' ? 'text-[#ccb999] font-bold' : 'hover:text-white'}`}>About</Link>
          <Link href="/features" className={`transition-colors uppercase ${pathname === '/features' ? 'text-[#ccb999] font-bold' : 'hover:text-white'}`}>Features</Link>
        </div>

        {/* Absolute Center Link */}
        <div className="flex-shrink-0">
          <Link 
            href="/new-audit" 
            className="bg-[#ccb999] hover:bg-[#b8a485] text-black font-semibold text-xs tracking-wider uppercase px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(204,185,153,0.3)] transition-all hover:scale-105 block"
          >
            New Audit
          </Link>
        </div>

        {/* Right Side Links */}
        <div className="flex-1 flex justify-start gap-8 pl-10">
          <Link href="/pricing" className={`transition-colors uppercase ${pathname === '/pricing' ? 'text-[#ccb999] font-bold' : 'hover:text-white'}`}>Pricing</Link>
          <Link href="/enterprise" className={`transition-colors uppercase ${pathname === '/enterprise' ? 'text-[#ccb999] font-bold' : 'hover:text-white'}`}>Enterprise</Link>
        </div>
        
      </div>

      {/* Right Actions: User Dropdown (moved back to right) */}
      <div className="flex items-center">
        {/* Global Settings & User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-black/40 hover:border-sky-300/50 hover:bg-white/5 transition-all overflow-hidden"
            aria-label="Menu"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            {user?.photoURL ? (
              <Image src={user.photoURL} alt="User" fill className="object-cover" unoptimized />
            ) : (
              // Default Menu/User Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#151f18]/95 border border-white/10 rounded-2xl shadow-2xl py-2 flex flex-col backdrop-blur-xl overflow-hidden z-50">
              {/* Mobile Core Navigation Links */}
              <div className="md:hidden flex flex-col border-b border-white/10 pb-1 mb-1">
                <Link href="/" onClick={() => setIsDropdownOpen(false)} className={`px-4 py-2.5 text-sm transition-colors block uppercase ${pathname === '/' ? 'text-[#ccb999] font-bold' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>Home</Link>
                <Link href="/about" onClick={() => setIsDropdownOpen(false)} className={`px-4 py-2.5 text-sm transition-colors block uppercase ${pathname === '/about' ? 'text-[#ccb999] font-bold' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>About</Link>
                <Link href="/features" onClick={() => setIsDropdownOpen(false)} className={`px-4 py-2.5 text-sm transition-colors block uppercase ${pathname === '/features' ? 'text-[#ccb999] font-bold' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>Features</Link>
                <Link href="/pricing" onClick={() => setIsDropdownOpen(false)} className={`px-4 py-2.5 text-sm transition-colors block uppercase ${pathname === '/pricing' ? 'text-[#ccb999] font-bold' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>Pricing</Link>
                <Link href="/enterprise" onClick={() => setIsDropdownOpen(false)} className={`px-4 py-2.5 text-sm transition-colors block uppercase ${pathname === '/enterprise' ? 'text-[#ccb999] font-bold' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>Enterprise</Link>
              </div>

              {!loading && user ? (
                <>
                  <div className="px-4 py-3 border-b border-white/10 mb-1 bg-black/20">
                    <p className="text-sm font-bold text-white truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                  </div>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center"
                  >
                    My Dashboard
                  </Link>
                  <Link 
                    href="/settings" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center"
                  >
                    Settings
                  </Link>
                </>
              ) : !loading ? (
                <>
                  <Link 
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full text-left px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors block"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full text-left px-4 py-3 text-sm text-[#ccb999] hover:text-[#e0cba8] hover:bg-white/5 transition-colors font-bold block"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="px-4 py-3">
                  <div className="w-full h-4 animate-pulse bg-white/10 rounded"></div>
                </div>
              )}

              <div className="my-1 border-t border-white/10" />
              
              <button 
                onClick={toggleDarkMode}
                role="switch"
                aria-checked={isDarkMode}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span>Dark Mode Overlay</span>
                <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${isDarkMode ? 'bg-sky-500' : 'bg-white/20'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </button>

              {user && (
                <>
                  <div className="my-1 border-t border-white/10" />
                  <button 
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }} 
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
    </nav>
  );
}
