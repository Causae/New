import { Suspense } from "react";
import MatchingClient from "./MatchingClient";

export default function MatchingPage() {
  return (
    <Suspense fallback={<p>Loading matching results...</p>}>
      <MatchingClient />
    </Suspense>
  );
}
