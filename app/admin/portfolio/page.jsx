import DashboardLayout from "@/app/components/admin/theme/DashboardLayout";
import PersonalInfoManager from "@/app/components/admin/portfolio/PersonalInfoManager";
import ExperienceManager from "@/app/components/admin/portfolio/ExperienceManager";
import EducationManager from "@/app/components/admin/portfolio/EducationManager";

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PersonalInfoManager />
        <ExperienceManager />
        <EducationManager />
      </div>
    </DashboardLayout>
  );
} 