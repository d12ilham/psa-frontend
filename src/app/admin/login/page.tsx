"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { loginCms } from "@/lib/cmsApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@psa.org.au");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginCms(email, password);
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to CMS backend. Ensure cms-backend is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF0] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E8DA] shadow-sm overflow-hidden">
        <div className="bg-[#252D02] px-7 py-6 text-white">
          <div className="text-xs font-bold uppercase tracking-wider text-[#B2DB79]">
            Public Skills Australia
          </div>
          <h1 className="text-2xl font-extrabold mt-1">DWIR CMS Admin Portal</h1>
          <p className="text-xs text-white/75 mt-1">
            Manage Workforce Insights Reports, future-year templates, CTA colours, and citations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#535862] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#598303] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E8DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#8AC900]"
                placeholder="admin@psa.org.au"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#535862] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#598303] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E8DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#8AC900]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-[#8AC900] hover:bg-[#699A05] hover:text-white text-[#252D02] font-bold text-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? "Signing in..." : "Sign in to CMS"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="bg-[#F0F5DF] border border-[#E5E8DA] rounded-lg p-3 text-xs text-[#252D02]">
            <div className="font-bold mb-1">Seeded Dev Credentials</div>
            <div>Super Admin: <code>admin@psa.org.au</code> / <code>Admin123!</code></div>
            <div>Editor: <code>editor@psa.org.au</code> / <code>Editor123!</code></div>
          </div>

          <div className="text-center pt-1">
            <Link
              href="/reports"
              className="text-xs font-semibold text-[#598303] hover:underline"
            >
              ← Back to Public Reports
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
