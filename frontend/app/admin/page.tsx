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
  const stats = [
    { label: "Total Projects", value: "12", icon: Code, color: "blue" },
    { label: "Art Pieces", value: "28", icon: Palette, color: "purple" },
    { label: "Total Views", value: "15.2K", icon: Eye, color: "green" },
    { label: "GitHub Stars", value: "156", icon: Star, color: "yellow" },
  ];

  const recentActivity = [
    {
      action: "Added new project",
      item: "E-Commerce Platform",
      time: "2 hours ago",
    },
    {
      action: "Updated art piece",
      item: "Digital Landscape",
      time: "5 hours ago",
    },
    {
      action: "Modified project",
      item: "Task Management App",
      time: "1 day ago",
    },
    { action: "Added new artwork", item: "Neon Dreams", time: "2 days ago" },
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
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "web",
      status: "completed",
      technologies: ["React", "Node.js", "MongoDB"],
      description: "A full-stack e-commerce solution with payment integration.",
    },
    {
      id: 2,
      title: "Pixel Adventure Game",
      category: "game",
      status: "in-progress",
      technologies: ["Unity", "C#"],
      description: "A 2D platformer game with retro pixel art style.",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const ProjectForm = ({ project, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(
      project || {
        title: "",
        category: "web",
        status: "planning",
        technologies: [],
        description: "",
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-black rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
            {project ? "Edit Project" : "Add New Project"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Project Title
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
                >
                  <option value="web">Web Development</option>
                  <option value="game">Game Development</option>
                  <option value="mobile">Mobile App</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Technologies (comma-separated)
              </label>
              <Input
                value={
                  Array.isArray(formData.technologies)
                    ? formData.technologies.join(", ")
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technologies: e.target.value
                      .split(",")
                      .map((tech) => tech.trim())
                      .filter((tech) => tech),
                  })
                }
                placeholder="React, Node.js, MongoDB"
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
                placeholder="Project description..."
                rows={4}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {project ? "Update Project" : "Add Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
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

  const handleSaveProject = (projectData: any) => {
    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? { ...projectData, id: editingProject.id }
            : p
        )
      );
      setEditingProject(null);
    } else {
      setProjects([...projects, { ...projectData, id: Date.now() }]);
      setShowAddForm(false);
    }
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Projects Management
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-4 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.category === "web"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        : project.category === "game"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
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
                        : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingProject(project)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string, techIndex: number) => (
                <span
                  key={techIndex}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

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
  const [artPieces, setArtPieces] = useState([
    {
      id: 1,
      title: "Digital Landscape",
      category: "Digital Art",
      medium: "Paint Studio on PC",
      year: "2025",
      likes: 142,
      views: 2100,
      featured: true,
    },
    {
      id: 2,
      title: "Neon Dreams",
      category: "Abstract",
      medium: "Paint Studio X",
      year: "2024",
      likes: 89,
      views: 1800,
      featured: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArt, setEditingArt] = useState<any>(null);

  const ArtForm = ({ art, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(
      art || {
        title: "",
        category: "Digital Art",
        medium: "Paint Studio on PC",
        year: new Date().getFullYear().toString(),
        featured: false,
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        likes: art?.likes || 0,
        views: art?.views || 0,
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-black rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
            {art ? "Edit Artwork" : "Add New Artwork"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Artwork Title
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-black dark:text-white"
                >
                  <option value="Digital Art">Digital Art</option>
                  <option value="Character Portrait">Character Portrait</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Concept Art">Concept Art</option>
                </select>
              </div>

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
            </div>

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

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {art ? "Update Artwork" : "Add Artwork"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
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

  const handleSaveArt = (artData: any) => {
    if (editingArt) {
      setArtPieces(
        artPieces.map((a) =>
          a.id === editingArt.id ? { ...artData, id: editingArt.id } : a
        )
      );
      setEditingArt(null);
    } else {
      setArtPieces([...artPieces, { ...artData, id: Date.now() }]);
      setShowAddForm(false);
    }
  };

  const handleDeleteArt = (id: number) => {
    setArtPieces(artPieces.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
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

      {/* Art Grid */}
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
              <div className="absolute inset-0 flex items-center justify-center">
                <Palette className="w-16 h-16 text-purple-500/50" />
              </div>
              {art.featured && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-800 fill-current" />
                  </div>
                </div>
              )}
            </div>

            {/* Art Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                    {art.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {art.category} • {art.year}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {art.medium}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingArt(art)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteArt(art.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{art.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{art.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
