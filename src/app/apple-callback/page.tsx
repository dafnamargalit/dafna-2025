'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AppleCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { code } = router.query;

      if (code) {
        try {
          // Exchange the authorization code for an access token
          const response = await fetch('/api/apple-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();
          
          if (data.access_token) {
            localStorage.setItem('apple-access-token', data.access_token);
            router.push('/quiz');
          } else {
            console.error('No access token received');
            router.push('/quiz');
          }
        } catch (error) {
          console.error('Error exchanging code for token:', error);
          router.push('/quiz');
        }
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>Connecting to Apple Music...</p>
    </div>
  );
} 