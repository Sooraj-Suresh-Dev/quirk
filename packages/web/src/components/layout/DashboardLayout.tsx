import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="relative z-10">
        <Sidebar />
        <main className="md:ml-[60px] p-4 pb-24 md:pb-6 md:p-6">
          <div className="bento-grid">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
