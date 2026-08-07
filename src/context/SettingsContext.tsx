"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ExportFormat = "json" | "pdf" | "dashboard";

interface SettingsContextType {
  openRouterKey: string;
  setOpenRouterKey: (key: string) => void;
  scrapingDepth: "viewport" | "full";
  setScrapingDepth: (depth: "viewport" | "full") => void;
  domSanitization: boolean;
  setDomSanitization: (val: boolean) => void;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  openRouterKey: "",
  setOpenRouterKey: () => {},
  scrapingDepth: "full", // Blueprint defaults full page
  setScrapingDepth: () => {},
  domSanitization: true, // Blueprint default ON
  setDomSanitization: () => {},
  exportFormat: "dashboard",
  setExportFormat: () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [scrapingDepth, setScrapingDepth] = useState<"viewport" | "full">("full");
  const [domSanitization, setDomSanitization] = useState(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("dashboard");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage
    const storedKey = localStorage.getItem("openRouterKey");
    if (storedKey) setOpenRouterKey(storedKey);

    const storedDepth = localStorage.getItem("scrapingDepth") as "viewport" | "full";
    if (storedDepth) setScrapingDepth(storedDepth);

    const storedSanitization = localStorage.getItem("domSanitization");
    if (storedSanitization !== null) setDomSanitization(storedSanitization === "true");

    const storedFormat = localStorage.getItem("exportFormat") as ExportFormat;
    if (storedFormat) setExportFormat(storedFormat);

    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("openRouterKey", openRouterKey);
    localStorage.setItem("scrapingDepth", scrapingDepth);
    localStorage.setItem("domSanitization", String(domSanitization));
    localStorage.setItem("exportFormat", exportFormat);
  }, [openRouterKey, scrapingDepth, domSanitization, exportFormat, isLoaded]);

  return (
    <SettingsContext.Provider 
      value={{ 
        openRouterKey, setOpenRouterKey, 
        scrapingDepth, setScrapingDepth, 
        domSanitization, setDomSanitization, 
        exportFormat, setExportFormat 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
