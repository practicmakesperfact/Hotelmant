'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLocale } from '@/lib/i18n/locale-context';
import { useAuth } from '@/lib/auth/auth-context';
import { DEMO_PASSWORDS } from '@/lib/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocale();
  const { login, getDashboard } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Login successful!');
        router.push(getDashboard());
      } else {
        toast.error(result.error || t.auth.invalidCredentials);
      }
    } catch {
      toast.error(t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORDS[demoEmail] || '');
  };

  const demoAccounts = [
    { email: 'admin@leulmekonenhotel.com', role: 'Administrator' },
    { email: 'manager@leulmekonenhotel.com', role: 'Manager' },
    { email: 'reception@leulmekonenhotel.com', role: 'Receptionist' },
    { email: 'housekeeping@leulmekonenhotel.com', role: 'Housekeeping' },
    { email: 'inventory@leulmekonenhotel.com', role: 'Inventory' },
    { email: 'customer@example.com', role: 'Customer' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-serif text-xl font-bold">L</span>
          </div>
          <div>
            <span className="font-serif text-xl font-semibold text-foreground">Leul Mekonen</span>
            <span className="block text-xs text-muted-foreground -mt-1">Grand Hotel</span>
          </div>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif">{t.auth.loginTitle}</CardTitle>
              <CardDescription>{t.auth.loginSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.auth.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t.auth.password}</Label>
                    <Link 
                      href="/forgot-password" 
                      className="text-xs text-primary hover:underline"
                    >
                      {t.auth.forgotPassword}
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.auth.loggingIn}
                    </>
                  ) : (
                    t.auth.signIn
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">{t.auth.noAccount}</span>{' '}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  {t.auth.signUp}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Demo Accounts</CardTitle>
              <CardDescription className="text-xs">Click to fill credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start h-auto py-2"
                    onClick={() => fillDemoCredentials(account.email)}
                  >
                    {account.role}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
