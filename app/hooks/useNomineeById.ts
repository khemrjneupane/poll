"use client";

import { useQuery } from "@tanstack/react-query";
import { Nominee } from "./useNominees";

export function useNomineeById(id: string) {
  return useQuery<Nominee, Error>({
    queryKey: ["nominee", id],
    queryFn: async () => {
      const res = await fetch(`/api/nominees/${id}`);
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to fetch nominee");
      return data.data;
    },
    enabled: !!id,
  });
}
