import React from "react";
import { Outlet } from "react-router-dom";
import HeaderLanding from "../components/LandingPage/HeaderLanding";
import FooterLanding from "../components/LandingPage/FooterLanding";
const LandingPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <HeaderLanding />
      </div>
      <div className="mt-[129px] flex-1 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LandingPageLayout;
