"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SplashScreen({ children }: { children?: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // 1.2 second splash screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#101b13]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-sky-300/30">
                <Image src="/usf-logo.jpg" alt="AI Auditor Logo" fill sizes="96px" priority className="object-cover" />
              </div>
              <h1 className="text-3xl tracking-[0.3em] text-[#ccb999] font-['VictoryStriker']">
                AI AUDITOR
              </h1>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                <motion.div
                  className="h-full bg-sky-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, ease: "circOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
