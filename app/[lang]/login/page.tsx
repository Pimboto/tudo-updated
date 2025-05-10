//app\[lang]\login\page.tsx
"use client"

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/middleware";

interface LoginPageProps {
  params: { lang: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function LoginPage({ params: { lang }, searchParams }: LoginPageProps) {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get dictionary statically or use default values
  const dict = {
    navbar: {
      searchClasses: "Search Classes",
      pricing: "Pricing",
      about: "About",
      login: "Login",
      signup: "Sign Up",
      business: "Business",
    },
    login: {
      title: "Welcome back",
      description: "Enter your email and password to log in to your account",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      loginButton: "Log in",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
    }
  };

  const handleGoogleSignIn = async () => {
    if (!signIn) return;
    try {
      return await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `/${lang}/sso-callback`,
        redirectUrlComplete: `/${lang}`,
      });
    } catch (err) {
      console.error("Error with Google sign in:", err);
    }
  };

  const handleAppleSignIn = async () => {
    if (!signIn) return;
    try {
      return await signIn.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: `/${lang}/sso-callback`,
        redirectUrlComplete: `/${lang}`,
      });
    } catch (err) {
      console.error("Error with Apple sign in:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn || !isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push(`/${lang}`);
      } else {
        setError("Invalid email or password");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar
        lang={lang}
        dictionary={dict.navbar}
        variant="light"
        transparentOnTop={false}
      />

      <main className="min-h-screen flex flex-col pt-24 pb-12 px-4">
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="relative h-12 w-48">
                  <Image
                    src="/images/tudo-logo.png"
                    alt="TUDO Logo"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-heading text-center">
                {dict.login.title}
              </CardTitle>
              <CardDescription className="text-center">
                {dict.login.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAppleSignIn}
                  disabled={loading}
                >
                  Continue with Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {error && (
                    <div className="text-sm text-red-600 text-center">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {dict.login.email}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {dict.login.password}
                      </label>
                      <Link
                        href={`/${lang}/forgot-password`}
                        className="text-sm text-primary hover:underline"
                      >
                        {dict.login.forgotPassword}
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : dict.login.loginButton}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                {dict.login.noAccount}{" "}
                <Link
                  href={`/${lang}/signup`}
                  className="text-primary hover:underline"
                >
                  {dict.login.signUp}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}