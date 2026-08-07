import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SettingsProvider } from "@/context/SettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600"],
});

export const metadata: Metadata = {
  title: "AI Auditor | Advanced SEO & Perf Engine",
  description: "Autonomous AI agents to crawl, analyze, and optimize your digital footprint.",
};

import SplashScreen from "@/components/ui/SplashScreen";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import Background from "@/components/ui/Background";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="antialiased min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <SplashScreen />
              <Background />
              <div className="flex-1 flex flex-col relative z-10 w-full min-h-screen">
                <Navbar />
                {children}
              </div>
              <Footer />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
