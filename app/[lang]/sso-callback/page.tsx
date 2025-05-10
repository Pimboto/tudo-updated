// app/[lang]/sso-callback/page.tsx
"use client"

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSignUp, useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SSOCallbackPage() {
  const router = useRouter();
  const { signUp, setActive } = useSignUp();
  const { isLoaded } = useSignIn();
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    console.log("🔄 SSO Callback page loaded");
    console.log("🔍 Current URL:", window.location.href);
    
    // Verificar el estado del signup después de la redirección OAuth
    const checkSignUpStatus = async () => {
      if (signUp && signUp.status === 'missing_requirements') {
        console.log("⚠️ Missing requirements detected:", signUp);
        if (signUp.missingFields?.includes('username')) {
          console.log("📝 Username required, showing form");
          setShowUsernameForm(true);
        }
      }
    };
    
    const timer = setTimeout(checkSignUpStatus, 500);
    return () => clearTimeout(timer);
  }, [signUp]);
  
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log("🔄 Updating username:", username);
      
      // Actualizar el signup con el username
      const updatedSignUp = await signUp?.update({
        username: username
      });
      
      console.log("✅ Updated signUp:", updatedSignUp);
      
      // Si aún faltan campos o si el status cambió, podemos intentar completar
      if (updatedSignUp?.status === 'complete') {
        console.log("🎉 SignUp complete! Activating session...");
        await setActive?.({ session: updatedSignUp.createdSessionId });
        router.push('/');
      } else if (updatedSignUp?.status === 'missing_requirements') {
        console.log("⚠️ Still missing requirements");
        setError('Please enter a valid username');
      } else {
        console.log("🔄 Attempting to complete signup...");
        
        // Intentar completar el registro
        const attempt = await signUp?.attemptEmailAddressVerification({
          code: '' // Replace with the actual verification code
        });
        console.log("✅ Verification attempt:", attempt);
        
        if (attempt?.status === 'complete') {
          if (setActive) {
            await setActive({ session: attempt.createdSessionId });
          } else {
            console.error("❌ setActive is undefined");
          }
          router.push('/');
        }
      }
    } catch (err: any) {
      console.error("❌ Error updating username:", err);
      setError(err.errors?.[0]?.message || 'Error updating username');
    } finally {
      setLoading(false);
    }
  };
  
  if (showUsernameForm) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Complete Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-lg font-medium">Completing login...</h1>
        <p className="text-sm text-gray-500 mt-2">Please wait</p>
      </div>
      <AuthenticateWithRedirectCallback 
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/"
        signInFallbackRedirectUrl="/" 
        signUpFallbackRedirectUrl="/"
        afterSignInUrl="/"
        afterSignUpUrl="/"
      />
    </div>
  );
}