import React from "react";
import HeaderManage from "../components/Manage/HeaderManage";
import { Outlet } from "react-router-dom";

const ManageLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <HeaderManage />
      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageLayout;
