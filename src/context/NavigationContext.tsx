'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextType {
  previousPath: string | null;
}

const NavigationContext = createContext<NavigationContextType>({
  previousPath: null,
});

export function useNavigation() {
  return useContext(NavigationContext);
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    if (previousPath !== pathname) {
      setPreviousPath(pathname);
    }
  }, [pathname, previousPath]);

  return (
    <NavigationContext.Provider value={{ previousPath }}>
      {children}
    </NavigationContext.Provider>
  );
}
