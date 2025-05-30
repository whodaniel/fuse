import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import Landing from './pages/Landing';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/core/ProtectedRoute';
import PublicRoute from './components/core/PublicRoute';
import Loading from './components/Loading';

// Import directly loaded pages
import TestPage from './pages/Test';
import DebugPage from './pages/Debug';

// Lazy-loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const SSO = lazy(() => import('./pages/auth/SSO'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Home = lazy(() => import('./pages/Home'));
const AIAgentPortal = lazy(() => import('./pages/AIAgentPortal'));

// UI Component pages
const ComponentsNav = lazy(() => import('./pages/ComponentsNav'));
const ComponentsShowcase = lazy(() => import('./pages/ComponentsShowcase'));
const LayoutExample = lazy(() => import('./pages/LayoutExample'));

const Chat = lazy(() => import('./pages/Chat'));
// Feature pages
const TimelineDemo = lazy(() => import('./pages/TimelineDemo'));
const GraphDemo = lazy(() => import('./pages/graph-demo'));
const Analytics = lazy(() => import('./pages/Analytics'));



// Task pages
const Tasks = lazy(() => import('./pages/Tasks'));
const TaskDetail = lazy(() => import('./pages/Tasks/Detail'));
const NewTask = lazy(() => import('./pages/Tasks/New'));
const EditTask = lazy(() => import('./pages/Tasks/Edit'));

// Suggestion pages
const Suggestions = lazy(() => import('./pages/Suggestions'));
const SuggestionDetail = lazy(() => import('./pages/Suggestions/Detail'));
const NewSuggestion = lazy(() => import('./pages/Suggestions/New'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Users = lazy(() => import('./pages/Admin/Users'));
const Workspaces = lazy(() => import('./pages/Admin/Workspaces'));
const SystemHealth = lazy(() => import('./pages/Admin/SystemHealth'));
const AdminSettings = lazy(() => import('./pages/Admin/Settings'));

// Settings pages
const General = lazy(() => import('./pages/settings/General'));
const Appearance = lazy(() => import('./pages/settings/Appearance'));
const API = lazy(() => import('./pages/settings/API'));
const Security = lazy(() => import('./pages/settings/Security'));
const Notifications = lazy(() => import('./pages/settings/Notifications'));
const EmbeddingPreference = lazy(() => import('./pages/GeneralSettings/EmbeddingPreference'));

// Workspace pages
const WorkspaceOverview = lazy(() => import('./pages/workspace/Overview'));
const WorkspaceMembers = lazy(() => import('./pages/workspace/Members'));
const WorkspaceAnalytics = lazy(() => import('./pages/workspace/Analytics'));
const WorkspaceSettings = lazy(() => import('./pages/workspace/Settings'));

// Legal pages
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));

// Onboarding pages
const OnboardingFlow = lazy(() => import('./pages/OnboardingFlow'));

// Simple error boundary component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="text-gray-800 mb-4">We encountered an error while loading the application.</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-w-full">
        {error.message}
      </pre>
      <button
        type="button"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => window.location.href = '/'}
      >
        Go to Home Page
      </button>
    </div>
  );
}

export default function Router() {
  const location = useLocation();
  const [error, setError] = useState<Error | null>(null);

  // Reset error when location changes
  useEffect(() => {
    setError(null);
  }, [location.pathname]);

  // If there's an error, show the error fallback
  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <Routes>
      {/* Public routes outside of MainLayout */}
      <Route path="/" element={<Landing />} />

      {/* Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/test" element={<TestPage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/home" element={
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        } />

        {/* UI Components routes */}
        <Route path="/ui" element={
          <Suspense fallback={<Loading />}>
            <ComponentsNav />
          </Suspense>
        } />
        <Route path="/components" element={
          <Suspense fallback={<Loading />}>
            <ComponentsShowcase />
          </Suspense>
        } />
        <Route path="/layout-example" element={
          <Suspense fallback={<Loading />}>
            <LayoutExample />
          </Suspense>
        } />
        <Route path="/chat" element={
          <Suspense fallback={<Loading />}>
            <Chat />
          </Suspense>
        } />

        {/* Auth routes */}
        <Route path="auth" element={<PublicRoute />}>
          <Route path="login" element={<Suspense fallback={<Loading />}><Login /></Suspense>} />
          <Route path="register" element={<Suspense fallback={<Loading />}><Register /></Suspense>} />
          <Route path="forgot-password" element={<Suspense fallback={<Loading />}><ForgotPassword /></Suspense>} />
          <Route path="reset-password/:token" element={<Suspense fallback={<Loading />}><ResetPassword /></Suspense>} />
          <Route path="sso/:provider" element={<Suspense fallback={<Loading />}><SSO /></Suspense>} />
        </Route>

        {/* Legal pages */}
        <Route path="legal">
          <Route path="privacy-policy" element={<Suspense fallback={<Loading />}><PrivacyPolicy /></Suspense>} />
          <Route path="terms-of-service" element={<Suspense fallback={<Loading />}><TermsOfService /></Suspense>} />
        </Route>

        {/* Demo routes - publicly accessible */}
        <Route path="timeline-demo" element={<Suspense fallback={<Loading />}><TimelineDemo /></Suspense>} />
        <Route path="graph-demo" element={<Suspense fallback={<Loading />}><GraphDemo /></Suspense>} />
        <Route path="test" element={<TestPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Main dashboard */}
          <Route path="dashboard" element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<Loading />}><Analytics /></Suspense>} />
          <Route path="ai-portal" element={<Suspense fallback={<Loading />}><AIAgentPortal /></Suspense>} />

          {/* Onboarding */}
          <Route path="onboarding" element={<Suspense fallback={<Loading />}><OnboardingFlow /></Suspense>} />

          {/* Admin section */}
          <Route path="admin">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Suspense fallback={<Loading />}><AdminDashboard /></Suspense>} />
            <Route path="users" element={<Suspense fallback={<Loading />}><Users /></Suspense>} />
            <Route path="workspaces" element={<Suspense fallback={<Loading />}><Workspaces /></Suspense>} />
            <Route path="system-health" element={<Suspense fallback={<Loading />}><SystemHealth /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<Loading />}><AdminSettings /></Suspense>} />
          </Route>

          {/* Settings section */}
          <Route path="settings">
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<Suspense fallback={<Loading />}><General /></Suspense>} />
            <Route path="appearance" element={<Suspense fallback={<Loading />}><Appearance /></Suspense>} />
            <Route path="api" element={<Suspense fallback={<Loading />}><API /></Suspense>} />
            <Route path="security" element={<Suspense fallback={<Loading />}><Security /></Suspense>} />
            <Route path="notifications" element={<Suspense fallback={<Loading />}><Notifications /></Suspense>} />
            <Route path="embedding" element={<Suspense fallback={<Loading />}><EmbeddingPreference /></Suspense>} />
          </Route>

          {/* Workspace section */}
          <Route path="workspace/:workspaceId">
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Suspense fallback={<Loading />}><WorkspaceOverview /></Suspense>} />
            <Route path="members" element={<Suspense fallback={<Loading />}><WorkspaceMembers /></Suspense>} />
            <Route path="analytics" element={<Suspense fallback={<Loading />}><WorkspaceAnalytics /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<Loading />}><WorkspaceSettings /></Suspense>} />
          </Route>
        </Route>

        {/* 404 page */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
            <div className="flex gap-4">
              <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Go Home
              </Link>
              <Link to="/debug" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Debug Info
              </Link>
            </div>
          </div>
        } />
      </Route>
    </Routes>
  );
}
