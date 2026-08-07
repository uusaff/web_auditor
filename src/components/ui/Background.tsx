"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Background() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Image
        src="/bg-custom.jpg"
        alt="Misty Forest Background"
        fill
        className="object-cover object-center"
        priority
        unoptimized
      />
      {/* Soft elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#101b13]/80" />
      
      {/* 50% Black overlay for Dark Mode */}
      {isDarkMode && (
        <div className="absolute inset-0 bg-black/50 transition-colors duration-500" />
      )}
    </div>
  );
}
