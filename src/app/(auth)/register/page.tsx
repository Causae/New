import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import RegisterClient from "./RegisterClient";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center text-center p-8 h-[550px] w-[448px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
