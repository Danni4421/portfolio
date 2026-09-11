import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HomePage } from "@/pages/home"
import { ProjectDetailPage } from "@/pages/project-detail"
import { AdminLoginPage } from "@/pages/admin/login"
import { AdminDashboardPage } from "@/pages/admin/dashboard"
import { AdminProjectsPage } from "@/pages/admin/projects"
import { AdminStacksPage } from "@/pages/admin/stacks"
import { AdminArticlesPage } from "@/pages/admin/articles"
import { AdminAchievementsPage } from "@/pages/admin/achievements"
import { AdminWorkPage } from "@/pages/admin/work"
import { AdminProfilePage } from "@/pages/admin/profile"
import { ToastProviderWrapper } from "@/shared/ui/toast"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CustomCursor } from "@/shared/ui/custom-cursor"
import "@/app/styles/index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProviderWrapper>
        <CustomCursor />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* protected admin layout wrapper */}
            <Route path="/admin" element={<AdminDashboardPage />}>
              <Route index element={<Navigate to="/admin/projects" replace />} />
              <Route path="dashboard" element={<Navigate to="/admin/projects" replace />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="stacks" element={<AdminStacksPage />} />
              <Route path="articles" element={<AdminArticlesPage />} />
              <Route path="achievements" element={<AdminAchievementsPage />} />
              <Route path="work" element={<AdminWorkPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>

            {/* Legacy redirect for /admin/dashboard */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin/projects" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProviderWrapper>
    </QueryClientProvider>
  )
}

export default App
