import { generateMetadatas } from "@/backend/lib/metadata";
import Faq from "@/components/static_pages/Faq";
import React from "react";

export const metadata = generateMetadatas({
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about Vote Nepal platform, election information access, candidate data, voting procedures, and how to use our democratic tools.",
  path: "/faq",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "FAQ Vote Nepal",
    "election questions",
    "voting information help",
    "candidate data FAQ",
    "platform usage guide",
    "democratic tools help",
  ],
});
const page = () => {
  return <Faq />;
};

export default page;
