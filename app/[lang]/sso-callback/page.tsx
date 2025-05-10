//app\[lang]\sso-callback\page.tsx
"use client"

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SSOCallbackPage() {
  return <AuthenticateWithRedirectCallback 
    signInForceRedirectUrl="/"
    signUpForceRedirectUrl="/"
    signInFallbackRedirectUrl="/" 
    signUpFallbackRedirectUrl="/"
  />;
}