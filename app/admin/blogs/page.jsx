import BlogManager from "@/app/components/admin/blogs/BlogManager";
import DashboardLayout from "@/app/components/admin/theme/DashboardLayout";

export default function BlogsPage() {
  return (
    <DashboardLayout>
      <BlogManager />
    </DashboardLayout>
  );
} 