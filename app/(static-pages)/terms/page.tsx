import { generateMetadatas } from "@/backend/lib/metadata";
import Terms from "@/components/static_pages/Terms";
import React from "react";

export const metadata = generateMetadatas({
  title: "Terms of Service",
  description:
    "Read the terms and conditions governing your use of Vote Nepal's election information platform, services, and content usage policies.",
  path: "/terms",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "terms of service",
    "user agreement",
    "platform terms",
    "service conditions",
    "Vote Nepal terms",
    "usage policies",
  ],
});
const page = () => {
  return <Terms />;
};

export default page;
