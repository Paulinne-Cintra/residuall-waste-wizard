
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarDashboard /> 
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
