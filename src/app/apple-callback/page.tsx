import { Suspense } from 'react';
import AppleCallbackClient from './AppleCallbackClient';

export default function AppleCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    }>
      <AppleCallbackClient />
    </Suspense>
  );
} 