import React from 'react';
import { IconSpotify, IconAppleMusic } from './Icons';

interface StreamingServiceModalProps {
  onSelect: (service: string, accessToken: string) => void;
  isMobile: boolean;
}

export default function StreamingServiceModal({ onSelect, isMobile }: StreamingServiceModalProps) {
  const handleSpotifyLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = `${window.location.origin}/spotify-callback`;
    const scope = 'user-library-modify';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  const handleAppleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_MUSIC_CLIENT_ID;
    const redirectUri = `${window.location.origin}/apple-callback`;
    const scope = 'music';
    
    const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-cyan-900 p-8 rounded-lg ${isMobile ? 'w-11/12' : 'w-1/2'} max-w-md`}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Streaming Service</h2>
        <div className="space-y-4">
          <button
            onClick={handleSpotifyLogin}
            className="w-full flex items-center justify-center space-x-2 bg-[#1DB954] text-white p-4 rounded-lg hover:bg-[#1ed760] transition-colors"
          >
            <IconSpotify />
            <span>Connect with Spotify</span>
          </button>
          <button
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center space-x-2 bg-white text-black p-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IconAppleMusic />
            <span>Connect with Apple Music</span>
          </button>
        </div>
      </div>
    </div>
  );
} 