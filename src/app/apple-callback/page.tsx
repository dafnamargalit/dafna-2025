'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AppleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Connecting to Apple Music...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');

      if (code) {
        try {
          setStatus('Exchanging authorization code...');
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
            setStatus('Successfully connected! Redirecting...');
            localStorage.setItem('apple-access-token', data.access_token);
            router.push('/quiz');
          } else {
            setStatus('Error: No access token received. Redirecting...');
            console.error('No access token received');
            router.push('/quiz');
          }
        } catch (error) {
          setStatus('Error connecting to Apple Music. Redirecting...');
          console.error('Error exchanging code for token:', error);
          router.push('/quiz');
        }
      } else {
        setStatus('No authorization code received. Redirecting...');
        router.push('/quiz');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>{status}</p>
    </div>
  );
} 