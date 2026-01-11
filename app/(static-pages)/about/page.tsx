import { generateMetadatas } from "@/backend/lib/metadata";
import About from "@/components/static_pages/About";

import React from "react";

export const metadata = generateMetadatas({
  title: "About Vote Nepal",
  description:
    "Vote Nepal is a comprehensive platform providing transparent election information, candidate profiles, and voting resources to strengthen democracy in Nepal.",
  path: "/about",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "about Vote Nepal",
    "election platform Nepal",
    "democratic transparency",
    "voting resources Nepal",
    "election information system",
    "candidate database Nepal",
  ],
});
const page = () => {
  return <About />;
};

export default page;
