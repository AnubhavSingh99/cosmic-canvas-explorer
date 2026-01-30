import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/hooks/useFavorites";
import Index from "./pages/Index";
import Search from "./pages/Search";
import ImageDetail from "./pages/ImageDetail";
import Favorites from "./pages/Favorites";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FavoritesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/image/:id" element={<ImageDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/mission/:missionId" element={<MissionDetail />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
