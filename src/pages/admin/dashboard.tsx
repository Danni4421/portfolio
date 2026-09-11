// ponytail: Admin layout component matching Shadcn Dashboard template
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { LoadingAnimation } from "@/shared/ui/loading-animation";
import { AdminSidebar } from "./sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
} from "@/shared/ui/sidebar";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  role: string;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    Effect.runPromise(apiClient.get<{ success: boolean; data: UserProfile }>("/api/v1/user/profile"))
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Failed to load profile", err);
        apiClient.removeToken();
        navigate("/admin/login");
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    apiClient.removeToken();
    navigate("/admin/login");
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500 font-sans">
        <div className="flex flex-col items-center gap-4">
          <LoadingAnimation />
          <span className="font-sans text-xs uppercase tracking-wider font-semibold text-gray-400">Loading Console...</span>
        </div>
      </div>
    );
  }

  const currentPath = location.pathname;
  let pageTitle = "Projects";
  if (currentPath.includes("stacks")) pageTitle = "Tech Stacks";
  else if (currentPath.includes("articles")) pageTitle = "Articles";
  else if (currentPath.includes("achievements")) pageTitle = "Achievements";
  else if (currentPath.includes("work")) pageTitle = "Work Experience";
  else if (currentPath.includes("profile")) pageTitle = "Profile Settings";

  return (
    <SidebarProvider>
      <AdminSidebar profile={profile} onLogout={handleLogout} />
      <SidebarRail />
      <SidebarInset>
        <header className="h-14 border-b border-gray-100 bg-white px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium font-sans">
            <SidebarTrigger />
            <div className="h-4 w-px bg-gray-200" />
            <span>Console</span>
            <ChevronRight size={12} className="opacity-70" />
            <span className="text-[#111111] font-semibold">{pageTitle}</span>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet context={{ profile, setProfile }} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
