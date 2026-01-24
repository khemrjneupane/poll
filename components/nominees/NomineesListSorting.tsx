"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useNominees, useRefetchNominees } from "@/app/hooks/useNominees";
import {
  BadgeCheck,
  Loader2,
  ThumbsUp,
  Trash2,
  DoorClosedLockedIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetIPResponse } from "@/types/vote";
import { fetchIPStatus } from "@/backend/lib/fetchApiStatus";
import { motion } from "framer-motion";
import { useDeviceIdentifiers } from "@/app/hooks/useDeviceIdentifiers";
import AddPopularCandidate from "../popular-candidates/AddPopularCandidate";
import AdminPMForm from "../approval_polls/AdminPMForm";
import UpdateNominee from "../admin/UpdateNominee";

const parties = [
  "Aam Aadmi Party Nepal",
  "Aam Janata Party",
  "Bahujan Ekata Party Nepal",
  "Bahujan Samaj Party Nepal",
  "Bahujan Shakti Party",
  "Bibeksheel Sajha Party",
  "Churebhawar Democratic Party",
  "CPN (Gauravshali)",
  "CPN (Maale)",
  "CPN (Marxist)",
  "CPN (Marxist_Pushpalal)",
  "CPN (Maoist Centre)",
  "CPN (Maoist_Socialist)",
  "CPN (Socialist)",
  "CPN (Unified Socialist)",
  "CPN Ekata National Campaign",
  "Democratic Party Nepal",
  "Democratic Socialist Party Nepal",
  "Deshbhakta Democratic Party Nepal",
  "Deshbhakta Samaj",
  "Federal Democratic National Forum",
  "Federal Development Party Nepal",
  "Federal Khumbuwan Democratic Party Nepal",
  "Federal Nepal Party",
  "Gandhian Party Nepal",
  "Hamro Nepali Party",
  "Historic Janata Party",
  "Inclusive Socialist Party Nepal",
  "Jan-Rastrawadi Party Nepal",
  "Janajagaran Party Nepal",
  "Janaprajatantrik Party Nepal",
  "Janata Janawadi Party Nepal",
  "Janata Progressive Party Nepal",
  "Janata Samajwadi Party Nepal",
  "Janasamajwadi Party Nepal",
  "Janasewa Democratic Party",
  "Jai Janmabhumi Party Nepal",
  "Khumbuwan National Front Nepal",
  "Lok Dal",
  "Maulik Jarokilo Party",
  "Madhes Tarai Forum",
  "Madhesi Janadhikar Forum Madhes",
  "Maoist Communist Party Nepal",
  "Maoist Janamukti Party Nepal",
  "Miteri Party Nepal",
  "Miteri Party Nepal",
  "Mongol National Organization",
  "Modern Nepal Socialist Party",
  "National Citizens Party",
  "National Development Party",
  "National Liberation Movement Nepal",
  "National Liberation Party Nepal",
  "National People-Oriented Democratic Party",
  "National Realist Party Nepal",
  "National Republic Nepal",
  "National Samata Party Nepal",
  "National Socialist Party Nepal",
  "National Unity Forum",
  "National Unity Party (Democratic)",
  "Nationalist Centre Nepal",
  "Nationalist Peoples Party",
  "Nationalist Unity Party",
  "National Sadbhawana Party",
  "Nepal Bibeksheel Party",
  "Nepal Communist Party",
  "Nepal Communist Party (Democratic)",
  "Nepal Communist Party Parivartan",
  "Nepal Democratic Party",
  "Nepal Federal Socialist Party",
  "Nepal Inclusive Party",
  "Nepal Janamukti Party",
  "Nepal Janata Dal",
  "Nepal Janata Party",
  "Nepal Janajagriti Party",
  "Nepal Matribhoomi Party",
  "Nepal Naya Janwadi Party",
  "Nepal Nationalist Party",
  "Nepal Pariwar Dal",
  "Nepal Socialist Congress",
  "Nepal Socialist Party (Lohiyawadi)",
  "Nepal Socialist Party (Naya Shakti)",
  "Nepal Workers and Peasants Party",
  "Nepalbad",
  "Nepali Congress",
  "Nepali Congress (BP)",
  "Nepali Greens Party",
  "Nepali for Nepal Party",
  "Nationalist Youth Front",
  "Parivartan Party",
  "Punarjagaran Party Nepal",
  "Progressive Democratic Party",
  "Progressive Socialist Party",
  "Rastriya Janata Party Nepal",
  "Rastriya Janamorcha",
  "Rastriya Matribhoomi Party",
  "Rastriya Prajatantra Party",
  "Rastriya Prajatantra Party Nepal",
  "Rastriya Sajha Party",
  "Rastriya Swatantra Party",
  "Shiv Sena Nepal",
  "Sachet Nepali Party",
  "Social Democratic Party",
  "Socialist Centre Nepal",
  "Socialist Party Nepal",
  "Terai-Madhes Democratic Party",
  "Trimul Nepal",
  "United Citizens Party",
  "United Nepal Democratic Party",
];

export default function NomineeListSorting({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [provinceSelect, setProvinceSelect] = useState("all");
  const [groupSelect, setGroupSelect] = useState("all");
  const [partySelect, setPartySelect] = useState("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [debouncedName, setDebouncedName] = useState(name);
  const [debouncedSurname, setDebouncedSurname] = useState(surname);
  const [authenticatingId, setAuthenticatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [votedNominee, setVotedNominee] = useState<string | null>(null);
  const [updateNomineeId, setUpdateNomineeId] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const canAdmin = isAdmin && userRole === "admin";
  const { fingerprint } = useDeviceIdentifiers();

  const refetchNominees = useRefetchNominees();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: votedStatus } = useQuery<GetIPResponse>({
    queryKey: ["ipStatus"],
    queryFn: fetchIPStatus,
  });

  useEffect(() => {
    const t1 = setTimeout(() => setDebouncedName(name.trim()), 400);
    const t2 = setTimeout(() => setDebouncedSurname(surname.trim()), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [name, surname]);

  const province = useMemo(
    () => (provinceSelect === "all" ? "" : provinceSelect),
    [provinceSelect],
  );
  const group = useMemo(
    () => (groupSelect === "all" ? "" : groupSelect),
    [groupSelect],
  );
  const party = useMemo(
    () => (partySelect === "all" ? "" : partySelect),
    [partySelect],
  );

  const { data, isLoading, error } = useNominees(
    page,
    sortOrder,
    province,
    group,
    debouncedName,
    debouncedSurname,
    party,
  );

  useEffect(() => {
    setPage(1);
  }, [province, group, party, sortOrder, debouncedName, debouncedSurname]);

  // DELETE handler
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/nominees/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Nominee deleted successfully");
        refetchNominees();
      } else toast.error(result.error || "Failed to delete nominee");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  // AUTHENTICATE handler
  const handleAuthenticate = async (nomineeId: string, approve: boolean) => {
    setAuthenticatingId(nomineeId);
    try {
      const res = await fetch(`/api/nominees/${nomineeId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approve }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(
          approve ? "Nominee authenticated" : "Authentication revoked",
        );
        refetchNominees();
      } else toast.error(result.error || "Failed to authenticate nominee");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAuthenticatingId(null);
    }
  };

  const handleVote = async (
    e: React.MouseEvent<HTMLButtonElement>,
    nomineeId: string,
  ) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/nominees/${nomineeId}/vote`, {
        method: "PUT",
        headers: {
          "x-fingerprint": fingerprint ? fingerprint : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        await update();
        toast.success("Your vote has been cast!");
        queryClient.invalidateQueries({ queryKey: ["nominees"] });
      } else toast.error(data.message || "Vote failed");
      setVotedNominee(nomineeId);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Filters */}
      <div className="rounded-2xl p-5 shadow border border-slate-200 dark:border-slate-700">
        <p className="text-3xl md:text-4xl font-semibold text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm p-1">
          Search for your favourite nominee by names, provience, party or
          independent.
        </p>
        <div className="flex flex-col md:flex-row justify-between gap-2 text-slate-50">
          <div>
            <label className="text-sm font-medium mb-1 ">First Name</label>
            <Input
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1">Surname</label>
            <Input
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1">Province</label>
            <Select value={provinceSelect} onValueChange={setProvinceSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Province 1">Province 1</SelectItem>
                <SelectItem value="Province 2">Province 2</SelectItem>
                <SelectItem value="Province 3">Province 3</SelectItem>
                <SelectItem value="Province 4">Province 4</SelectItem>
                <SelectItem value="Province 5">Province 5</SelectItem>
                <SelectItem value="Province 6">Province 6</SelectItem>
                <SelectItem value="Province 7">Province 7</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1">Group</label>
            <Select
              value={groupSelect}
              onValueChange={(v) => {
                setGroupSelect(v);
                setPartySelect("all");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="party">Party</SelectItem>
                <SelectItem value="independent">Independent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {groupSelect === "party" && (
            <div>
              <label className="text-sm font-medium mb-1">Party</label>
              <Select value={partySelect} onValueChange={setPartySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {parties.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Nominee Grid */}
      {isLoading && (
        <div className="text-center py-10 text-slate-500">
          Loading nominees…
        </div>
      )}
      {error && (
        <div className="text-center py-10 text-red-500">
          Error: {error.message}
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 `}>
        {data?.nominees
          ?.filter((n) => (canAdmin ? true : n.isApproved))
          .map((n, index) => {
            const hasVoted =
              (userId && n.voters?.some((v) => v.userId === userId)) ||
              votedNominee === n._id;

            return (
              <React.Fragment key={n._id}>
                <motion.div
                  className={`${
                    isAdmin
                      ? "p-5 flex flex-col items-center justify-center gap-5"
                      : ""
                  } `}
                  key={n._id}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{
                    scale: 1.03,
                    y: -4,
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {canAdmin && (
                    <button
                      className="min-w-[calc(300px)] text-2xl font-md  mb-3 text-white p-1 bg-blue-600/80  ring-1 ring-slate-500/80 rounded-2xl"
                      onClick={() => setUpdateNomineeId(n._id)}
                    >
                      {`Update ${n.name}`}
                    </button>
                  )}

                  <Card className="h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm p-1">
                    {/* ✅ Link wraps only main nominee info */}
                    <Link href={`/nominees/${n._id}`}>
                      <div className="p-5 flex items-center justify-center gap-5">
                        <div className="relative w-25 h-25 rounded-full overflow-hidden border-2 border-red-700">
                          {n.avatar?.url ? (
                            <Image
                              src={n.avatar.url}
                              alt={n.name}
                              width={180}
                              height={180}
                              className="w-24 h-24 object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-slate-400 text-xl font-bold bg-slate-100">
                              {n.name?.[0] || "?"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-lg font-semibold hover:underline">
                            {n.name} {n.surname}
                          </h3>
                          <p className="text-sm ">{n.party || "Independent"}</p>
                          <p className="">{`Area:  ${n.address.ward}`}</p>
                          <p className="">{`Province:  ${n.province}`}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-semibold">Votes: </span>
                            <span className="font-bold text-4xl text-blue-500">
                              {n.votes}
                            </span>
                          </div>
                        </div>

                        {!canAdmin && (
                          <div className="flex flex-col items-center justify-center gap-2">
                            {hasVoted ? (
                              <>
                                <Button
                                  variant="success"
                                  className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 text-white shadow-md"
                                >
                                  <ThumbsUp className="w-5 h-5" />
                                </Button>
                                <span className="text-xs text-green-600 font-medium">
                                  You Voted
                                </span>
                              </>
                            ) : !votedStatus?.youVotedNominee ? (
                              <>
                                <Button
                                  onClick={(e) => handleVote(e, n._id)}
                                  className="cursor-pointer rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                                >
                                  <ThumbsUp className="w-5 h-5" />
                                </Button>
                                <span className="cursor-pointer text-xs text-blue-600 font-medium">
                                  Vote Now
                                </span>
                              </>
                            ) : (
                              <>
                                <Button
                                  disabled
                                  className="rounded-full w-12 h-12 bg-slate-400 text-white shadow-md"
                                >
                                  <DoorClosedLockedIcon className="w-5 h-5" />
                                </Button>
                                <span className="text-xs text-slate-500 font-medium">
                                  Cannot Vote
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* ✅ Admin controls OUTSIDE Link */}
                    {canAdmin && (
                      <div className="border-t border-slate-200 p-4 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
                        <div
                          className={`text-sm font-medium ${
                            n.isApproved ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {n.isApproved ? "Authenticated" : "Pending Approval"}
                        </div>
                        <div className="flex gap-3">
                          {/* Approve / Revoke */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant={n.isApproved ? "outline" : "premium"}
                                size="sm"
                                disabled={authenticatingId === n._id}
                                className="cursor-pointer"
                              >
                                {authenticatingId === n._id ? (
                                  <Loader2 className="animate-spin w-4 h-4" />
                                ) : n.isApproved ? (
                                  "Revoke"
                                ) : (
                                  <>
                                    <BadgeCheck className="w-4 h-4 mr-1" />{" "}
                                    Verify
                                  </>
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {n.isApproved
                                    ? "Revoke authentication?"
                                    : "Authenticate nominee?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {n.isApproved
                                    ? "This will hide this nominee from public view."
                                    : "This will make this nominee visible to the public."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleAuthenticate(n._id, !n.isApproved)
                                  }
                                >
                                  {n.isApproved ? "Revoke" : "Authenticate"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* Delete */}
                          {!n.isApproved && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={deletingId === n._id}
                                  className="cursor-pointer shadow-md"
                                >
                                  {deletingId === n._id ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                  ) : (
                                    <>
                                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete nominee?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the nominee.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(n._id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
                {(index + 1) % 6 === 0 && (
                  <div
                    className="col-span-full text-slate-100 text-xl md:text-3xl w-full flex justify-center my-4"
                    key={`ad-${index}`}
                  >
                    <div className="ring-2 ring-slate-200 mx-2 p-6 w-full text-center  rounded-lg">
                      Free space
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </div>

      {!data?.nominees?.length && !isLoading && (
        <div className="text-center py-10 text-slate-500">
          No nominees found.
        </div>
      )}
      <div className="flex flex-wrap gap-6">
        {canAdmin && updateNomineeId && (
          <UpdateNominee nomineeId={updateNomineeId} />
        )}
        {canAdmin && <AdminPMForm />}

        {canAdmin && <AddPopularCandidate userRole={userRole || ""} />}
      </div>
    </div>
  );
}
