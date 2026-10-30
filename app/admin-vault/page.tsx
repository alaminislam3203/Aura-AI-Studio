"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ActivityIcon,
  BarChart3Icon,
  CrownIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  HomeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LayersIcon,
  Loader2Icon,
  LockIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Trash2Icon,
  UsersIcon,
  WalletIcon,
  Wand2Icon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isAdminEmail } from "@/lib/admin-auth";

interface AdminStats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalGenerations: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  estimatedMrr: number;
}

interface ToolBreakdownItem {
  toolType: string;
  count: number;
  percentage: number;
}

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  plan: "FREE" | "PRO";
  usageCount: number;
  usageLimit: number;
  stripeCustomerId: string | null;
  createdAt: string;
}

interface AdminGeneration {
  id: string;
  userId: string;
  originalImageUrl: string;
  originalFileName: string | null;
  resultImageUrl: string;
  toolType: string;
  prompt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    plan: "FREE" | "PRO";
  };
}

interface AdminSubscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

type AdminSection = "overview" | "users" | "generations" | "subscriptions";

export default function AdminVaultPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<AdminSection>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [toolBreakdown, setToolBreakdown] = useState<ToolBreakdownItem[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [generations, setGenerations] = useState<AdminGeneration[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<"ALL" | "PRO" | "FREE">("ALL");
  const [selectedGeneration, setSelectedGeneration] = useState<AdminGeneration | null>(null);

  const isAuthorized = useMemo(() => {
    return status === "authenticated" && isAdminEmail(session?.user?.email);
  }, [status, session?.user?.email]);

  const fetchAdminData = async () => {
    if (!isAuthorized) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load admin metrics");
      }
      const data = await res.json();
      setStats(data.stats);
      setToolBreakdown(data.toolBreakdown || []);
      setUsers(data.users || []);
      setGenerations(data.generations || []);
      setSubscriptions(data.subscriptions || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch admin overview");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAdminData();
    }
  }, [isAuthorized]);

  const runAdminAction = async (payload: {
    action: "togglePlan" | "resetCredits" | "addBonusCredits" | "deleteUser" | "deleteGeneration";
    userId?: string;
    generationId?: string;
  }) => {
    const busyKey = payload.userId || payload.generationId || payload.action;
    try {
      setActionBusyId(busyKey);
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to execute action");
      }
      toast.success(data.message || "Action completed");
      if (payload.action === "deleteGeneration" && selectedGeneration?.id === payload.generationId) {
        setSelectedGeneration(null);
      }
      await fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || "Admin action failed");
    } finally {
      setActionBusyId(null);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (planFilter !== "ALL" && u.plan !== planFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (u.name && u.name.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q) ||
        (u.stripeCustomerId && u.stripeCustomerId.toLowerCase().includes(q))
      );
    });
  }, [users, searchQuery, planFilter]);

  // Filtered Generations
  const filteredGenerations = useMemo(() => {
    return generations.filter((g) => {
      if (planFilter !== "ALL" && g.user.plan !== planFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        g.toolType.toLowerCase().includes(q) ||
        (g.prompt && g.prompt.toLowerCase().includes(q)) ||
        (g.user.name && g.user.name.toLowerCase().includes(q)) ||
        g.user.email.toLowerCase().includes(q)
      );
    });
  }, [generations, searchQuery, planFilter]);

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) return subscriptions;
    const q = searchQuery.toLowerCase();
    return subscriptions.filter(
      (s) =>
        s.stripeSubscriptionId.toLowerCase().includes(q) ||
        s.stripeCustomerId.toLowerCase().includes(q) ||
        (s.user.name && s.user.name.toLowerCase().includes(q)) ||
        s.user.email.toLowerCase().includes(q)
    );
  }, [subscriptions, searchQuery]);

  const handleExportCsv = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    const targetTab = activeTab === "overview" ? "users" : activeTab;

    if (targetTab === "users") {
      headers = ["ID", "Name", "Email", "Plan", "UsageCount", "UsageLimit", "StripeCustomerId", "JoinedAt"];
      rows = filteredUsers.map((u) => [
        u.id,
        u.name || "",
        u.email,
        u.plan,
        String(u.usageCount),
        String(u.usageLimit),
        u.stripeCustomerId || "",
        u.createdAt,
      ]);
    } else if (targetTab === "generations") {
      headers = ["ID", "UserEmail", "Plan", "ToolType", "Prompt", "ResultURL", "CreatedAt"];
      rows = filteredGenerations.map((g) => [
        g.id,
        g.user.email,
        g.user.plan,
        g.toolType,
        g.prompt || "",
        g.resultImageUrl,
        g.createdAt,
      ]);
    } else {
      headers = ["ID", "UserEmail", "StripeSubscriptionId", "StripeCustomerId", "Status", "CreatedAt"];
      rows = filteredSubscriptions.map((s) => [
        s.id,
        s.user.email,
        s.stripeSubscriptionId,
        s.stripeCustomerId,
        s.status,
        s.createdAt,
      ]);
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aura-admin-${targetTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} ${targetTab} records to CSV.`);
  };

  const NAV_ITEMS: {
    id: AdminSection;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: "overview",
      label: "Overview & Analytics",
      desc: "KPIs, MRR & tool insights",
      icon: LayoutDashboardIcon,
    },
    {
      id: "users",
      label: "User Management",
      desc: "Plans, credits & accounts",
      icon: UsersIcon,
      badge: users.length,
    },
    {
      id: "generations",
      label: "Image Moderation",
      desc: "Inspect & manage AI edits",
      icon: LayersIcon,
      badge: generations.length,
    },
    {
      id: "subscriptions",
      label: "Stripe Subscriptions",
      desc: "Billing & active Pro tiers",
      icon: CrownIcon,
      badge: subscriptions.length,
    },
  ];

  // =========================================================================
  // 1. Loading State
  // =========================================================================
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2Icon className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Verifying Operator Credentials...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. Unauthenticated Challenge
  // =========================================================================
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 text-center backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.85)]">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <LockIcon className="size-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Admin Vault Access
          </h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            This route is restricted to authorized operators. Please sign in with
            your designated administrator Google account.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              type="button"
              onClick={() => signIn("google")}
              className="studio-primary-action w-full rounded-xl py-2.5 text-xs font-semibold"
            >
              <LogInIcon className="mr-2 size-4" /> Sign In with Administrator Account
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-xl text-xs text-muted-foreground hover:text-foreground"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. Unauthorized Email
  // =========================================================================
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/20 bg-card/60 p-8 text-center backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.85)]">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <ShieldAlertIcon className="size-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            The account <span className="font-mono text-foreground font-semibold">{session?.user?.email}</span> does not have administrative privileges for the vault.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => signOut()}
              className="w-full rounded-xl border-white/15 bg-white/5 py-2.5 text-xs font-medium text-foreground hover:bg-white/10"
            >
              <LogOutIcon className="mr-2 size-4" /> Sign Out & Switch Account
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-xl text-xs text-muted-foreground hover:text-foreground"
            >
              <Link href="/">Return to Public Site</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];

  // =========================================================================
  // 4. Authorized Sidebar Command Center Layout
  // =========================================================================
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/10 bg-[#0e0c0e]/95 p-4 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-visible">
                <Image
                  src="/logo.png"
                  alt="Aura Studio"
                  width={500}
                  height={500}
                  unoptimized
                  className="h-9 w-9 max-h-none max-w-none origin-left scale-[1.45] object-contain"
                />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-white">
                    Aura Vault
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Operator Command Center
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-white/10 hover:text-white lg:hidden cursor-pointer"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          {/* Primary Navigation Menu */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">
              Management Console
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left transition-all cursor-pointer ${
                    isActive
                      ? "border border-primary/50 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-white shadow-[0_4px_20px_rgba(255,90,20,0.18)]"
                      : "border border-transparent text-muted-foreground hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                        isActive
                          ? "border-primary/60 bg-primary text-black shadow-sm"
                          : "border-white/10 bg-white/5 text-muted-foreground group-hover:text-white"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs truncate ${isActive ? "font-bold text-white" : "font-medium"}`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {typeof item.badge === "number" && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                        isActive
                          ? "bg-primary text-black"
                          : "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Platform Shortcuts */}
          <div className="space-y-1 pt-2 border-t border-white/10">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">
              Quick Shortcuts
            </p>
            <Link
              href="/playground"
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Wand2Icon className="size-4 text-primary" />
                <span>AI Studio Playground</span>
              </span>
              <ExternalLinkIcon className="size-3 opacity-60" />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <HomeIcon className="size-4 text-amber-400" />
                <span>Public Landing Page</span>
              </span>
              <ExternalLinkIcon className="size-3 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Bottom Operator Session Card */}
        <div className="space-y-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-black/40 p-2.5">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Admin"}
                className="size-9 rounded-full object-cover border border-primary/40 shrink-0"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {session?.user?.email?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {session?.user?.name || "System Operator"}
              </p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="w-full rounded-xl border-white/15 bg-white/5 text-xs text-muted-foreground hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-500/30 cursor-pointer"
          >
            <LogOutIcon className="mr-1.5 size-3.5" /> Sign Out Session
          </Button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Sticky Workspace Bar */}
        <header className="sticky top-0 z-30 flex flex-col gap-3 border-b border-white/10 bg-background/85 px-4 py-3.5 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-foreground hover:bg-white/10 lg:hidden cursor-pointer"
              aria-label="Open Sidebar"
            >
              <MenuIcon className="size-4" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>{currentNav.label}</span>
              </h1>
              <p className="text-xs text-muted-foreground">{currentNav.desc}</p>
            </div>
          </div>

          {/* Search, Filter & Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {activeTab !== "overview" && (
              <div className="relative w-full sm:w-56">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full rounded-full border border-white/15 bg-black/40 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {(activeTab === "users" || activeTab === "generations") && (
              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-0.5 text-[11px]">
                {(["ALL", "PRO", "FREE"] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPlanFilter(tier)}
                    className={`rounded-full px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                      planFilter === tier
                        ? "bg-primary text-black font-bold"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="h-8 rounded-full border-white/15 bg-white/5 px-3 text-xs text-foreground hover:bg-white/10 cursor-pointer"
            >
              <DownloadIcon className="mr-1.5 size-3.5 text-primary" />
              Export CSV
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchAdminData}
              disabled={isLoading}
              className="h-8 rounded-full border-white/15 bg-white/5 px-3 text-xs text-foreground hover:bg-white/10 cursor-pointer"
            >
              <RefreshCwIcon className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </header>

        {/* Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* KPI Cards (Always visible on Overview, compact context on other tabs) */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div
              onClick={() => setActiveTab("users")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Registered Users</span>
                <UsersIcon className="size-4 text-primary" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                {stats?.totalUsers ?? 0}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="text-amber-400 font-semibold">{stats?.proUsers ?? 0} PRO</span>
                <span>•</span>
                <span>{stats?.freeUsers ?? 0} Free</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("generations")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Total AI Edits</span>
                <ImageIcon className="size-4 text-orange-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                {stats?.totalGenerations ?? 0}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Across all 16 native studio tools
              </div>
            </div>

            <div
              onClick={() => setActiveTab("subscriptions")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Active Subscriptions</span>
                <CrownIcon className="size-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                {stats?.activeSubscriptions ?? 0}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {stats?.totalSubscriptions ?? 0} Stripe billing records
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Estimated MRR</span>
                <WalletIcon className="size-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                ${stats?.estimatedMrr ?? 0}
              </div>
              <div className="mt-1 text-[11px] text-emerald-400 font-medium">
                Based on $19/mo Pro tier
              </div>
            </div>
          </section>

          {/* SECTION 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* AI Tool Popularity Distribution */}
              <section className="rounded-3xl border border-white/10 bg-card/35 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3Icon className="size-4 text-primary" />
                    <h2 className="text-sm font-bold text-white">
                      AI Tool Usage Distribution
                    </h2>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {stats?.totalGenerations ?? 0} total transformations
                  </span>
                </div>

                {toolBreakdown.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No AI transformations recorded yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {toolBreakdown.map((item) => (
                      <div
                        key={item.toolType}
                        className="rounded-xl border border-white/8 bg-black/30 p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white truncate">{item.toolType}</span>
                          <span className="font-mono text-[11px] text-primary font-bold">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
                            style={{ width: `${Math.max(4, item.percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Recent Users & Recent Generations Split Preview */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Latest 5 Users */}
                <div className="rounded-3xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="size-4 text-primary" />
                      <h3 className="text-sm font-bold text-white">Recent Users</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("users")}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Manage All ({users.length}) →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {users.slice(0, 5).map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/30 p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name || "User"}
                              className="size-8 rounded-full object-cover border border-white/15 shrink-0"
                            />
                          ) : (
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold">
                              {u.name?.[0] || u.email[0].toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">
                              {u.name || "Anonymous User"}
                            </p>
                            <p className="truncate font-mono text-[11px] text-muted-foreground">
                              {u.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {u.plan === "PRO" ? (
                            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                              PRO
                            </span>
                          ) : (
                            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                              {u.usageCount}/{u.usageLimit}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest 4 Image Edits */}
                <div className="rounded-3xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ActivityIcon className="size-4 text-primary" />
                      <h3 className="text-sm font-bold text-white">Recent AI Generations</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("generations")}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      View All ({generations.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {generations.slice(0, 4).map((gen) => (
                      <div
                        key={gen.id}
                        onClick={() => setSelectedGeneration(gen)}
                        className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/50"
                      >
                        <img
                          src={gen.resultImageUrl}
                          alt={gen.toolType}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 flex items-center justify-between">
                          <span className="truncate rounded bg-primary/20 border border-primary/40 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                            {gen.toolType}
                          </span>
                          <EyeIcon className="size-3 text-white/80" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: USER MANAGEMENT TABLE */}
          {activeTab === "users" && (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-muted-foreground uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">User</th>
                      <th className="px-4 py-3.5">Plan</th>
                      <th className="px-4 py-3.5">Usage / Limit</th>
                      <th className="px-4 py-3.5">Joined Date</th>
                      <th className="px-5 py-3.5 text-right">Operator Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                          No registered users found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isBusy = actionBusyId === user.id;
                        return (
                          <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                {user.image ? (
                                  <img
                                    src={user.image}
                                    alt={user.name || "User"}
                                    className="size-8 rounded-full border border-white/15 object-cover"
                                  />
                                ) : (
                                  <div className="flex size-8 items-center justify-center rounded-full bg-white/10 font-bold text-foreground">
                                    {user.name?.[0] || user.email[0].toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-white">{user.name || "Anonymous User"}</div>
                                  <div className="text-[11px] text-muted-foreground font-mono">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              {user.plan === "PRO" ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                                  <CrownIcon className="size-3" /> PRO
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                  FREE
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 font-mono text-[11px]">
                              {user.plan === "PRO" ? (
                                <span className="text-amber-300 font-semibold">
                                  {user.usageCount} total (15/hr cap)
                                </span>
                              ) : (
                                <span>
                                  {user.usageCount} of {user.usageLimit} edits
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground text-[11px]">
                              {new Date(user.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => runAdminAction({ action: "togglePlan", userId: user.id })}
                                  className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer ${
                                    user.plan === "PRO"
                                      ? "border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10"
                                      : "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                                  }`}
                                  title={user.plan === "PRO" ? "Downgrade to FREE" : "Upgrade to PRO"}
                                >
                                  {user.plan === "PRO" ? "Set FREE" : "Make PRO"}
                                </button>

                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => runAdminAction({ action: "resetCredits", userId: user.id })}
                                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-medium text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer"
                                  title="Reset usage count to 0"
                                >
                                  <RotateCcwIcon className="size-3" /> Reset
                                </button>

                                {user.plan === "FREE" && (
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() => runAdminAction({ action: "addBonusCredits", userId: user.id })}
                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                                    title="Add +5 bonus free credits"
                                  >
                                    <PlusCircleIcon className="size-3" /> +5
                                  </button>
                                )}

                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => {
                                    if (window.confirm(`Delete user ${user.email} and all their generations?`)) {
                                      runAdminAction({ action: "deleteUser", userId: user.id });
                                    }
                                  }}
                                  className="inline-flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 p-1 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                                  title="Delete User"
                                >
                                  <Trash2Icon className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: GENERATIONS & IMAGE UPLOADS GRID */}
          {activeTab === "generations" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGenerations.length === 0 ? (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-card/40 p-12 text-center text-muted-foreground backdrop-blur-xl">
                    No image transformations found matching criteria.
                  </div>
                ) : (
                  filteredGenerations.map((gen) => (
                    <div
                      key={gen.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-[0_8px_25px_rgba(0,0,0,0.7)]"
                    >
                      <div
                        onClick={() => setSelectedGeneration(gen)}
                        className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 cursor-pointer"
                      >
                        <img
                          src={gen.resultImageUrl}
                          alt="Transformation result"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex items-end justify-between">
                          <span className="rounded-md border border-primary/40 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-primary backdrop-blur-md">
                            {gen.toolType}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-white/80">
                            <EyeIcon className="size-3" /> Inspect
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2 truncate">
                            {gen.user.image ? (
                              <img
                                src={gen.user.image}
                                alt={gen.user.name || "User"}
                                className="size-5 rounded-full object-cover border border-white/15"
                              />
                            ) : (
                              <div className="flex size-5 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold">
                                {gen.user.name?.[0] || "U"}
                              </div>
                            )}
                            <span className="truncate font-semibold text-white">
                              {gen.user.name || gen.user.email}
                            </span>
                          </div>
                          <span className="text-muted-foreground text-[10px] shrink-0 font-mono">
                            {new Date(gen.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {gen.prompt && (
                          <p className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-[11px] text-zinc-300 italic truncate">
                            Prompt: &quot;{gen.prompt}&quot;
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-t border-white/5">
                          <span className="truncate max-w-[150px] font-mono">
                            {gen.originalFileName || "Uploaded Asset"}
                          </span>
                          <div className="flex items-center gap-2">
                            <a
                              href={gen.resultImageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              View Direct <ExternalLinkIcon className="size-2.5" />
                            </a>
                            <button
                              type="button"
                              disabled={actionBusyId === gen.id}
                              onClick={() =>
                                runAdminAction({
                                  action: "deleteGeneration",
                                  generationId: gen.id,
                                })
                              }
                              className="rounded p-1 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                              title="Delete Generation"
                            >
                              <Trash2Icon className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECTION 4: SUBSCRIPTIONS TABLE */}
          {activeTab === "subscriptions" && (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-muted-foreground uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Subscriber</th>
                      <th className="px-4 py-3.5">Stripe Subscription ID</th>
                      <th className="px-4 py-3.5">Stripe Customer ID</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredSubscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                          No subscription purchase records found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              {sub.user.image ? (
                                <img
                                  src={sub.user.image}
                                  alt={sub.user.name || "User"}
                                  className="size-7 rounded-full object-cover border border-white/15"
                                />
                              ) : (
                                <div className="flex size-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                                  {sub.user.name?.[0] || "U"}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-white">{sub.user.name || "Subscriber"}</div>
                                <div className="text-[11px] text-muted-foreground font-mono">{sub.user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-300">
                            {sub.stripeSubscriptionId}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                            {sub.stripeCustomerId}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                sub.status === "active"
                                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                  : "border border-zinc-500/40 bg-zinc-500/10 text-zinc-400"
                              }`}
                            >
                              <span className="size-1.5 rounded-full bg-current" />
                              {sub.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground text-[11px]">
                            {new Date(sub.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox Modal for Full Image Inspection */}
      {selectedGeneration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Transformation Inspection</span>
                  <span className="rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs text-primary font-mono">
                    {selectedGeneration.toolType}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  By {selectedGeneration.user.name || selectedGeneration.user.email} on{" "}
                  {new Date(selectedGeneration.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGeneration(null)}
                className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-center">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Original Source Image
                </span>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/50">
                  <img
                    src={selectedGeneration.originalImageUrl}
                    alt="Original source"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-center">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Transformed Result
                </span>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-primary/30 bg-black/50">
                  <img
                    src={selectedGeneration.resultImageUrl}
                    alt="Transformed result"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {selectedGeneration.prompt && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-zinc-300">
                <strong className="text-primary font-semibold">User Prompt:</strong> &quot;{selectedGeneration.prompt}&quot;
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={actionBusyId === selectedGeneration.id}
                onClick={() =>
                  runAdminAction({
                    action: "deleteGeneration",
                    generationId: selectedGeneration.id,
                  })
                }
                className="rounded-xl border-rose-500/30 bg-rose-500/10 text-xs text-rose-400 hover:bg-rose-500/20 cursor-pointer"
              >
                <Trash2Icon className="mr-1.5 size-3.5" /> Delete Record
              </Button>

              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-xl text-xs">
                  <a href={selectedGeneration.originalImageUrl} target="_blank" rel="noreferrer">
                    Open Original <ExternalLinkIcon className="ml-1.5 size-3" />
                  </a>
                </Button>
                <Button asChild size="sm" className="studio-primary-action rounded-xl text-xs font-semibold">
                  <a href={selectedGeneration.resultImageUrl} target="_blank" rel="noreferrer">
                    Open Result <ExternalLinkIcon className="ml-1.5 size-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
