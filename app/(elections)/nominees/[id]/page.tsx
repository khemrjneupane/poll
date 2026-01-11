import { generateMetadatas } from "@/backend/lib/metadata";
import UpdateNominee from "@/components/admin/UpdateNominee";
import AnomineeById from "@/components/nominees/AnomineeById";
import React from "react";

export const metadata = generateMetadatas({
  title: "Election Nominee",
  description: "View nominee information and election details.",
  path: `/nominees`,
  ogImage: "/assets/og-nominee-default.png",
  type: "profile",
});
const page = () => {
  return (
    <div>
      <AnomineeById />
      {/* <UpdateNominee /> */}
    </div>
  );
};

export default page;
