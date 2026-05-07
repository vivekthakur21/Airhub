import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index.tsx";
import Search from "./pages/Search.tsx";
import PropertyDetails from "./pages/PropertyDetails.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Auth from "./pages/Auth.tsx";
import Bookings from "./pages/Bookings.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import { AdminLayout } from "./components/AdminLayout.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminHotels from "./pages/AdminHotels.tsx";
import AdminBookings from "./pages/AdminBookings.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import AdminAnalytics from "./pages/AdminAnalytics.tsx";
import AdminSettings from "./pages/AdminSettings.tsx";
import NotFound from "./pages/NotFound.tsx";
import Placeholder from "./pages/Placeholder.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/destinations" element={<Placeholder title="Destinations" />} />
              <Route path="/offers" element={<Placeholder title="Special Offers" />} />
              <Route path="/guide" element={<Placeholder title="Travel Guide" />} />
              <Route path="/about" element={<Placeholder title="About Staybnb" />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/blog" element={<Placeholder title="Our Blog" />} />
              <Route path="/help" element={<Placeholder title="Help Center" />} />
              <Route path="/cancellation-policy" element={<Placeholder title="Cancellation Policy" />} />
              <Route path="/faq" element={<Placeholder title="Frequently Asked Questions" />} />
              <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
              <Route path="/terms" element={<Placeholder title="Terms & Conditions" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="hotels" element={<AdminHotels />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
