// components/LoadingIndicator.tsx
import React from 'react'

export const LoadingIndicator: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
    <div className="text-cyan-300 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-300 mx-auto mb-4"></div>
      <p className="text-lg">Loading experience...</p>
    </div>
  </div>
)