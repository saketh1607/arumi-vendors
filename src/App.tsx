
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import UserDetailsContext from "./hooks/UserDetailsContext";
import { UserDetailsProvider } from "./hooks/UserDetailsContext";
import "./index.css"
import VendorCategories from "./pages/VendorCategories";
import AddVendorPage from "./pages/AddVendorPage";
import Vendors from "./pages/Vendors";

const queryClient = new QueryClient();



const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <UserDetailsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            
              <Route path="*" element={<NotFound />} />
            
                <Route path="/vendors" element={<Vendors/>} />
              <Route path="/add-vendor" element={<AddVendorPage />} />
              <Route path="/vendor-categories" element={<VendorCategories />} />
            
            </Routes>
          </Layout>
          </UserDetailsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
