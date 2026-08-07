// TypeScript interfaces for audit data

export interface AuditResult {
  url: string;
  lighthouseScore?: number;
  accessibilityScore?: number;
  bestPracticesScore?: number;
  seoScore?: number;
  aiSuggestions?: string[];
  colors?: string[];
  fonts?: string[];
}
