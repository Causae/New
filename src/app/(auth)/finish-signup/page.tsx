import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import FinishSignupClient from "./FinishSignupClient";

export default function FinishSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <FinishSignupClient />
    </Suspense>
  );
}
