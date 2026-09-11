import { Link, useLocation } from "react-router-dom";
import {
  Layers,
  FolderGit,
  FileText,
  Award,
  Briefcase,
  User,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar
} from "@/shared/ui/sidebar";

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  role: string;
}

interface AdminSidebarProps {
  profile: UserProfile | null;
  onLogout: () => void;
}

export function AdminSidebar({ profile, onLogout }: AdminSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state } = useSidebar();

  const mainNavItems = [
    { path: "/admin/projects", label: "Projects", icon: FolderGit },
    { path: "/admin/stacks", label: "Tech Stacks", icon: Layers },
    { path: "/admin/articles", label: "Articles", icon: FileText },
  ];

  const secondaryNavItems = [
    { path: "/admin/achievements", label: "Achievements", icon: Award },
    { path: "/admin/work", label: "Work Experience", icon: Briefcase },
    { path: "/admin/profile", label: "Profile Settings", icon: User },
  ];

  const renderLink = (item: typeof mainNavItems[0]) => {
    const Icon = item.icon;
    const isActive = currentPath === item.path || (item.path === "/admin/projects" && currentPath === "/admin/dashboard");
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link to={item.path}>
            <Icon size={16} className={isActive ? "text-[#111111]" : "text-gray-400"} />
            {state !== "collapsed" && <span>{item.label}</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#111111] flex items-center justify-center text-white font-bold text-xs shrink-0">
            A
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#111111] tracking-tight leading-none">Console</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(renderLink)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Credentials & Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map(renderLink)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={profile?.avatar_url || "/apple-touch-icon.png"}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
            />
            {state !== "collapsed" && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#111111] truncate leading-none mb-0.5">
                  {profile?.name}
                </span>
                <span className="text-[10px] text-gray-400 truncate">{profile?.email}</span>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            <LogOut size={12} className="text-gray-400 shrink-0" />
            {state !== "collapsed" && <span>Log Out</span>}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
