"use client";
import { Nominee, Pagination, useNominees } from "@/app/hooks/useNominees";
import { useState } from "react";
import LeaderBoard from "./leader_board/LeaderBoard";
import NomineesTable from "./nominees/NomineesTable";
import { VotedNominatedStatusProps } from "@/types/vote";

const Results = ({ type }: VotedNominatedStatusProps) => {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const { data: nomineesData, isLoading, error } = useNominees(page, "desc");
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };
  const approvedNominees: Nominee[] = nomineesData?.nominees || [];
  const pagination: Pagination | null = nomineesData?.pagination || null;
  const nominees = approvedNominees.filter((nominee) => nominee.isApproved);

  return (
    <section className="p-6 space-y-6 rounded-2xl shadow-2xl relative overflow-hidden">
      {type !== "home" && <LeaderBoard />}

      <div className="text-sm font-mono rounded-lg">
        <NomineesTable
          nominees={nominees}
          loading={isLoading}
          page={page}
          pagination={pagination}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          setPage={setPage}
          type={type}
        />
      </div>
    </section>
  );
};
export { Results };
