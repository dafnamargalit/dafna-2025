'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SpotifyCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');

      if (accessToken) {
        // Store the token and redirect back to the quiz
        localStorage.setItem('access-token', accessToken);
        localStorage.setItem('streaming-service', 'spotify');
        console.log('accessToken', accessToken);
        router.push('/quiz');
      } else {
        console.error('No access token received');
        router.push('/quiz');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>Connecting to Spotify...</p>
    </div>
  );
} 