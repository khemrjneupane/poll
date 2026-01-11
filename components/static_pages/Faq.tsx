"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is Nepal Election?",
    a: "Nepal Election is an online platform where registered users in Nepal can nominate themselves or others, cast votes, and view results for the “Pre-Election 2025” event.",
  },
  {
    q: "Who can nominate or vote?",
    a: "Anyone who is registered on the platform may nominate or be nominated, depending on the rules of the specific event. To vote, you must have an account and meet any eligibility criteria defined for the event (such as residency, age, or membership in a group). The organiser reserves the right to verify eligibility and remove invalid entries.",
  },
  {
    q: "How do I create an account and login?",
    a: "Click the Login button in the header. If you don’t yet have an account, follow the “Sign Up” or “Register” link. Provide valid information and confirm via email. Once logged in, you can nominate, vote, and view results. Note: Make sure to upload your valid image, else registration verification will not succeed.",
  },
  {
    q: "How do I nominate someone (or myself)?",
    a: "Navigate to the Nominate section. Fill in nominee details and submit. Admins review and approve valid nominations which then appear in the Vote section. Note: Make sure you have authenticate image of the Noninee, else nomination verification will result in rejection.",
  },
  {
    q: "How does voting work?",
    a: "When voting is open, go to the Vote section, find your nominee using filters, and confirm your vote. Each user can cast the allowed number of votes, and votes cannot be changed once submitted.",
  },
  {
    q: "When and how are results displayed?",
    a: "After the voting period ends, results are shown in the Results section. Vote counts and winners update automatically once published by organisers.",
  },
  {
    q: "Is my vote anonymous?",
    a: "Yes. While the system tracks that you voted, it never shows your individual vote publicly — only aggregate counts are visible.",
  },
  {
    q: "Can I change my vote?",
    a: "No. Once confirmed, your vote cannot be changed or withdrawn. Review carefully before submission.",
  },
  {
    q: "How is the platform secured?",
    a: "The platform uses secure authentication, encrypted data transmission (HTTPS), and logs all voting activities to ensure integrity and fairness.",
  },
  {
    q: "What happens if there is a technical issue during voting?",
    a: "If technical issues occur, contact us via the Contact page. We will pause voting if necessary and ensure affected users can vote once the system is restored.",
  },
  {
    q: "What are the rules for nominees and voters?",
    a: "Nominees and voters must meet eligibility criteria. Any manipulation (e.g., multiple accounts or bots) leads to disqualification. Organiser decisions are final.",
  },
  {
    q: "Can I nominate or vote if I live abroad?",
    a: "Yes, if you meet the eligibility criteria (e.g., Nepali citizenship and registered province). Contact the organiser if unsure.",
  },
  {
    q: "How do I update my profile or account details?",
    a: "Log in, go to profile settings, and update allowed fields. For eligibility changes (like province), contact organisers. Invalid info may cause disqualification.",
  },
  {
    q: "What do I do if I forget my password?",
    a: "On the Login page, click 'Forgot Password', enter your email, and follow the reset link to set a new password.",
  },
  {
    q: "Where can I get help or ask questions?",
    a: "Use the Contact page to reach us, or review the Terms of Service and Privacy Policy for more details.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4 sm:px-8 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white hover:shadow-md transition-all"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex justify-between items-center px-6 py-5 text-left text-lg font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <span>{item.q}</span>
                <span className="ml-4">
                  {openIndex === i ? (
                    <ChevronUp className="text-blue-500" />
                  ) : (
                    <ChevronDown className="text-blue-500" />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-slate-50"
                  >
                    <div className="px-6 py-4 text-slate-700 leading-relaxed border-t border-slate-200">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
