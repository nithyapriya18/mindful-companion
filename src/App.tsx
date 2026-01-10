import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TherapistProvider } from "@/contexts/TherapistContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TherapistSelection from "./pages/TherapistSelection";
import CustomizeTherapist from "./pages/CustomizeTherapist";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route 
        path="/therapist-selection" 
        element={
          <ProtectedRoute>
            <TherapistSelection />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customize-therapist" 
        element={
          <ProtectedRoute>
            <CustomizeTherapist />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TherapistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </TherapistProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;