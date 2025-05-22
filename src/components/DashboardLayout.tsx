
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-residuall-gray-light">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
