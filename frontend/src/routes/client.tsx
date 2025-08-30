import {
  CaseStudiesPage,
  ClientLayout,
  ForgotPassword,
  Login,
  PortfolioPage,
  ProtectedRoute,
  ResetPassword,
  TestimonialsPage,
  UnProtectedRoute,
} from "@/pages";
import ChatPage from "@/pages/chat/chatPage";
import ClientDashboard from "@/pages/dashboard/clientDashboard";
import Integrations from "@/pages/integrations/IntegrationsPage";
import Invoices from "@/pages/common/Invoices";
import Overdues from "@/pages/common/Overdues";
import Payments from "@/pages/common/Payments";
import { Route, Routes } from "react-router-dom";
import Media from "@/pages/media/MediaPage";
import Inbox from "@/components/common/inbox";
import SettingsPage from "@/pages/settings/settings";
import Projects from "@/pages/agency/projects";
import LeadsPage from "@/pages/leads/LeadsPage";
import Contents from "@/pages/contents/contentsPage";

export function ClientRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute role={"client"}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="contents" element={<Contents />} />
        <Route path="messages" element={<ChatPage />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="invoices/payments" element={<Payments />} />
        <Route path="invoices/overdue" element={<Overdues />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="work/portfolio" element={<PortfolioPage />} />
        <Route path="work/case-studies" element={<CaseStudiesPage />} />
        <Route path="work/testimonials" element={<TestimonialsPage />} />

        <Route path="media" element={<Media />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="projects" element={<Projects />} />
        <Route path="leads" element={<LeadsPage />} />
      </Route>

      <Route
        path="/login"
        element={
          <UnProtectedRoute role={"client"}>
            <Login role={"client"} />
          </UnProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword role={"client"} />}
      />
      <Route
        path="/reset-password/:token"
        element={<ResetPassword role={"client"} />}
      />
    </Routes>
  );
}
