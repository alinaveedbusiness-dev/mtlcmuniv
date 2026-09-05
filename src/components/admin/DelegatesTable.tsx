"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { DelegateRegistration } from "@/lib/types";
import ReceiptModal from "./ReceiptModal";

interface DelegatesTableProps {
  initialDelegates: DelegateRegistration[];
  onDelegateUpdated?: () => void;
}

export default function DelegatesTable({
  initialDelegates,
  onDelegateUpdated,
}: DelegatesTableProps) {
  const [delegates, setDelegates] = useState<DelegateRegistration[]>(initialDelegates);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [committeeFilter, setCommitteeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [activeReceiptDelegate, setActiveReceiptDelegate] = useState<DelegateRegistration | null>(
    null
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter delegates
  const filteredDelegates = useMemo(() => {
    return delegates.filter((d) => {
      // Status filter
      if (statusFilter !== "ALL" && d.status !== statusFilter) {
        return false;
      }
      // Committee filter
      if (committeeFilter !== "ALL" && d.committee !== committeeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = d.fullName.toLowerCase().includes(q);
        const matchEmail = d.email.toLowerCase().includes(q);
        const matchPhone = d.phone.toLowerCase().includes(q);
        const matchId = d.id.toLowerCase().includes(q);
        const matchInst = (d.institution || "").toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchId && !matchInst) {
          return false;
        }
      }
      return true;
    });
  }, [delegates, statusFilter, committeeFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDelegates.length / pageSize) || 1;
  const paginatedDelegates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDelegates.slice(start, start + pageSize);
  }, [filteredDelegates, currentPage, pageSize]);

  // Status update handler
  const handleStatusChange = async (
    id: string,
    newStatus: "Pending" | "Verified" | "Rejected"
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/delegates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const data = await res.json();

      setDelegates((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );

      if (onDelegateUpdated) onDelegateUpdated();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update delegate status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete handler
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove delegate dossier: "${name}" (${id})?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/delegates/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete delegate");

      setDelegates((prev) => prev.filter((d) => d.id !== id));
      if (onDelegateUpdated) onDelegateUpdated();
    } catch (err) {
      console.error("Error deleting delegate:", err);
      alert("Failed to delete delegate record.");
    } finally {
      setDeletingId(null);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    window.location.href = "/api/admin/export";
  };

  return (
    <div className="glass-panel rounded-2xl border border-gold-400/25 p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gold-400/15">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2">
            <span>Delegate Registry Conclave</span>
            <span className="text-xs font-sans font-normal text-gold-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-gold-400/30">
              {filteredDelegates.length} Registrations
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            Inspect credentials, preview payment receipts, and assign verified status.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-gold px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-gold-subtle shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by delegate name, email, WhatsApp, or ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 text-xs placeholder-stone-500"
          />
        </div>

        {/* Committee Filter */}
        <div className="sm:col-span-3">
          <select
            value={committeeFilter}
            onChange={(e) => {
              setCommitteeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 text-xs cursor-pointer"
          >
            <option value="ALL">All Committees</option>
            <option value="UNSC">UNSC</option>
            <option value="UNHRC">UNHRC</option>
            <option value="UNW">UNW</option>
            <option value="DISEC">DISEC</option>
            <option value="PNA">PNA</option>
            <option value="CRISIS">CRISIS</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 text-xs cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending Only</option>
            <option value="Verified">Verified Only</option>
            <option value="Rejected">Rejected Only</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-stone-800 bg-emerald-950/40">
        <table className="w-full text-left text-xs text-stone-300">
          <thead className="bg-emerald-950/90 text-[11px] uppercase tracking-wider font-serif text-gold-300 border-b border-gold-400/20">
            <tr>
              <th className="py-3.5 px-4">Tracking Code &amp; Date</th>
              <th className="py-3.5 px-4">Delegate &amp; Institution</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Committee</th>
              <th className="py-3.5 px-4 text-center">Payment Proof</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60 font-sans">
            {paginatedDelegates.length > 0 ? (
              paginatedDelegates.map((del) => (
                <tr
                  key={del.id}
                  className="hover:bg-emerald-900/20 transition-colors group"
                >
                  {/* Tracking ID & Date */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-gold-200">{del.id}</div>
                    <div className="text-[10px] text-stone-500">
                      {new Date(del.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  {/* Name & Institution */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-100 font-serif text-sm">
                      {del.fullName}
                    </div>
                    <div className="text-[11px] text-stone-400 truncate max-w-[180px]">
                      {del.institution || "Independent"}
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-stone-200">{del.email}</div>
                    <div className="text-stone-400 font-mono text-[11px]">{del.phone}</div>
                  </td>

                  {/* Committee & Experience */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-serif font-bold text-gold-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-gold-400/20">
                      {del.committee}
                    </span>
                    <div className="text-[10px] text-stone-400 mt-1">
                      Exp: {del.experience}
                    </div>
                  </td>

                  {/* Payment Receipt Preview Button */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => setActiveReceiptDelegate(del)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/50 hover:bg-gold-400/20 text-gold-300 hover:text-gold-100 border border-gold-400/30 transition-colors font-medium text-[11px]"
                      title="Inspect Payment Receipt"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>View Receipt</span>
                    </button>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <select
                        value={del.status}
                        disabled={updatingId === del.id}
                        onChange={(e) =>
                          handleStatusChange(
                            del.id,
                            e.target.value as "Pending" | "Verified" | "Rejected"
                          )
                        }
                        className={`text-[11px] font-bold py-1 px-2 rounded border focus:outline-none cursor-pointer transition-colors ${
                          del.status === "Verified"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                            : del.status === "Pending"
                            ? "bg-amber-950 text-amber-300 border-amber-500/50"
                            : "bg-red-950 text-red-300 border-red-500/50"
                        }`}
                      >
                        <option value="Pending" className="bg-emerald-950 text-amber-300">
                          Pending
                        </option>
                        <option value="Verified" className="bg-emerald-950 text-emerald-300">
                          Verified
                        </option>
                        <option value="Rejected" className="bg-emerald-950 text-red-300">
                          Rejected
                        </option>
                      </select>

                      {updatingId === del.id && (
                        <Loader2 className="w-3 h-3 text-gold-400 animate-spin" />
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(del.id, del.fullName)}
                      disabled={deletingId === del.id}
                      className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                      title="Delete Delegate Dossier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-stone-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-6 h-6 text-stone-500" />
                    <span>No delegate registrations found matching your criteria.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredDelegates.length)} of{" "}
            {filteredDelegates.length} delegates
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-emerald-950 border border-stone-800 hover:border-gold-400/40 text-stone-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-gold-300 px-2 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-emerald-950 border border-stone-800 hover:border-gold-400/40 text-stone-200 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* In-App Receipt Inspector Lightbox */}
      {activeReceiptDelegate && (
        <ReceiptModal
          delegate={activeReceiptDelegate}
          onClose={() => setActiveReceiptDelegate(null)}
        />
      )}
    </div>
  );
}
