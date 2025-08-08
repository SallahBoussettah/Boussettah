"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  Sun,
  Moon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Upload,
  Image,
  Code,
  Gamepad2,
  Palette,
  BarChart3,
  Users,
  Calendar,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Star,
  Heart,
  ExternalLink,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import ClientOnly from "@/components/ClientOnly";
import { projectsAPI, Project, artAPI, ArtPiece } from "@/lib/api";

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationOrigin, setAnimationOrigin] = useState({ x: 0, y: 0 });
  const [nextTheme, setNextTheme] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newTheme = theme === "dark" ? "light" : "dark";
    setNextTheme(newTheme);
    setAnimationOrigin({ x: centerX, y: centerY });
    setIsAnimating(true);

    setTimeout(() => {
      setTheme(newTheme);
    }, 400);

    setTimeout(() => {
      setIsAnimating(false);
      setNextTheme("");
    }, 1600);
  };

  if (!mounted) return null;

  return (
    <>
      <motion.button
        onClick={handleThemeToggle}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.21, 1, 0.81, 1] }}
      >
        <motion.div
          animate={{
            rotate: theme === "dark" ? 180 : 0,
            scale: isAnimating ? [1, 0.8, 1] : 1,
          }}
          transition={{
            rotate: { duration: 0.6, ease: [0.21, 1, 0.81, 1] },
            scale: { duration: 0.3, ease: [0.21, 1, 0.81, 1] },
          }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.4, ease: [0.21, 1, 0.81, 1] }}
              >
                <Sun className="w-6 h-6 text-slate-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.4, ease: [0.21, 1, 0.81, 1] }}
              >
                <Moon className="w-6 h-6 text-slate-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow:
              theme === "dark"
                ? "0 0 20px rgba(148, 163, 184, 0.2)"
                : "0 0 20px rgba(71, 85, 105, 0.2)",
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <motion.div
              className={`absolute rounded-full ${
                nextTheme === "light" ? "bg-white" : "bg-black"
              }`}
              style={{
                left: animationOrigin.x,
                top: animationOrigin.y,
              }}
              initial={{
                width: 0,
                height: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                width: "400vmax",
                height: "400vmax",
              }}
              transition={{
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Sidebar Component
function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: Code },
    { id: "art", label: "Art Gallery", icon: Palette },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, ease: [0.21, 1, 0.81, 1] }}
      className="fixed left-0 top-0 h-full w-64 bg-white/90 dark:bg-black/90 backdrop-blur-md border-r border-slate-200 dark:border-slate-700 z-40"
    >
      <div className="p-6">
        {/* Logo */}
        <Link href="/">
          <motion.div
            className="text-2xl font-bold tracking-tight mb-8 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-clip-text text-transparent">
              SB. Admin
            </span>
          </motion.div>
        </Link>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-blue-500 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 mt-8"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// Overview Tab Component
function OverviewTab() {
  const [stats, setStats] = useState([
    { label: "Total Projects", value: "0", icon: Code, color: "blue" },
    { label: "Art Pieces", value: "0", icon: Palette, color: "purple" },
    { label: "Total Views", value: "0", icon: Eye, color: "green" },
    { label: "GitHub Stars", value: "0", icon: Star, color: "yellow" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await projectsAPI.getStats();
        const overview = response?.overview || {};
        setStats([
          {
            label: "Total Projects",
            value: (overview.totalProjects || 0).toString(),
            icon: Code,
            color: "blue",
          },
          {
            label: "Featured Projects",
            value: (overview.featuredProjects || 0).toString(),
            icon: Star,
            color: "yellow",
          },
          {
            label: "Total Views",
            value: (overview.totalViews || 0).toString(),
            icon: Eye,
            color: "green",
          },
          {
            label: "Total Likes",
            value: (overview.totalLikes || 0).toString(),
            icon: Heart,
            color: "purple",
          },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Set default stats on error
        setStats([
          { label: "Total Projects", value: "0", icon: Code, color: "blue" },
          {
            label: "Featured Projects",
            value: "0",
            icon: Star,
            color: "yellow",
          },
          { label: "Total Views", value: "0", icon: Eye, color: "green" },
          { label: "Total Likes", value: "0", icon: Heart, color: "purple" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const recentActivity = [
    {
      action: "Dashboard loaded",
      item: "Admin Panel",
      time: "Just now",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stat.color === "blue"
                    ? "bg-blue-100 dark:bg-blue-900"
                    : stat.color === "purple"
                    ? "bg-purple-100 dark:bg-purple-900"
                    : stat.color === "green"
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-yellow-100 dark:bg-yellow-900"
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.color === "blue"
                      ? "text-blue-500"
                      : stat.color === "purple"
                      ? "text-purple-500"
                      : stat.color === "green"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                />
              </div>
            </div>
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <h3 className="text-xl font-bold text-black dark:text-white mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-black dark:text-white font-medium">
                  {activity.action}:{" "}
                  <span className="text-blue-500">{activity.item}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm">
                  {activity.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Projects Tab Component
function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAllAdmin({
        search: searchTerm || undefined,
        category: filterCategory || undefined,
        status: filterStatus || undefined,
      });
      setProjects(response?.projects || response || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterCategory, filterStatus]);

  const ProjectForm = ({
    project,
    onSave,
    onCancel,
  }: {
    project?: Project | null;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: project?.title || "",
      subtitle: project?.subtitle || "",
      slug: project?.slug || "",
      description: project?.description || "",
      longDescription: project?.longDescription || "",
      shortDescription: project?.shortDescription || "",
      category: project?.category || "web",
      status: project?.status || "planning",
      technologies: project?.technologies || [],
      features: project?.features || [],
      challenges: project?.challenges || [],
      learnings: project?.learnings || [],
      githubUrl: project?.githubUrl || "",
      liveUrl: project?.liveUrl || "",
      demoUrl: project?.demoUrl || "",
      imageUrl: project?.imageUrl || "",
      thumbnailUrl: project?.thumbnailUrl || "",
      images: project?.images || [],
      featured: project?.featured || false,
      priority: project?.priority || 0,
      year: project?.year || new Date().getFullYear().toString(),
      startDate: project?.startDate || "",
      endDate: project?.endDate || "",
      isPublic: project?.isPublic !== undefined ? project.isPublic : true,
      completionPercentage: project?.completionPercentage || 0,
      difficulty: project?.difficulty || "intermediate",
      teamSize: project?.teamSize || 1,
      duration: project?.duration || "",
      client: project?.client || "",
      awards: project?.awards || [],
      tags: project?.tags || [],
      stars: project?.stars || "",
      downloads: project?.downloads || "",
    });

    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
        // Generate slug from title if not provided
        if (!formData.slug) {
          formData.slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }

        // Clean form data - remove empty strings for URL fields and optional fields
        const cleanedData = { ...formData };

        // Clean URL fields - convert empty strings to undefined
        const urlFields = [
          "githubUrl",
          "liveUrl",
          "demoUrl",
          "imageUrl",
          "thumbnailUrl",
        ];
        urlFields.forEach((field) => {
          if (cleanedData[field] === "") {
            cleanedData[field] = undefined;
          }
        });

        // Clean optional string fields
        const optionalFields = [
          "subtitle",
          "shortDescription",
          "longDescription",
          "duration",
          "client",
          "stars",
          "downloads",
        ];
        optionalFields.forEach((field) => {
          if (cleanedData[field] === "") {
            cleanedData[field] = undefined;
          }
        });

        // Clean date fields
        const dateFields = ["startDate", "endDate"];
        dateFields.forEach((field) => {
          if (cleanedData[field] === "") {
            cleanedData[field] = undefined;
          }
        });

        await onSave(cleanedData);
      } catch (error) {
        console.error("Error saving project:", error);
      } finally {
        setSaving(false);
      }
    };

    const handleArrayChange = (field: string, value: string) => {
      setFormData({
        ...formData,
        [field]: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-black rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
            {project ? "Edit Project" : "Add New Project"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter project title"
                  required
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subtitle
                </label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Project subtitle"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Slug (URL-friendly name)
              </label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="project-slug (auto-generated if empty)"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
                  required
                >
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="game">Game Development</option>
                  <option value="desktop">Desktop App</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
                  required
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Short Description
              </label>
              <Input
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                placeholder="Brief project description for cards"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Main project description"
                rows={3}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Long Description
              </label>
              <Textarea
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                placeholder="Detailed project description for project detail page"
                rows={4}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Technologies and Features */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Technologies (comma-separated)
              </label>
              <Input
                value={formData.technologies.join(", ")}
                onChange={(e) =>
                  handleArrayChange("technologies", e.target.value)
                }
                placeholder="React, Node.js, MongoDB, TypeScript"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Key Features (comma-separated)
              </label>
              <Textarea
                value={formData.features.join(", ")}
                onChange={(e) => handleArrayChange("features", e.target.value)}
                placeholder="User authentication, Real-time chat, Payment integration"
                rows={2}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Challenges (comma-separated)
                </label>
                <Textarea
                  value={formData.challenges.join(", ")}
                  onChange={(e) =>
                    handleArrayChange("challenges", e.target.value)
                  }
                  placeholder="Performance optimization, Complex state management"
                  rows={2}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Key Learnings (comma-separated)
                </label>
                <Textarea
                  value={formData.learnings.join(", ")}
                  onChange={(e) =>
                    handleArrayChange("learnings", e.target.value)
                  }
                  placeholder="Advanced React patterns, Database optimization"
                  rows={2}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  GitHub URL
                </label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/username/repo"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Live URL
                </label>
                <Input
                  value={formData.liveUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, liveUrl: e.target.value })
                  }
                  placeholder="https://project-live-url.com"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Demo URL
                </label>
                <Input
                  value={formData.demoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, demoUrl: e.target.value })
                  }
                  placeholder="https://demo-url.com"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Main Image URL
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Thumbnail URL
                </label>
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnailUrl: e.target.value })
                  }
                  placeholder="https://example.com/thumbnail.jpg"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Additional Images (comma-separated URLs)
              </label>
              <Textarea
                value={formData.images.join(", ")}
                onChange={(e) => handleArrayChange("images", e.target.value)}
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                rows={2}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Year
                </label>
                <Input
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="2025"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Team Size
                </label>
                <Input
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamSize: parseInt(e.target.value) || 1,
                    })
                  }
                  placeholder="1"
                  min="1"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Priority
                </label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  min="0"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Completion %
                </label>
                <Input
                  type="number"
                  value={formData.completionPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      completionPercentage: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="100"
                  min="0"
                  max="100"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Duration
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="3 months"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Client
                </label>
                <Input
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  placeholder="Client name or Personal"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  GitHub Stars
                </label>
                <Input
                  value={formData.stars}
                  onChange={(e) =>
                    setFormData({ ...formData, stars: e.target.value })
                  }
                  placeholder="156"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Downloads
                </label>
                <Input
                  value={formData.downloads}
                  onChange={(e) =>
                    setFormData({ ...formData, downloads: e.target.value })
                  }
                  placeholder="1.2K"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags (comma-separated)
              </label>
              <Input
                value={formData.tags.join(", ")}
                onChange={(e) => handleArrayChange("tags", e.target.value)}
                placeholder="react, typescript, fullstack, ecommerce"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Awards (comma-separated)
              </label>
              <Input
                value={formData.awards.join(", ")}
                onChange={(e) => handleArrayChange("awards", e.target.value)}
                placeholder="Best Design Award, Innovation Prize"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Featured Project
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Public Project
                </label>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving
                  ? "Saving..."
                  : project
                  ? "Update Project"
                  : "Add Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  const handleSaveProject = async (projectData: any) => {
    try {
      if (editingProject) {
        await projectsAPI.update(editingProject.id, projectData);
        setEditingProject(null);
      } else {
        await projectsAPI.create(projectData);
        setShowAddForm(false);
      }
      await fetchProjects(); // Refresh the list
    } catch (error: any) {
      console.error("Error saving project:", error);

      // Show specific validation errors if available
      if (error.message && error.message.includes("Validation failed")) {
        alert(
          "Validation failed. Please check your input:\n- URLs must be valid (include http:// or https://)\n- Required fields must not be empty"
        );
      } else {
        alert(`Error saving project: ${error.message || "Please try again."}`);
      }

      // Re-throw the error so the form doesn't close
      throw error;
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsAPI.delete(id);
        await fetchProjects(); // Refresh the list
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Error deleting project. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Projects Management ({projects.length})
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="web">Web Development</option>
            <option value="mobile">Mobile App</option>
            <option value="game">Game Development</option>
            <option value="desktop">Desktop App</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid gap-6">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  No projects found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {searchTerm || filterCategory || filterStatus
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first project"}
                </p>
                {!searchTerm && !filterCategory && !filterStatus && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
                )}
              </div>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-black dark:text-white">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        )}
                        {!project.isPublic && (
                          <Eye className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      {project.subtitle && (
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          {project.subtitle}
                        </p>
                      )}

                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.category === "web"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                              : project.category === "game"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : project.category === "mobile"
                              ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                              : "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                          }`}
                        >
                          {project.category}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "completed"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : project.status === "in-progress"
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                              : project.status === "on-hold"
                              ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                              : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {project.status.replace("-", " ")}
                        </span>
                        {project.difficulty && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                            {project.difficulty}
                          </span>
                        )}
                        {project.completionPercentage > 0 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                            {project.completionPercentage}% complete
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                        {project.year && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {project.year}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {project.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {project.likes} likes
                        </span>
                        {project.stars && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {project.stars} stars
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {project.liveUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(project.liveUrl, "_blank")}
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(project.githubUrl, "_blank")
                          }
                          title="View Code"
                        >
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingProject(project)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {project.shortDescription || project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies
                      .slice(0, 6)
                      .map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    {project.technologies.length > 6 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs">
                        +{project.technologies.length - 6} more
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingProject) && (
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}

// Art Tab Component
function ArtTab() {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArt, setEditingArt] = useState<ArtPiece | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchArtPieces();
  }, []);

  const fetchArtPieces = async () => {
    try {
      setLoading(true);
      const response = await artAPI.getAllAdmin({
        search: searchTerm || undefined,
        category: filterCategory || undefined,
      });
      setArtPieces(response?.artPieces || response || []);
    } catch (error) {
      console.error("Error fetching art pieces:", error);
      setArtPieces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchArtPieces();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterCategory]);

  const handleImageUpload = async (file: File): Promise<string> => {
    // For now, we'll create a placeholder URL
    // In a real implementation, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // This is a placeholder - in production you'd upload to your image service
        const imageUrl = `/images/art/${file.name}`;
        resolve(imageUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  const ArtForm = ({
    art,
    onSave,
    onCancel,
  }: {
    art?: ArtPiece | null;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: art?.title || "",
      slug: art?.slug || "",
      description: art?.description || "",
      category: art?.category || "Digital Art",
      medium: art?.medium || "Paint Studio on PC",
      year: art?.year || new Date().getFullYear().toString(),
      imageUrl: art?.imageUrl || "",
      thumbnailUrl: art?.thumbnailUrl || "",
      images: art?.images || [],
      featured: art?.featured || false,
      priority: art?.priority || 0,
      dimensions: art?.dimensions || "",
      tags: art?.tags || [],
      isPublic: art?.isPublic !== undefined ? art.isPublic : true,
    });

    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
        let imageUrl = formData.imageUrl;

        // Upload image if a new file was selected
        if (imageFile) {
          setUploadingImage(true);
          imageUrl = await handleImageUpload(imageFile);
          setUploadingImage(false);
        }

        // Generate slug from title if not provided
        let slug = formData.slug;
        if (!slug) {
          slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }

        const cleanedData = {
          ...formData,
          slug,
          imageUrl,
          thumbnailUrl: imageUrl, // Use same image for thumbnail for now
          images: imageUrl ? [imageUrl] : [],
        };

        // Clean optional fields - remove empty strings and undefined values
        const finalData = Object.fromEntries(
          Object.entries(cleanedData).filter(([key, value]) => {
            // Keep the value if it's not empty string, not undefined, and not null
            if (value === "" || value === undefined || value === null) {
              return false;
            }
            // Keep arrays even if empty (but not if they contain only empty strings)
            if (Array.isArray(value)) {
              return value.length > 0 && value.some(item => item !== "");
            }
            return true;
          })
        );

        // Ensure data types are correct for API
        if (finalData.year) {
          finalData.year = finalData.year.toString();
          // Ensure year is exactly 4 digits
          if (!/^\d{4}$/.test(finalData.year)) {
            throw new Error('Year must be exactly 4 digits');
          }
        }

        // Ensure priority is a number
        if (finalData.priority !== undefined) {
          finalData.priority = Number(finalData.priority);
        }

        // Ensure boolean fields are actual booleans
        if (finalData.featured !== undefined) {
          finalData.featured = Boolean(finalData.featured);
        }
        if (finalData.isPublic !== undefined) {
          finalData.isPublic = Boolean(finalData.isPublic);
        }

        console.log('Sending art data:', finalData); // Debug log

        await onSave(finalData);
      } catch (error) {
        console.error("Error saving art piece:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        alert(`Error saving art piece: ${errorMessage}`);
      } finally {
        setSaving(false);
        setUploadingImage(false);
      }
    };

    const handleArrayChange = (field: string, value: string) => {
      setFormData({
        ...formData,
        [field]: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-black rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
            {art ? "Edit Artwork" : "Add New Artwork"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
              <div className="text-center">
                {imagePreview || formData.imageUrl ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      className="max-w-full h-48 object-cover mx-auto rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <Image className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 dark:text-slate-400">
                      No image selected
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imagePreview || formData.imageUrl
                    ? "Change Image"
                    : "Upload Image"}
                </label>

                {uploadingImage && (
                  <p className="text-purple-500 mt-2">Uploading image...</p>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Artwork Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter artwork title"
                  required
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Slug (URL-friendly name)
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="artwork-slug (auto-generated if empty)"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your artwork..."
                rows={3}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Category and Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
                  required
                >
                  <option value="Digital Art">Digital Art</option>
                  <option value="Character Portrait">Character Portrait</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Concept Art">Concept Art</option>
                  <option value="Illustration">Illustration</option>
                  <option value="Pixel Art">Pixel Art</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Year *
                </label>
                <Input
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="2025"
                  required
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Priority (0-10)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Medium
                </label>
                <Input
                  value={formData.medium}
                  onChange={(e) =>
                    setFormData({ ...formData, medium: e.target.value })
                  }
                  placeholder="Paint Studio on PC"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Dimensions
                </label>
                <Input
                  value={formData.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, dimensions: e.target.value })
                  }
                  placeholder="1920x1080"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags (comma-separated)
              </label>
              <Input
                value={formData.tags.join(", ")}
                onChange={(e) => handleArrayChange("tags", e.target.value)}
                placeholder="anime, character, digital, art"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Featured Artwork
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Public (visible to visitors)
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={saving || uploadingImage}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : art ? "Update Artwork" : "Add Artwork"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={saving || uploadingImage}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  const handleSaveArt = async (artData: any) => {
    try {
      console.log('handleSaveArt called with:', artData); // Debug log
      console.log('editingArt:', editingArt); // Debug log
      
      if (editingArt) {
        console.log('Updating art with ID:', editingArt.id); // Debug log
        await artAPI.update(editingArt.id, artData);
      } else {
        console.log('Creating new art piece'); // Debug log
        await artAPI.create(artData);
      }
      await fetchArtPieces();
      setShowAddForm(false);
      setEditingArt(null);
    } catch (error) {
      console.error("Error saving art piece:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Error saving art piece: ${errorMessage}`);
    }
  };

  const handleDeleteArt = async (id: number) => {
    if (confirm("Are you sure you want to delete this art piece?")) {
      try {
        await artAPI.delete(id);
        await fetchArtPieces();
      } catch (error) {
        console.error("Error deleting art piece:", error);
        alert("Error deleting art piece. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Art Gallery Management
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Artwork
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Digital Art">Digital Art</option>
            <option value="Character Portrait">Character Portrait</option>
            <option value="Abstract">Abstract</option>
            <option value="Landscape">Landscape</option>
            <option value="Concept Art">Concept Art</option>
            <option value="Illustration">Illustration</option>
            <option value="Pixel Art">Pixel Art</option>
          </select>
        </div>
      </div>

      {/* Art Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : artPieces.length === 0 ? (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
            No artworks found
          </h3>
          <p className="text-slate-500 dark:text-slate-500 mb-4">
            {searchTerm || filterCategory
              ? "Try adjusting your search or filter"
              : "Get started by adding your first artwork"}
          </p>
          {!searchTerm && !filterCategory && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Artwork
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artPieces.map((art, index) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-black rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Art Preview */}
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 relative">
                {art.imageUrl ? (
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Palette className="w-16 h-16 text-purple-500/50" />
                  </div>
                )}
                {art.featured && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-800 fill-current" />
                    </div>
                  </div>
                )}
                {!art.isPublic && (
                  <div className="absolute top-4 left-4">
                    <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      Private
                    </div>
                  </div>
                )}
              </div>

              {/* Art Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                      {art.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {art.category} • {art.year}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {art.medium || "Digital Art"}
                    </p>
                    {art.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                        {art.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingArt(art)}
                      className="hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteArt(art.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {art.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {art.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                        +{art.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{art.likes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{art.views || 0}</span>
                    </div>
                    {art.priority > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{art.priority}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* Add/Edit Form */}
      {(showAddForm || editingArt) && (
        <ArtForm
          art={editingArt}
          onSave={handleSaveArt}
          onCancel={() => {
            setShowAddForm(false);
            setEditingArt(null);
          }}
        />
      )}
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  const [settings, setSettings] = useState({
    siteName: "SB. Portfolio",
    siteDescription: "Software Developer, Game Developer, and Digital Artist",
    email: "dev@boussettahsalah.online",
    socialLinks: {
      github: "https://github.com/SallahBoussettah",
      linkedin: "https://linkedin.com/in/salahboussettah",
      twitter: "https://twitter.com/salahboussettah",
    },
    seoSettings: {
      metaTitle: "Salah Eddine Boussettah - Developer & Artist",
      metaDescription:
        "Portfolio of Salah Eddine Boussettah - Software Developer, Game Developer, and Digital Artist",
      keywords: "developer, game development, digital art, web development",
    },
  });

  const handleSave = () => {
    // Here you would typically save to a backend or local storage
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Settings
      </h2>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          General Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Site Name
            </label>
            <Input
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Site Description
            </label>
            <Textarea
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Contact Email
            </label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          Social Links
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              GitHub URL
            </label>
            <Input
              value={settings.socialLinks.github}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    github: e.target.value,
                  },
                })
              }
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              LinkedIn URL
            </label>
            <Input
              value={settings.socialLinks.linkedin}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    linkedin: e.target.value,
                  },
                })
              }
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Twitter URL
            </label>
            <Input
              value={settings.socialLinks.twitter}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    twitter: e.target.value,
                  },
                })
              }
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      </motion.div>

      {/* SEO Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          SEO Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Meta Title
            </label>
            <Input
              value={settings.seoSettings.metaTitle}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoSettings: {
                    ...settings.seoSettings,
                    metaTitle: e.target.value,
                  },
                })
              }
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Meta Description
            </label>
            <Textarea
              value={settings.seoSettings.metaDescription}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoSettings: {
                    ...settings.seoSettings,
                    metaDescription: e.target.value,
                  },
                })
              }
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Keywords
            </label>
            <Input
              value={settings.seoSettings.keywords}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoSettings: {
                    ...settings.seoSettings,
                    keywords: e.target.value,
                  },
                })
              }
              placeholder="Separate keywords with commas"
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "projects":
        return <ProjectsTab />;
      case "art":
        return <ArtTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <ClientOnly>
          <ThemeToggle />
        </ClientOnly>

        {/* Main Content */}
        <div className="ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-black dark:text-white mb-2"
              >
                Admin Dashboard
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 dark:text-slate-400"
              >
                Manage your portfolio content and settings
              </motion.p>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderActiveTab()}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
