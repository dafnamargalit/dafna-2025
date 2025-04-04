import React from 'react';
import TunnelSceneContent from '../Tunnel';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Fixed background */}
      <div className="fixed inset-0 z-0">
        <TunnelSceneContent />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 