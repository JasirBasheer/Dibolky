import { Route, Routes } from "react-router-dom";
import Clients from "@/pages/agency/Clients";
import Inbox from "@/components/common/inbox";
import AgencyCalendar from "@/pages/agency/Calendar";
import AgencyLeads from "@/pages/agency/Leads";
import AgencyContent from "@/pages/agency/Content";
import Projects from "@/pages/agency/projects";
import SettingsPage from "@/pages/settings/settings";
import CreateClient from "@/components/agency/agencyside.components/createClient";
import Integrations from "@/pages/integrations/IntegrationsPage";
import Invoices from "@/pages/common/Invoices";
import Dashboard from "@/pages/dashboard/agencyDashboard";
import Payments from "@/pages/common/Payments";
import CreateInvoice from "@/pages/agency/CreateInvoice";
import Overdues from "@/pages/common/Overdues";
import UpgradePlan from "@/pages/agency/UpgradePlan";
import BillingHistory from "@/pages/agency/BillingHistory";
import ChatPage from "@/pages/chat/chatPage";
import Media from "@/pages/media/MediaPage";
import {
  AgencyLayout,
  CaseStudiesPage,
  ForgotPassword,
  Login,
  PortfolioPage,
  ProtectedRoute,
  ResetPassword,
  TestimonialsPage,
  UnProtectedRoute,
} from "@/pages";

export default function AgencyRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute role={"agency"}>
            <AgencyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="clients" element={<Clients />} />
        <Route path="clients/create" element={<CreateClient />} />

        <Route path="invoices" element={<Invoices />} />
        <Route path="invoices/payments" element={<Payments />} />
        <Route path="invoices/create" element={<CreateInvoice />} />
        <Route path="invoices/overdue" element={<Overdues />} />

        <Route path="billing/upgrade" element={<UpgradePlan />} />
        <Route path="billing/history" element={<BillingHistory />} />

        <Route path="work/portfolio" element={<PortfolioPage />} />
        <Route path="work/case-studies" element={<CaseStudiesPage />} />
        <Route path="work/testimonials" element={<TestimonialsPage />} />

        {/* <Route path='performance/social' element={<SocialPerformancePage />} />
        <Route path='performance/conversions' element={<ConversionPerformancePage />} /> */}

        <Route path="settings" element={<SettingsPage />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="calendar" element={<AgencyCalendar />} />

        <Route path="messages" element={<ChatPage />} />
        <Route path="media" element={<Media />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="contents" element={<AgencyContent />} />
        <Route path="leads" element={<AgencyLeads />} />

        <Route path="projects" element={<Projects />} />
      </Route>

      <Route
        path="/login"
        element={
          <UnProtectedRoute role={"agency"}>
            <Login role={"agency"} />
          </UnProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword role={"agency"} />}
      />
      <Route
        path="/reset-password/:token"
        element={<ResetPassword role={"agency"} />}
      />
    </Routes>
  );
}
