
import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load all page components for better performance
const Index = lazy(() => import("./pages/Index"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const JobApply = lazy(() => import("./pages/JobApply"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminJobsManagement = lazy(() => import("./pages/AdminJobsManagement"));
const AdminUsersManagement = lazy(() => import("./pages/AdminUsersManagement"));
const AdminBlogsManagement = lazy(() => import("./pages/AdminBlogsManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimize QueryClient for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner size="large" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/job/:id" element={<JobDetail />} />
              <Route path="/job/:id/apply" element={<JobApply />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/category/:category" element={<BlogCategory />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
                <AdminProtectedRoute>
                  <AdminJobsManagement />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <AdminProtectedRoute>
                  <AdminUsersManagement />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/blogs" element={
                <AdminProtectedRoute>
                  <AdminBlogsManagement />
                </AdminProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieBanner />
        </TooltipProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
