import { Routes, Route } from "react-router-dom";

// Landing page components
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Providers } from "./components/Providers";
import { ValueProps } from "./components/ValueProps";
import { FeaturedModels } from "./components/FeaturedModels";
import { Showcase } from "./components/Showcase";
import { GetStarted } from "./components/GetStarted";
import { CTABanner } from "./components/CTABanner";
import { Footer } from "./components/Footer";

// Public pages
import { ChatPage } from "./pages/ChatPage";
import { PricingPage } from "./pages/PricingPage";
import { ModelsExplorerPage } from "./pages/ModelsExplorerPage";
import { RankingsPage } from "./pages/RankingsPage";
import { ModelDetailPage } from "./pages/ModelDetailPage";
import { AppsPage } from "./pages/AppsPage";
import { DocsPage } from "./pages/DocsPage";

// Settings pages (default exports)
import ApiKeysPage from "./pages/ApiKeysPage";
import RoutingPage from "./pages/RoutingPage";
import ObservabilityPage from "./pages/ObservabilityPage";
import PresetsPage from "./pages/PresetsPage";
import PluginsPage from "./pages/PluginsPage";
import ActivityPage from "./pages/ActivityPage";
import ByokPage from "./pages/ByokPage";
import GuardrailsPage from "./pages/GuardrailsPage";
import CreditsPage from "./pages/CreditsPage";
import ManagementKeysPage from "./pages/ManagementKeysPage";
import PreferencesPage from "./pages/PreferencesPage";
import LogsPage from "./pages/LogsPage";

function LandingPage() {
  return (
    <div className="bg-surface font-body text-on-surface">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Stats />
        <Providers />
        <ValueProps />
        <FeaturedModels />
        <Showcase />
        <GetStarted />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/models" element={<ModelsExplorerPage />} />
      <Route path="/models/expanded" element={<ModelsExplorerPage defaultFiltersExpanded />} />
      <Route path="/models/:id" element={<ModelDetailPage />} />
      <Route path="/rankings" element={<RankingsPage />} />
      <Route path="/apps" element={<AppsPage />} />
      <Route path="/docs" element={<DocsPage />} />
      {/* Settings pages */}
      <Route path="/settings/api-keys" element={<ApiKeysPage />} />
      <Route path="/settings/routing" element={<RoutingPage />} />
      <Route path="/settings/observability" element={<ObservabilityPage />} />
      <Route path="/settings/presets" element={<PresetsPage />} />
      <Route path="/settings/plugins" element={<PluginsPage />} />
      <Route path="/settings/activity" element={<ActivityPage />} />
      <Route path="/settings/byok" element={<ByokPage />} />
      <Route path="/settings/guardrails" element={<GuardrailsPage />} />
      <Route path="/settings/credits" element={<CreditsPage />} />
      <Route path="/settings/management-keys" element={<ManagementKeysPage />} />
      <Route path="/settings/preferences" element={<PreferencesPage />} />
      <Route path="/settings/logs" element={<LogsPage />} />
    </Routes>
  );
}

export default App;
