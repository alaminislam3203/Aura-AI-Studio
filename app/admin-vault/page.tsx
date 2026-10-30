"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CrownIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  ImageIcon,
  KeyRoundIcon,
  LayersIcon,
  Loader2Icon,
  LockIcon,
  LogInIcon,
  LogOutIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
  WalletIcon,
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

export default function AdminVaultPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"users" | "generations" | "subscriptions">("users");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [generations, setGenerations] = useState<AdminGeneration[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q) ||
        (u.stripeCustomerId && u.stripeCustomerId.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  // Filtered Generations
  const filteredGenerations = useMemo(() => {
    if (!searchQuery.trim()) return generations;
    const q = searchQuery.toLowerCase();
    return generations.filter(
      (g) =>
        g.toolType.toLowerCase().includes(q) ||
        (g.prompt && g.prompt.toLowerCase().includes(q)) ||
        (g.user.name && g.user.name.toLowerCase().includes(q)) ||
        g.user.email.toLowerCase().includes(q)
    );
  }, [generations, searchQuery]);

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

  // =========================================================================
  // 4. Authorized Command Center
  // =========================================================================
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8 text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header Bar */}
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/40 text-primary">
                <ShieldCheckIcon className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                    Aura Admin Vault
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Operator Session
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unlinked command center for user metrics, images & subscriptions
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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

            <Button asChild size="sm" variant="ghost" className="h-8 rounded-full text-xs text-muted-foreground hover:text-foreground">
              <Link href="/playground">
                Studio Playground <ExternalLinkIcon className="ml-1 size-3" />
              </Link>
            </Button>

            <div className="flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-3 py-1 text-xs">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Admin"}
                  className="size-5 rounded-full object-cover border border-white/20"
                />
              )}
              <span className="font-mono text-[11px] text-zinc-300 max-w-[160px] truncate">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Overview KPI Cards */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {/* Card 1: Users */}
          <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
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

          {/* Card 2: Generations */}
          <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total AI Edits</span>
              <ImageIcon className="size-4 text-orange-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              {stats?.totalGenerations ?? 0}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Across all 10 native studio tools
            </div>
          </div>

          {/* Card 3: Active Subscriptions */}
          <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Active Subscriptions</span>
              <CrownIcon className="size-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              {stats?.activeSubscriptions ?? 0}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {stats?.totalSubscriptions ?? 0} total lifetime records
            </div>
          </div>

          {/* Card 4: Estimated MRR */}
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

        {/* Navigation Tabs & Search Controls */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-card/30 p-3 sm:flex-row sm:items-center sm:justify-between backdrop-blur-xl">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-primary text-black shadow-md font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UsersIcon className="size-3.5" />
              <span>Users ({users.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("generations")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "generations"
                  ? "bg-primary text-black shadow-md font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayersIcon className="size-3.5" />
              <span>Image Uploads ({generations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("subscriptions")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "subscriptions"
                  ? "bg-primary text-black shadow-md font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CrownIcon className="size-3.5" />
              <span>Subscriptions ({subscriptions.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full rounded-xl border border-white/10 bg-background/60 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Tab 1: Users Table */}
        {activeTab === "users" && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-muted-foreground uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-4 py-3.5">Plan</th>
                    <th className="px-4 py-3.5">Usage / Limit</th>
                    <th className="px-4 py-3.5">Stripe Customer</th>
                    <th className="px-4 py-3.5">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
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
                            <span className="text-amber-300 font-semibold">Unlimited (8/hr)</span>
                          ) : (
                            <span>{user.usageCount} of {user.usageLimit} edits</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                          {user.stripeCustomerId ? (
                            <span className="text-zinc-300">{user.stripeCustomerId}</span>
                          ) : (
                            <span className="text-zinc-600">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground text-[11px]">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
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

        {/* Tab 2: Generations & Uploads Grid */}
        {activeTab === "generations" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    {/* Visual Comparison Split View */}
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

                    {/* Metadata Card Footer */}
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
                        <span className="truncate max-w-[170px] font-mono">
                          {gen.originalFileName || "Uploaded Asset"}
                        </span>
                        <a
                          href={gen.resultImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          View Direct <ExternalLinkIcon className="size-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Subscriptions Table */}
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

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
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
      )}
    </main>
  );
}
