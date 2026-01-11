import { generateMetadatas } from "@/backend/lib/metadata";
import AddNominees from "@/components/nominees/AddNominees";
import React from "react";

export const metadata = generateMetadatas({
  title: "Election Nominees",
  description:
    "View all official election nominees in Nepal. Access comprehensive profiles, nomination details, and track candidate selection processes across constituencies. Nomimate your favourite candidate.",
  path: "/nominees",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "election nominees Nepal",
    "candidate nominations",
    "nomination process",
    "election candidates list",
    "nominee profiles",
    "candidate selection Nepal",
    "political nominations",
  ],
});
const page = () => {
  return (
    <main className="p-8">
      <AddNominees />
    </main>
  );
};

export default page;
