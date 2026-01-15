import React, { useState, useEffect } from 'react';
import TunnelSceneContent from '../Tunnel';
import { LoadingIndicator } from '../LoadingIndicator';
import retroFont from '../RetroFont';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isTunnelLoaded, setIsTunnelLoaded] = useState(true);

  useEffect(() => {
    // Simulate tunnel loading
    const timer = setTimeout(() => {
      setIsTunnelLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative min-h-screen bg-black ${retroFont.className}`}>
      {/* Fixed background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <TunnelSceneContent />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-[100dvh] overflow-y-auto touch-pan-y">
        {children}
      </div>

      {/* Loading overlay */}
      {!isTunnelLoaded && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center pointer-events-none">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
} 