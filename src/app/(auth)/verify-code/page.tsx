import React, { Suspense } from 'react';
import VerifyCodeClient from './VerifyCodeClient';

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      {/* Client component uses useSearchParams; provide Suspense boundary for CSR bailout */}
      <VerifyCodeClient />
    </Suspense>
  );
}
