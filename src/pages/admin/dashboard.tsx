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
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <LoadingAnimation />
          <span className="font-sans text-xs uppercase tracking-wider font-medium text-muted-foreground">Loading Console...</span>
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
        <header className="bg-card border-b border-border sticky top-0 z-40 shrink-0 select-none">
          <div className="flex items-center gap-4 px-4 py-2 sm:px-6">
            <SidebarTrigger className="[&_svg]:size-4!" />
            <div className="hidden h-4 w-px bg-border sm:block" />
            <nav className="hidden items-center gap-1.5 text-sm sm:flex">
              <span className="text-muted-foreground">Console</span>
              <ChevronRight size={14} className="text-muted-foreground/70" />
              <span className="text-foreground font-medium">{pageTitle}</span>
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto size-full max-w-360 px-4 py-6 sm:px-6">
            <Outlet context={{ profile, setProfile }} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
