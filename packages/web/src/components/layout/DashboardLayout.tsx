import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function DashboardLayout({ leftPanel, rightPanel }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-[60px] flex min-h-screen">
        <div className="w-[40%] border-r-3 border-deep-black p-6 overflow-y-auto">
          {leftPanel}
        </div>
        <div className="w-[60%] p-6 overflow-y-auto">
          {rightPanel}
        </div>
      </main>
    </div>
  );
}
