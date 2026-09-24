import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useLayoutEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AuthModalProvider } from '@/lib/auth-modal';
import { ToastProvider } from '@/lib/toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { Landing } from '@/pages/Landing';

const SetPassword = lazy(() => import('@/pages/SetPassword').then((m) => ({ default: m.SetPassword })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Discover = lazy(() => import('@/pages/Discover').then((m) => ({ default: m.Discover })));
const Library = lazy(() => import('@/pages/Library').then((m) => ({ default: m.Library })));
const Voice = lazy(() => import('@/pages/Voice').then((m) => ({ default: m.Voice })));
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })));
const Generate = lazy(() => import('@/pages/Generate').then((m) => ({ default: m.Generate })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));
const Pricing = lazy(() => import('@/pages/Pricing').then((m) => ({ default: m.Pricing })));
const Features = lazy(() => import('@/pages/Features').then((m) => ({ default: m.Features })));
const Privacy = lazy(() => import('@/pages/Privacy').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('@/pages/Terms').then((m) => ({ default: m.Terms })));
const FAQ = lazy(() => import('@/pages/FAQ').then((m) => ({ default: m.FAQ })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

const RouteFallback = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Loading...
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuestOnlyRoute() {
  const { user } = useAuth();
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
                <Suspense fallback={RouteFallback}>
                  <AppRoutes />
                </Suspense>
              </ErrorBoundary>
            </ToastProvider>
          </AuthModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
