
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-residuall-gray-light">
      <SidebarDashboard />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
