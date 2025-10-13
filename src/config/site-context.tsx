import { createContext, useContext, type ReactNode } from 'react';
import type { SiteConfig } from './site';

const SiteConfigContext = createContext<SiteConfig | null>(null);

interface SiteConfigProviderProps {
  value: SiteConfig;
  children: ReactNode;
}

export function SiteConfigProvider({ value, children }: SiteConfigProviderProps) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig(): SiteConfig {
  const context = useContext(SiteConfigContext);

  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }

  return context;
}
