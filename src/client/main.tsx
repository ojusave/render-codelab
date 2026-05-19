import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Spinner } from "./components/ui";
import "./index.css";

const LandingPage = lazy(() =>
  import("./pages/Landing").then((m) => ({ default: m.LandingPage })),
);
const StudentLabPage = lazy(() =>
  import("./pages/StudentLab").then((m) => ({ default: m.StudentLabPage })),
);
const TutorDashboardPage = lazy(() =>
  import("./pages/TutorDashboard").then((m) => ({ default: m.TutorDashboardPage })),
);

const defaultSession =
  import.meta.env.VITE_DEFAULT_SESSION_CODE?.trim() || "cascadia-2026";

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] text-[#5f6368]">
      <Spinner size="lg" />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/s/:sessionCode" element={<StudentLabPage />} />
            <Route path="/tutor/:sessionCode" element={<TutorDashboardPage />} />
            <Route
              path="/workshop"
              element={<Navigate to={`/s/${encodeURIComponent(defaultSession)}`} replace />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
