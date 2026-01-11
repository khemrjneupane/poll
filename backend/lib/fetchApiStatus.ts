import Cookies from "js-cookie";
import { GetIPResponse } from "@/types/vote";

// Optional helper to read fingerprint from localStorage or state
// You can store fingerprint in localStorage from useDeviceIdentifiers
const getFingerprint = () => {
  try {
    return localStorage.getItem("fingerprint") || "";
  } catch {
    return "";
  }
};

export const fetchIPStatus = async (): Promise<GetIPResponse> => {
  // Read cookie & fingerprint

  const voterId = Cookies.get("nominee_id") || "";
  const fingerprint = Cookies.get("fingerprint") || "";
  //const fingerprint = getFingerprint();

  const res = await fetch("/api/technical", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-fingerprint": fingerprint,
      "x-voter-id": voterId,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${data.messageNominated || data.messageVoted}`);
  }

  return data as Promise<GetIPResponse>;
};
