"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getDeviceId } from "@/backend/lib/getDeviceId";

export function useDeviceIdentifiers() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    async function setup() {
      // ✅ Ensure a stable nominee_id cookie (for anonymous identification)
      const deciveId = await getDeviceId();
      let voterId = Cookies.get("nominee_id");
      const deviceCookies = Cookies.get("fingerprint");

      if (!deviceCookies) {
        Cookies.set("fingerprint", deciveId, {
          expires: 365,
          sameSite: "strict",
        });
      } else {
        setFingerprint(deviceCookies);
      }

      if (!voterId) {
        voterId = crypto.randomUUID();
        Cookies.set("nominee_id", voterId, {
          expires: 365,
          sameSite: "strict",
        });
      }
    }

    setup();
  }, []);

  return { fingerprint };
}
