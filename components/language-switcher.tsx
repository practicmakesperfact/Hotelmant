'use client';

import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n/locale-context';
import { localeConfigs } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const currentConfig = localeConfigs[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentConfig.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(localeConfigs).map(([code, config]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLocale(code as Locale)}
            className={locale === code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{config.nativeName}</span>
            <span className="text-muted-foreground text-xs">({config.name})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
