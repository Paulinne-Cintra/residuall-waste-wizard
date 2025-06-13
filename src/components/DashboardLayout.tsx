
import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// Lazy load do sidebar para melhor performance
const AnimatedSidebar = React.lazy(() => import('./AnimatedSidebar'));

const DashboardLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Suspense 
        fallback={
          <div className="w-64 bg-residuall-green animate-pulse">
            <div className="p-4 space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-10 bg-white/20 rounded"></div>
              ))}
            </div>
          </div>
        }
      >
        <AnimatedSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
