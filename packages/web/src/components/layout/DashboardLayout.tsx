import { ReactNode, useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { BlueprintGridBg } from './BlueprintGridBg';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [globalMouse, setGlobalMouse] = useState({ x: -999, y: -999 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setGlobalMouse({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div className="min-h-screen bg-cream relative" onMouseMove={handleMouseMove}>
      <BlueprintGridBg mouse={globalMouse} />
      <div className="relative z-10">
        <Sidebar />
        <main className="ml-[60px] p-6">
          <div className="bento-grid">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
