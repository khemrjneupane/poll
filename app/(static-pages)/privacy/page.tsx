import { generateMetadatas } from "@/backend/lib/metadata";
import PrivacyPolicy from "@/components/static_pages/PrivacyPolicy";
import React from "react";
// app/privacy/page.tsx

export const metadata = generateMetadatas({
  title: "Privacy Policy",
  description:
    "Learn how Vote Nepal protects your privacy, handles personal data, and ensures security while providing election information services in Nepal.",
  path: "/privacy",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "privacy policy",
    "data protection Nepal",
    "election data privacy",
    "user data security",
    "Vote Nepal privacy",
    "information security",
  ],
});
const page = () => {
  return <PrivacyPolicy />;
};

export default page;
