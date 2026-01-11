"use client";
import { useEffect, useState } from "react";
import NomineesList from "./nominees/NomineesList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader, Loader2, Users } from "lucide-react";
import Voted from "./nominees/Voted";
import Nomineted from "@/components/Nominated";
import {
  useNominees,
  type Nominee,
  type Pagination,
} from "@/app/hooks/useNominees";
import VotedNominatedStatus from "./VoterStatus";
//import { useNominees, type Nominee, type Pagination } from "@/hooks/useNominees";

const Vote = () => {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // default: latest first

  // Use TanStack Query hook instead of manual state management
  const { data: nomineesData, isLoading, error } = useNominees(page, sortOrder);

  const router = useRouter();
  /*
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [router, session]);
*/
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Extract data from TanStack Query
  const nominees: Nominee[] = nomineesData?.nominees || [];
  const pagination: Pagination | null = nomineesData?.pagination || null;

  return (
    <section className="mx-auto p-4 text-slate-900/80">
      <div className="flex flex-col md:flex-row md:justify-around md:items-center mb-6 gap-4 max-w-6xl mx-auto p-4">
        <VotedNominatedStatus type="voted" />
        <VotedNominatedStatus type="nominated" />
      </div>

      {isLoading && nominees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" />
          <p className="mt-4 text-lg text-slate-600">Loading nominees...</p>
        </div>
      ) : nominees.length > 0 ? (
        <>
          <NomineesList
            nominees={nominees}
            loading={isLoading}
            page={page}
            pagination={pagination}
            sortOrder={sortOrder}
            toggleSortOrder={toggleSortOrder}
            setPage={setPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-slate-400 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Nominees Found
            </h3>
            <p className="text-slate-600">
              There are currently no nominees to display. Check back later or
              add some nominees.
            </p>
            <Loader className="animate-spin mx-auto mt-6 h-8 w-8 text-blue-500" />
          </div>
        </div>
      )}
    </section>
  );
};

export { Vote };
