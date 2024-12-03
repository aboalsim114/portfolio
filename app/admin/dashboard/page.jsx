"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaUsers, FaProjectDiagram, FaBlog, FaEnvelope } from "react-icons/fa";
import DashboardLayout from "@/app/components/admin/theme/DashboardLayout";
import StatCard from "@/app/components/admin/cards/StatCard";
import AdvancedStats from "@/app/components/admin/AdvancedStats";
import TaskManager from "@/app/components/admin/TaskManager";
import NotificationCenter from "@/app/components/admin/NotificationCenter";
import PerformanceMonitor from "@/app/components/admin/PerformanceMonitor";
import ScrollReveal from "@/app/components/admin/animations/ScrollReveal";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    unreadMessages: 0,
    trends: {
      projects: 0,
      blogs: 0,
      messages: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          toast.error("Session expirée");
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        
        if (response.ok) {
          setStats(data);
        } else {
          toast.error("Erreur lors du chargement des statistiques");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Erreur de connexion");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FaProjectDiagram}
            title="Projets"
            value={stats.projects}
            trend={parseFloat(stats.trends.projects)}
            color="bg-pink-500/20 text-pink-500"
          />
          <StatCard
            icon={FaBlog}
            title="Articles"
            value={stats.blogs}
            trend={parseFloat(stats.trends.blogs)}
            color="bg-violet-500/20 text-violet-500"
          />
          <StatCard
            icon={FaEnvelope}
            title="Messages"
            value={stats.messages}
            trend={parseFloat(stats.trends.messages)}
            color="bg-green-500/20 text-green-500"
          />
          <StatCard
            icon={FaEnvelope}
            title="Non lus"
            value={stats.unreadMessages}
            color="bg-blue-500/20 text-blue-500"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        {/* Performance et Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#1a1443]/50 backdrop-blur-sm rounded-xl border border-gray-800/50">
            <PerformanceMonitor />
          </div>
          <div className="bg-[#1a1443]/50 backdrop-blur-sm rounded-xl border border-gray-800/50">
            <NotificationCenter />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        {/* Graphiques et Tâches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#1a1443]/50 backdrop-blur-sm rounded-xl border border-gray-800/50">
            <AdvancedStats stats={stats} />
          </div>
          <div className="bg-[#1a1443]/50 backdrop-blur-sm rounded-xl border border-gray-800/50">
            <TaskManager />
          </div>
        </div>
      </ScrollReveal>
    </DashboardLayout>
  );
} 