import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/Mainlayout";
import FallBackPageLoader from "../components/common/FallBackPageLoader";

// Lazy load all pages
const DashboardPage = lazy(() => import("../pages/Dashboard"));
const ProfilePage = lazy(() => import("../pages/Profile"));
const PageNotFoundPage = lazy(() => import("../pages/PageNotFound"));

// Route constants for type safety and maintainability
const ROUTES = {
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
} as const;

const PublicPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<FallBackPageLoader />}>{children}</Suspense>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* MAIN LAYOUT WRAPPER */}
      <Route
        path="/"
        element={
          <PublicPageWrapper>
            <MainLayout />
          </PublicPageWrapper>
        }
      >
        {/* Redirect / to /dashboard */}
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Dashboard */}
        <Route
          path={ROUTES.DASHBOARD}
          element={<DashboardPage />}
        />

        {/* Profile */}
        <Route
          path={ROUTES.PROFILE}
          element={<ProfilePage />}
        />
      </Route>

      {/* Page Not Found (outside MainLayout) */}
      <Route
        path="*"
        element={
          <PublicPageWrapper>
            <PageNotFoundPage />
          </PublicPageWrapper>
        }
      />
    </Routes>
  );
}
