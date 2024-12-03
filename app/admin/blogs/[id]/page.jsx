import DashboardLayout from "@/app/components/admin/theme/DashboardLayout";
import BlogDetail from "@/app/components/admin/blogs/BlogDetail";

export default function BlogDetailPage({ params }) {
  return (
    <DashboardLayout>
      <BlogDetail id={params.id} />
    </DashboardLayout>
  );
} 