
"use client";

import { Suspense } from "react";
import GoogleCallbackContent from "./GoogleCallbackContent";

export default function GoogleCallback() {
  return (
    <Suspense fallback="Loading...">
      <GoogleCallbackContent />
    </Suspense>
  );
}

