import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AuthModalProvider } from '@/lib/auth-modal';
import { ToastProvider } from '@/lib/toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/about" element={<About />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
      <Route path="/generate/:trendId" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
      <Route path="/voice" element={<ProtectedRoute><Voice /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>
          <ToastProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </ToastProvider>
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
