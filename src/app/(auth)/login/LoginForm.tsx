"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, Scissors } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useMarket } from "@/providers/MarketProvider";
import { getEmailPlaceholder, getMarketGradientClass, getMarketTextGradientClass } from "@/lib/utils";

export default function LoginForm({
  loginAction,
}: {
  loginAction: (data: FormData) => Promise<{ error?: string; success?: boolean } | void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { market, locale } = useMarket();

  const getLocalizedText = () => {
    if (locale === 'fi') {
      return {
        welcome: 'Tervetuloa Takaisin',
        description: 'Kirjaudu sisään parturi-kampaamopaneeliisi',
        email: 'Sähköpostiosoite',
        password: 'Salasana',
        signIn: 'Kirjaudu Sisään',
        noAccount: 'Eikö sinulla ole tiliä?',
        signUp: 'Rekisteröidy',
        showPassword: 'Näytä salasana',
        hidePassword: 'Piilota salasana',
      };
    }
    if (locale === 'de') {
      return {
        welcome: 'Willkommen zurück',
        description: 'Melden Sie sich bei Ihrem Salon-Dashboard an',
        email: 'E-Mail-Adresse',
        password: 'Passwort',
        signIn: 'Anmelden',
        noAccount: 'Sie haben noch kein Konto?',
        signUp: 'Registrieren',
        showPassword: 'Passwort anzeigen',
        hidePassword: 'Passwort ausblenden',
      };
    }
    return {
      welcome: 'Welcome Back',
      description: 'Sign in to access your salon dashboard',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    };
  };

  const localized = getLocalizedText();

  return (
    <Card className="w-full max-w-md mx-auto border-border shadow-elevated">
      <CardHeader className="text-center space-y-4">
        <div className="mb-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${getMarketGradientClass(market)} shadow-lg`}>
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${getMarketTextGradientClass(market)}`}>
            Salon Pro
          </h1>
        </div>
        <CardTitle className="text-2xl font-semibold">{localized.welcome}</CardTitle>
        <CardDescription className="text-muted-foreground">{localized.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          action={(formData) => {
            startTransition(async () => {
              const res = await loginAction(formData);
              if (res?.error) {
                setError(res.error);
              } else if (res?.success) {
                router.push("/dashboard");
                router.refresh();
              }
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">{localized.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={getEmailPlaceholder(market)}
                className="pl-10 h-11"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">{localized.password}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11"
                required
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                disabled={isPending}
                aria-label={showPassword ? localized.hidePassword : localized.showPassword}
                title={showPassword ? localized.hidePassword : localized.showPassword}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 text-base font-medium"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                <span>{locale === 'fi' ? 'Kirjaudutaan...' : locale === 'de' ? 'Anmelden...' : 'Signing in...'}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>{localized.signIn}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>

        <div className="text-center pt-4 border-t">
          <p className="text-muted-foreground text-sm">
            {localized.noAccount}{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline transition-colors"
            >
              {localized.signUp}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}