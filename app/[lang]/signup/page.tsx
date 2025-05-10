//app\[lang]\signup\page.tsx
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
import { Checkbox } from "@/components/ui/checkbox";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/middleware";

interface RegisterPageProps {
  params: { lang: Locale };
}

export default function RegisterPage({ params: { lang } }: RegisterPageProps) {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { signIn } = useSignIn();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  // Get dictionary statically or use default values
  const dict = {
    navbar: {
      searchClasses: "Search Classes",
      pricing: "Pricing",
      about: "About",
      login: "Log In",
      signup: "Sign Up",
      business: "Business",
    },
    register: {
      title: "Create an account",
      description: "Enter your information to create your TUDO account",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      password: "Password",
      terms: "I agree to the",
      termsLink: "terms of service",
      privacyLink: "privacy policy",
      termsAnd: "and",
      signUpButton: "Sign up for free trial",
      haveAccount: "Already have an account?",
      logIn: "Log in",
      code: "Verification Code",
      verify: "Verify Email",
      checkEmail: "Please check your email and enter the verification code below.",
    }
  };

  const handleGoogleSignUp = async () => {
    if (!signUp) return;
    try {
      return await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `/${lang}/sso-callback`,
        redirectUrlComplete: `/${lang}`,
      });
    } catch (err) {
      console.error("Error with Google sign up:", err);
    }
  };

  const handleAppleSignUp = async () => {
    if (!signUp) return;
    try {
      return await signUp.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: `/${lang}/sso-callback`,
        redirectUrlComplete: `/${lang}`,
      });
    } catch (err) {
      console.error("Error with Apple sign up:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp || !isLoaded) return;

    setLoading(true);
    setError("");

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp || !isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push(`/${lang}`);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar
        lang={lang}
        dictionary={dict.navbar}
        variant="light"
        transparentOnTop={false}
      />

      <div className="flex-1 flex items-center justify-center py-12 px-4 pt-24">
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
              {dict.register.title}
            </CardTitle>
            <CardDescription className="text-center">
              {pendingVerification ? dict.register.checkEmail : dict.register.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!pendingVerification ? (
              <>
                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                  >
                    Continue with Google
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleAppleSignUp}
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

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {error && (
                      <div className="text-sm text-red-600 text-center">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="first-name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {dict.register.firstName}
                        </label>
                        <Input 
                          id="first-name" 
                          placeholder="John" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="last-name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {dict.register.lastName}
                        </label>
                        <Input 
                          id="last-name" 
                          placeholder="Doe" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {dict.register.email}
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
                      <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {dict.register.password}
                      </label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {dict.register.terms}{" "}
                        <Link
                          href={`/${lang}/terms`}
                          className="text-primary hover:underline"
                        >
                          {dict.register.termsLink}
                        </Link>{" "}
                        {dict.register.termsAnd}{" "}
                        <Link
                          href={`/${lang}/privacy`}
                          className="text-primary hover:underline"
                        >
                          {dict.register.privacyLink}
                        </Link>
                      </label>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Loading..." : dict.register.signUpButton}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              /* Verification Form */
              <form onSubmit={onPressVerify}>
                <div className="space-y-4">
                  {error && (
                    <div className="text-sm text-red-600 text-center">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label
                      htmlFor="code"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {dict.register.code}
                    </label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter verification code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : dict.register.verify}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {dict.register.haveAccount}{" "}
              <Link
                href={`/${lang}/login`}
                className="text-primary hover:underline"
              >
                {dict.register.logIn}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}