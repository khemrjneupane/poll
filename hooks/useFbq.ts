"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function useFbq() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
      console.log("Meta Pixel fired for path:", pathname);
    }
  }, [pathname]);
}
