import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PageTooltips } from '@/components/ui/PageTooltips';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [forceShow, setForceShow] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setForceShow(false);
  }, [pathname]);

  const handleHelpClick = () => {
    setForceShow(true);
  };

  const handleDismiss = () => {
    setForceShow(false);
  };

  return (
    <>
      <Sidebar onHelpClick={handleHelpClick} />
      {children}
      <PageTooltips pathname={pathname} forceShow={forceShow} onDismiss={handleDismiss} />
    </>
  );
}
