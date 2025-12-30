"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Plus, 
  Search,
  Settings,
  ArrowLeft,
  UserPlus,
  Shield,
  Crown
} from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import CreditConsent from "@/components/studios/CreditConsent";

interface Workspace {
  id: string;
  name: string;
  description: string;
  members: WorkspaceMember[];
  createdAt: string;
}

interface WorkspaceMember {
  id: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: string;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreditConsent, setShowCreditConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dev-studio-workspaces");
      if (saved) {
        try {
          setWorkspaces(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load workspaces", e);
        }
      }
    }
  }, []);

  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkspace = () => {
    setShowCreditConsent(true);
  };

  const handleConsent = () => {
    setShowCreditConsent(false);
    setShowNewWorkspace(true);
  };

  const handleSaveWorkspace = (workspace: Omit<Workspace, "id" | "createdAt">) => {
    const newWorkspace: Workspace = {
      ...workspace,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    const updated = [...workspaces, newWorkspace];
    setWorkspaces(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-studio-workspaces", JSON.stringify(updated));
    }
    setShowNewWorkspace(false);
  };

  const roleIcons = {
    owner: <Crown className="w-4 h-4 text-yellow-600" />,
    admin: <Shield className="w-4 h-4 text-blue-600" />,
    member: <Users className="w-4 h-4 text-slate-600" />,
    viewer: <Users className="w-4 h-4 text-slate-400" />
  };

  const roleColors = {
    owner: "bg-yellow-100 text-yellow-700",
    admin: "bg-blue-100 text-blue-700",
    member: "bg-slate-100 text-slate-700",
    viewer: "bg-slate-50 text-slate-600"
  };

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Workspaces..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href="/dev-studio/enterprise"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                      aria-label="Back to Enterprise Features"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Team Workspaces</h1>
                  </div>
                  <p className="text-base sm:text-lg text-slate-600 mt-2">
                    Collaborate with your team using shared workspaces
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCreateWorkspace}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Workspace
                  </button>
                </div>
              </div>
            </header>

            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Credit Consent */}
            {showCreditConsent && (
              <div className="mb-6">
                <CreditConsent
                  creditsRequired={100}
                  operation="Create Team Workspace"
                  onConsent={handleConsent}
                  onCancel={() => setShowCreditConsent(false)}
                />
              </div>
            )}

            {/* Workspaces List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkspaces.length === 0 ? (
                <div className="col-span-full rounded-3xl bg-white border border-slate-200 p-12 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Workspaces Found</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Create your first workspace to start collaborating"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleCreateWorkspace}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold text-white transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Workspace
                    </button>
                  )}
                </div>
              ) : (
                filteredWorkspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{workspace.name}</h3>
                        <p className="text-sm text-slate-600 mb-4">{workspace.description}</p>
                      </div>
                      <Link
                        href={`/dev-studio/enterprise/workspaces/${workspace.id}`}
                        className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                        aria-label="Manage workspace"
                      >
                        <Settings className="w-5 h-5" />
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-slate-700 mb-2">
                        Members ({workspace.members.length})
                      </div>
                      <div className="space-y-2">
                        {workspace.members.slice(0, 3).map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {roleIcons[member.role]}
                              <span className="text-sm text-slate-700">{member.email}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${roleColors[member.role]}`}>
                              {member.role}
                            </span>
                          </div>
                        ))}
                        {workspace.members.length > 3 && (
                          <div className="text-xs text-slate-500 text-center">
                            +{workspace.members.length - 3} more members
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <Link
                        href={`/dev-studio/enterprise/workspaces/${workspace.id}`}
                        className="block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold text-white transition-colors"
                      >
                        Open Workspace
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* New Workspace Form Modal */}
            {showNewWorkspace && (
              <NewWorkspaceForm
                onSave={handleSaveWorkspace}
                onCancel={() => setShowNewWorkspace(false)}
              />
            )}
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}

function NewWorkspaceForm({ onSave, onCancel }: { onSave: (workspace: Omit<Workspace, "id" | "createdAt">) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [{ email: "", role: "member" as WorkspaceMember["role"] }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      members: formData.members
        .filter(m => m.email.trim() !== "")
        .map(m => ({
          ...m,
          id: crypto.randomUUID(),
          joinedAt: new Date().toISOString()
        }))
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">New Team Workspace</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Workspace Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Initial Members</label>
            {formData.members.map((member, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) => {
                    const newMembers = [...formData.members];
                    newMembers[idx].email = e.target.value;
                    setFormData({ ...formData, members: newMembers });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="email@example.com"
                />
                <select
                  value={member.role}
                  onChange={(e) => {
                    const newMembers = [...formData.members];
                    newMembers[idx].role = e.target.value as WorkspaceMember["role"];
                    setFormData({ ...formData, members: newMembers });
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
                {formData.members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newMembers = formData.members.filter((_, i) => i !== idx);
                      setFormData({ ...formData, members: newMembers });
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, members: [...formData.members, { email: "", role: "member" }] })}
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              Create Workspace
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

