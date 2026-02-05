"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useSyncExternalStore } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const mounted = useIsMounted();

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
