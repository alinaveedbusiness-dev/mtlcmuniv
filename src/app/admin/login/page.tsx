"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { KeyRound, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a1811] flex items-center justify-center p-6">
      <div className="w-full max-w-sm border border-[#c5a059]/30 rounded-lg p-8 bg-[#0a1811]">
        {/* Minimal Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image
              src="/images/logo.png"
              alt="MTLC MUN Seal"
              width={64}
              height={64}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-serif text-2xl text-[#f5f5f4] font-normal tracking-wide">
            Admin Conclave
          </h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#c5a059] mt-1 font-medium">
            MTLC MUN IV
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded border border-red-900/40 bg-red-950/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium mb-1.5">
              Secretariat Passkey
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-[#0a1811] border border-[#c5a059]/30 rounded px-3 py-2.5 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                autoFocus
              />
            </div>
            <p className="text-[10px] text-stone-500 mt-1.5">
              Default organizer passkey: <span className="text-stone-400 font-mono">legacy2026</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c5a059] hover:bg-[#d4af37] text-[#0a1811] font-semibold text-xs uppercase tracking-widest py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Enter Conclave</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
