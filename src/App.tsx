import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Verify from "./pages/Verify";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { FhevmProvider } from './fhevm-sdk/index';

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <FhevmProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-background">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/verify" element={<Verify />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </FhevmProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
