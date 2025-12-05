"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { languages } from "@/constants/language";
import { useMarket } from "@/providers/MarketProvider";
import { getMarketGradientClass } from "@/lib/utils";

export default function SignupForm({
  signupAction,
}: {
  signupAction: (data: FormData) => Promise<{ error?: string; success?: boolean } | void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("en");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { market } = useMarket();

  const getLocalizedText = () => {
    const lang = languages.find(l => l.value === language)?.value || 'en';
    if (lang === 'fi') {
      return {
        createAccount: 'Luo tili',
        joinDescription: 'Liity tuhansiin käyttäjiin ja hallitse tiliäsi tehokkaasti',
        email: 'Sähköposti',
        password: 'Salasana',
        language: 'Kieli',
        searchLanguage: 'Etsi kieltä...',
        noLanguageFound: 'Kieltä ei löytynyt',
        signingUp: 'Rekisteröidään...',
        signUp: 'Rekisteröidy',
        alreadyHaveAccount: 'Onko sinulla jo tili?',
        signIn: 'Kirjaudu Sisään',
        showPassword: 'Näytä salasana',
        hidePassword: 'Piilota salasana',
      };
    }
    if (lang === 'de') {
      return {
        createAccount: 'Konto erstellen',
        joinDescription: 'Treten Sie Tausenden von Nutzern bei und verwalten Sie Ihr Konto effizient',
        email: 'E-Mail',
        password: 'Passwort',
        language: 'Sprache',
        searchLanguage: 'Sprache suchen...',
        noLanguageFound: 'Keine Sprache gefunden',
        signingUp: 'Registrieren...',
        signUp: 'Registrieren',
        alreadyHaveAccount: 'Sie haben bereits ein Konto?',
        signIn: 'Anmelden',
        showPassword: 'Passwort anzeigen',
        hidePassword: 'Passwort ausblenden',
      };
    }
    return {
      createAccount: 'Create Account',
      joinDescription: 'Join thousands of users and manage your account efficiently',
      email: 'Email',
      password: 'Password',
      language: 'Language',
      searchLanguage: 'Search language...',
      noLanguageFound: 'No language found',
      signingUp: 'Signing up...',
      signUp: 'Sign Up',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign In',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    };
  };

  const localized = getLocalizedText();

  return (
    <Card className="w-full min-w-96 border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{localized.createAccount}</CardTitle>
        <CardDescription>{localized.joinDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        <form
          action={(formData) =>
            startTransition(async () => {
              setError(null);
              const res = await signupAction(formData);
              if (res?.error) setError(res.error);
              if (res?.success) {
                router.push("/dashboard");
                router.refresh();
              }
            })
          }
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">{localized.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input id="email" name="email" type="email" placeholder={localized.email} className="pl-10" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{localized.password}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? localized.hidePassword : localized.showPassword}
                title={showPassword ? localized.hidePassword : localized.showPassword}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <input type="hidden" name="language" value={language} />
          <div className="space-y-2">
            <Label>{localized.language}</Label>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {languages.find((l) => l.value === language)?.label}
                  </div>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={localized.searchLanguage} />
                  <CommandEmpty>{localized.noLanguageFound}</CommandEmpty>

                  <CommandGroup>
                    {languages.map((l) => (
                      <CommandItem
                        key={l.value}
                        value={l.label}
                        onSelect={() => {
                          setLanguage(l.value);
                          setOpen(false);
                        }}
                      >
                        {l.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <Button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 text-lg bg-gradient-to-r ${getMarketGradientClass(market)} hover:opacity-90 flex items-center justify-center space-x-2 text-white`}
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{localized.signingUp}</span>
              </div>
            ) : (
              <>
                <span>{localized.signUp}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-4">
          <span className="text-muted-foreground mr-1">{localized.alreadyHaveAccount}</span>
          <Link href="/login" className="text-primary hover:text-primary/90">
            {localized.signIn}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}