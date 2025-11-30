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

  return (
    <Card className="w-full min-w-96">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join thousands of users and manage your account efficiently</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
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
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input id="email" name="email" type="email" placeholder="Email" className="pl-10" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

           <input type="hidden" name="language" value={language} />
          <div className="space-y-2">
            <Label>Language</Label>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    {languages.find((l) => l.value === language)?.label}
                  </div>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search language..." />
                  <CommandEmpty>No language found.</CommandEmpty>

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
            className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center space-x-2"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing up...</span>
              </div>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-4">
          <span className="text-gray-600 mr-1">Already have an account?</span>
          <Link href="/login" className="text-purple-600 hover:text-purple-700">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
