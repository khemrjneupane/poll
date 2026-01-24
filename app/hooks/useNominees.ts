// hooks/useNominees.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface Voter {
  userId: string;
  ipAddress: string;
}

export interface Nominee {
  _id: string;
  name: string;
  surname: string;
  age: number;
  party: string;
  group: "party" | "independent";
  province: string;
  ipAddress: string;
  votes: number;
  createdAt: string;
  image: string;
  avatar: { public_id: string; url: string } | undefined;
  voters: Voter[];
  isApproved: boolean;
  address: {
    ward: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface NomineesResponse {
  nominees: Nominee[];
  pagination: Pagination;
}

export function useNominees(
  page: number = 1,
  sortOrder: "desc" | "asc" = "desc",
  province: string = "",
  group: string = "",
  //fullname: string = "",
  name: string = "",
  surname: string = "",
  party: string = "", // ✅ new param
) {
  return useQuery<NomineesResponse, Error>({
    queryKey: [
      "nominees",
      province,
      group,
      party,
      name,
      surname,
      page,
      sortOrder,
    ], // ✅ include party
    queryFn: async (): Promise<NomineesResponse> => {
      const params = new URLSearchParams();

      if (province) params.append("province", province);
      if (group) params.append("group", group);
      if (party) params.append("party", party);
      if (name) params.append("name", name);
      if (surname) params.append("surname", surname);

      // Handle fullname by splitting into name + surname
      /*  if (fullname) {
        const parts = fullname.trim().split(" ");
        if (parts.length > 1) {
          params.append("name", parts[0]);
          params.append("surname", parts.slice(1).join(" "));
        } else {
          params.append("name", parts[0]);
        }
      }*/

      params.append("page", page.toString());
      params.append("limit", "10");

      const res = await fetch(`/api/nominees?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        const sorted = data.data.nominees.sort((a: Nominee, b: Nominee) => {
          // Primary sort: by votes (descending)
          if (a.votes !== b.votes) {
            return b.votes - a.votes; // Highest votes first
          }
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

        return {
          nominees: sorted,
          pagination: data.data.pagination,
        };
      }

      throw new Error("Failed to fetch nominees");
    },
  });
}

// Create a hook to get the query client for refetching
export function useRefetchNominees() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["nominees"] });
  };
}
