'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/lib/auth/auth-context';
import { LocaleProvider } from '@/lib/i18n/locale-context';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LocaleProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
