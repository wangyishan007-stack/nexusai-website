import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { useAuth } from "./hooks/useAuth";

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
import { ComparePage } from "./pages/ComparePage";
import { ProviderPage } from "./pages/ProviderPage";

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
      <main className="pt-16">
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

/** Sync wagmi wallet state with useAuth on reconnect/disconnect */
function useWalletSync() {
  const { address, isConnected, isReconnecting, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { walletAddress, loginMethod, loginWithWallet, logout } = useAuth();

  // Auto-restore session when wagmi reconnects
  useEffect(() => {
    if (isConnected && address && !walletAddress) {
      loginWithWallet(address);
    }
  }, [isConnected, address, walletAddress, loginWithWallet]);

  // If wallet disconnects externally (e.g. from MetaMask), clear auth
  // Guard: skip while wagmi is still initializing/reconnecting
  useEffect(() => {
    if (!isConnected && !isReconnecting && !isConnecting && loginMethod === "wallet" && walletAddress) {
      logout();
    }
  }, [isConnected, isReconnecting, isConnecting, loginMethod, walletAddress, logout]);

  // If auth logs out but wagmi is still connected, disconnect wagmi
  useEffect(() => {
    if (isConnected && !walletAddress && loginMethod === null) {
      disconnect();
    }
  }, [isConnected, walletAddress, loginMethod, disconnect]);
}

function App() {
  useWalletSync();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/models" element={<ModelsExplorerPage />} />
      <Route path="/models/expanded" element={<ModelsExplorerPage defaultFiltersExpanded />} />
      <Route path="/models/:id" element={<ModelDetailPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/providers/:providerId" element={<ProviderPage />} />
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
      {/* Catch-all: redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
