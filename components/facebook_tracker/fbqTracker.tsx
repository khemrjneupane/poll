"use client";

import { useFbq } from "@/hooks/useFbq";

export default function FbqTracker() {
  useFbq(); // this is fine because it's a client component
  return null; // no UI needed
}
