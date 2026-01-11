import { generateMetadatas } from "@/backend/lib/metadata";
import ContactForm from "@/components/contact_form/ContactForm";
import React from "react";

export const metadata = generateMetadatas({
  title: "Contact Us",
  description:
    "Get in touch with Vote Nepal team for election information inquiries, partnership opportunities, feedback, or technical support. We're here to help strengthen democracy.",
  path: "/contact",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "contact Vote Nepal",
    "election information support",
    "partnership opportunities",
    "feedback platform",
    "technical support election",
    "democracy collaboration",
  ],
});
const page = () => {
  return <ContactForm />;
};

export default page;
