"use client";

import { fetchIPStatus } from "@/backend/lib/fetchApiStatus";
import { GetIPResponse } from "@/types/vote";
import { useQuery } from "@tanstack/react-query";
import { Home, AlertCircle, CheckCircle, Info } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Nomineted() {
  const { data, isLoading, isError, error } = useQuery<GetIPResponse>({
    queryKey: ["ipStatus"],
    queryFn: fetchIPStatus,
  });

  return (
    <div className="mx-auto space-y-6">
      {/* AlertDialog for Nomination Status */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex items-center justify-between bg-white shadow-lg border-l-4 border-blue-500 rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  Nomination Status
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {data?.youNominatedNominee
                    ? "View your nomination details"
                    : "Check your nomination status"}
                </p>
              </div>
            </div>
            <Info className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                {data?.youNominatedNominee ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <AlertDialogTitle className="text-xl font-bold text-gray-900">
                Nomination Status
              </AlertDialogTitle>
            </div>

            <AlertDialogDescription className="text-gray-700 text-base">
              {data?.youNominatedNominee ? (
                <>
                  <span className="block mb-3">
                    ✅ You have already nominated{" "}
                    <span className="font-semibold text-blue-600 block mt-1">
                      {data.youNominatedNominee.name.toUpperCase()}{" "}
                      {data.youNominatedNominee.surname.toUpperCase()}
                    </span>
                    <span className="text-gray-600">
                      ({data.youNominatedNominee.party})
                    </span>
                  </span>
                  <span className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3 block">
                    <span className="text-red-700 font-medium text-sm">
                      You cannot nominate anyone else.
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-600 italic block mb-3">
                    {data?.messageNominated ??
                      "You have not nominated anyone yet."}
                  </span>
                  <span className="bg-blue-50 border border-blue-200 rounded-lg p-3 block">
                    <span className="text-blue-700 text-sm">
                      You can nominate candidates until you submit your final
                      choice.
                    </span>
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6">
            <AlertDialogAction asChild>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
