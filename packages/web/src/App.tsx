import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AuthModalProvider } from '@/lib/auth-modal';
import { ToastProvider } from '@/lib/toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { Landing } from '@/pages/Landing';
import { SetPassword } from '@/pages/SetPassword';
import { Dashboard } from '@/pages/Dashboard';
import { Discover } from '@/pages/Discover';
import { Library } from '@/pages/Library';
import { Voice } from '@/pages/Voice';
import { Settings } from '@/pages/Settings';
import { Generate } from '@/pages/Generate';
import { About } from '@/pages/About';
import { Pricing } from '@/pages/Pricing';
import { Features } from '@/pages/Features';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { FAQ } from '@/pages/FAQ';
import { NotFound } from '@/pages/NotFound';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuestOnlyRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function AppRoutes() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route element={<GuestOnlyRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
      <Route path="/generate/:trendId" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
      <Route path="/voice-training" element={<ProtectedRoute><Voice /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AuthModalProvider>
            <ToastProvider>
            <ErrorBoundary>
              <PageViewTracker />
              <AppRoutes />
              </ErrorBoundary>
            </ToastProvider>
          </AuthModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
