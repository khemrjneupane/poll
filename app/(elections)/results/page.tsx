import { generateMetadatas } from "@/backend/lib/metadata";
import { Results } from "@/components/Results";
import React from "react";

export const metadata = generateMetadatas({
  title: "Election Results",
  description:
    "Latest and historical election results in Nepal. Track live results, constituency outcomes, party performances, and comprehensive election analytics.",
  path: "/results",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "election results Nepal",
    "vote results",
    "election outcomes",
    "live results",
    "constituency results",
    "election analytics",
    "results tracking",
    "election data Nepal",
  ],
});
const page = () => {
  return (
    <div className="min-h-screen  py-8">
      <Results />
    </div>
  );
};

export default page;
