// import React from "react";
import StatsRow from "../components/dashboard/statRow";
import ProfileCard from "../components/dashboard/profileCard";
import HighlightBanner from "../components/dashboard/highlightBanner";
import TopEarnersList from "../components/dashboard/topEarnersList";
import PaymentChart from "../components/dashboard/paymentChart";
import SmartPurchasePlan from "../components/dashboard/smartPurchase";
import Rewards from "../components/dashboard/rewards";
import Levels from "../components/dashboard/levels";
import Overview from "../components/dashboard/overview";


export default function Dashboard() {
  return (
    <div className=" min-h-screen font-sans text-gray-800">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-7 gap-6">
        {/* Left Column (Spans 2 on desktop) */}
        <div className="xl:col-span-5 space-y-6">
          <ProfileCard />
          <StatsRow />
          <HighlightBanner />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <TopEarnersList />
            <PaymentChart />
          </div>
        </div>

        {/* Right Column (Spans 1 on desktop) */}
        <div className="xl:col-span-2 space-y-6">
          <SmartPurchasePlan />
          <Rewards />
          <Levels />

          {/* Overview stub to match bottom of image */}
          <Overview />
        </div>
      </div>
    </div>
  );
}
