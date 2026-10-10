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
import { Button } from "@/shared/ui/button";
import { Blobatar } from "@blobatar/react";

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
            <Icon size={16} />
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
          <Blobatar
            name="simone"
            animate="always"
            background="circle"
            amplitude={20}
            className="block w-12 h-12"
          />
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
              className="w-9 h-9 rounded-full object-cover bg-muted border border-sidebar-border shrink-0"
            />
            {state !== "collapsed" && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-sidebar-foreground truncate leading-none mb-0.5">
                  {profile?.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">{profile?.email}</span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="w-full justify-center gap-2"
          >
            <LogOut size={14} className="shrink-0" />
            {state !== "collapsed" && <span>Log Out</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
