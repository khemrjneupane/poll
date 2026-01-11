import { generateMetadatas } from "@/backend/lib/metadata";
import { Vote } from "@/components/Vote";
import React from "react";

export const metadata = generateMetadatas({
  title: "How to Vote",
  description:
    "Complete guide on voting procedures in Nepal. Learn voting steps, required documents, voting rights, and everything you need for successful election participation.",
  path: "/vote",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "how to vote Nepal",
    "voting procedures",
    "voting guide",
    "election process Nepal",
    "voting steps",
    "voter education",
    "election participation",
    "voting rights Nepal",
  ],
});
const page = () => {
  return (
    <div className="min-h-screen py-18">
      <Vote />
    </div>
  );
};

export default page;
