"use client";

import {
  ArrowBigRight,
  ArrowUpDown,
  Check,
  CheckCircle,
  CircleX,
  TicketCheckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  address: {
    ward: string;
  };
}
export interface SingleVotedNomineeProps {
  nominees: Nominee[];
}
interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface NomineesTableProps {
  nominees: Nominee[];
  loading: boolean;
  page: number;
  pagination: Pagination | null;
  sortOrder: "desc" | "asc";
  toggleSortOrder: () => void;
  setPage: React.Dispatch<React.SetStateAction<number>>; // <-- fix
  type?: string;
}

const NomineesTable = ({
  nominees,
  loading,
  page,
  pagination,
  sortOrder,
  toggleSortOrder,
  setPage,
  type,
}: NomineesTableProps) => {
  return (
    <div className="text-slate-100">
      <div className="flex flex-wrap items-center justify-center gap-4 text-center">
        <h1 className="text-sm md:text-2xl font-extrabold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
          Is your favourite nominee missing?
        </h1>

        <Link
          href="/nominees"
          className="flex items-center justify-center gap-2"
        >
          <span className="text-sm md:text-2xl font-extrabold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
            Click to nominate
          </span>
          <ArrowBigRight className="w-8 h-6 text-green-500" />
        </Link>
      </div>

      <h1 className="hidden md:block pb-6 text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm mt-6">
        Vote ranking table
      </h1>
      <h1 className="block md:hidden pb-6 text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm mt-6">
        Vote ranking cards
      </h1>

      {/*type !== "home" && (
      <button
        onClick={toggleSortOrder}
        className="flex items-center gap-2 text-lg transition cursor-pointer"
      >
        <ArrowUpDown className="w-4 h-4" />
        {sortOrder === "desc" ? "Latest → Oldest" : "Oldest → Latest"}
      </button>
    )*/}

      {loading ? (
        <p>Loading nominees...</p>
      ) : (
        <>
          {/* ===========================
            DESKTOP TABLE (md and up)
        ============================ */}
          <div className="overflow-x-auto hidden md:flex">
            <table className="w-full">
              <thead className="bg-gray-900/90 text-white">
                <tr>
                  <th className="border px-4 py-2">Nominee</th>
                  <th className="border px-4 py-2">Full Name</th>
                  {/* <th className="border px-4 py-2">Age</th> */}
                  <th className="border px-4 py-2">Party/Independent</th>
                  <th className="border px-4 py-2">Province</th>
                  <th className="border px-4 py-2">Area</th>
                  <th className="border px-4 py-2">Votes Ranking</th>
                </tr>
              </thead>

              <tbody>
                {nominees.map((nominee) => (
                  <tr key={nominee._id} className="border-b">
                    <td className="border px-4 py-2">
                      {nominee.avatar?.url ? (
                        <Link href={`/nominees/${nominee._id}`}>
                          <Image
                            src={nominee.avatar.url}
                            alt={nominee.name}
                            className="h-12 w-12 rounded-full object-cover border"
                            width={64}
                            height={64}
                          />
                        </Link>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl border">
                          {nominee.name[0]}
                        </div>
                      )}
                    </td>

                    <td className="border px-4 py-2">
                      {nominee.name} {nominee.surname}
                    </td>

                    {/* <td className="border px-4 py-2">{nominee.age}</td> */}
                    <td className="border px-4 py-2">{nominee.party}</td>
                    <td className="border px-4 py-2">{nominee.province}</td>
                    <td className="border px-4 py-2">{nominee.address.ward}</td>

                    <td className="border px-4 py-2">
                      <div className="flex items-center gap-1">
                        <span>{nominee.votes}</span>
                        {nominee.votes > 0 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <CircleX className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===========================
            MOBILE CARD VIEW (below md)
        ============================ */}
          <div className="md:hidden flex justify-center items-center flex-wrap gap-6 space-y-4">
            {nominees.map((nominee) => (
              <div
                key={nominee._id}
                className="bg-gray-800 text-white p-4  w-full rounded-lg shadow border border-gray-700"
              >
                {/* Image + Name */}
                <div className="flex items-center gap-3">
                  {nominee.avatar?.url ? (
                    <Link href={`/nominees/${nominee._id}`}>
                      <Image
                        src={nominee.avatar.url}
                        alt={nominee.name}
                        className="h-14 md:w-14 rounded-full object-cover border"
                        width={64}
                        height={64}
                      />
                    </Link>
                  ) : (
                    <div className="h-14 w-14 bg-gray-300 text-black rounded-full flex items-center justify-center text-2xl">
                      {nominee.name[0]}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold">
                      {nominee.name} {nominee.surname}
                    </h3>
                    <p className="text-sm text-gray-300">{nominee.party}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1 text-sm">
                  {/* <p>
                    <span className="font-semibold">Age:</span> {nominee.age}
                  </p> */}

                  <p>
                    <span className="font-semibold">Province:</span>{" "}
                    {nominee.province}
                  </p>
                  <p>
                    <span className="font-semibold">Area:</span>{" "}
                    {nominee.address.ward}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="font-semibold">Votes:</span>{" "}
                    {nominee.votes}
                    {nominee.votes > 0 ? (
                      <CheckCircle className="text-green-400 w-4 h-4" />
                    ) : (
                      <CircleX className="text-gray-400 w-4 h-4" />
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => setPage(Math.max(page - 1, 1))}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 border rounded ${
                      page === p ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                onClick={() => setPage(Math.min(page + 1, pagination.pages))}
                disabled={!pagination.hasNext}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NomineesTable;
