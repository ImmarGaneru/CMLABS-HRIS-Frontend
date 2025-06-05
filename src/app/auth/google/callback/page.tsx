"use client";

import { Suspense } from "react";
import GoogleCallbackContent from "./GoogleCallbackContent"; // komponen terpisah

export default function GoogleCallback() {
  return (
    <Suspense fallback="Loading...">
      <GoogleCallbackContent />
    </Suspense>
  );
}