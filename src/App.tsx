import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "@/contexts/ContentContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import DemoBanner from "@/components/DemoBanner";
import UpgradeModal from "@/components/UpgradeModal";
import Index from "./pages/Index";
import Strategy from "./pages/Strategy";
import Content from "./pages/Content";
import ContentGenerate from "./pages/ContentGenerate";
import ContentDetail from "./pages/ContentDetail";
import CampaignManagement from "./pages/CampaignManagement";
import CampaignDetail from "./pages/CampaignDetail";
import Analytics from "./pages/Analytics";
import Channels from "./pages/Channels";
import ChannelGuide from "./pages/ChannelGuide";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Force refresh to load ContentProvider
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoModeProvider>
        <ContentProvider>
          <DemoBanner />
          <UpgradeModal />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/strategy" element={<Strategy />} />
              <Route path="/content" element={<Content />} />
              <Route path="/content/create" element={<ContentGenerate />} />
              <Route path="/content/:id" element={<ContentDetail />} />
              <Route path="/campaigns" element={<CampaignManagement />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/channels/guide/:channel" element={<ChannelGuide />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </DemoModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
