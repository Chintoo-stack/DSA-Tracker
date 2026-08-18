import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RequireUser } from "./components/RequireUser";
import { SessionProvider } from "./lib/session";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { PlusPage } from "./pages/PlusPage";
import { ProblemPage } from "./pages/ProblemPage";
import { ProblemsPage } from "./pages/ProblemsPage";

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                <RequireUser>
                  <DashboardPage />
                </RequireUser>
              }
            />
            <Route
              path="/problems"
              element={
                <RequireUser>
                  <ProblemsPage />
                </RequireUser>
              }
            />
            <Route
              path="/problems/:slug"
              element={
                <RequireUser>
                  <ProblemPage />
                </RequireUser>
              }
            />
            <Route
              path="/plus"
              element={
                <RequireUser>
                  <PlusPage />
                </RequireUser>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}
