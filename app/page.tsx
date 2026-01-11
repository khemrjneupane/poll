import BreakingNewsTicker from "@/components/news/brk_news/BreakingNewsTicker";
import NomineesListSorting from "@/components/nominees/NomineesListSorting";
import { Results } from "@/components/Results";
import ElectionNotices from "./ElectionCard";
import ElectionCountdown from "@/components/timer/ElectionCountDown";
import PopularCandidatesList from "@/components/popular-candidates/PopularCandidateList";
//import AdUnitOne from "@/components/google-ads/AdUnitOne";
import ApprovalPollComponent from "@/components/approval_polls/ApprovalPoll";
import AdBanner from "@/components/google-ads/AdBanner";

export default function Home() {
  return (
    <>
      <BreakingNewsTicker />

      {/* Main Page Wrapper */}
      <div className=" py-4 w-full  flex flex-col items-center gap-6">
        <ApprovalPollComponent />
        <PopularCandidatesList />
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="1833501068964247"
        />

        <div className="flex xl:hidden w-full">
          <ElectionCountdown />
        </div>
        {/* 2-column layout on XL */}
        <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-8 w-full">
          <div className="w-full">
            <Results type="home" />
            <NomineesListSorting />
          </div>

          <div className="flex justify-center w-full xl:w-auto">
            <ElectionNotices />
          </div>
        </div>
      </div>
    </>
  );
}
