"use client";

// Gebruikersbeheer - Admin kan users bekijken, rollen wijzigen en verwijderen

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  role: "admin" | "user";
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/proxy/admin/user");
      const data = await response.json();

      if (!response.ok) {
        // Handle auth failure
        if (data.error === "Auth failed") {
          handleAuthFailure();
          return;
        }
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRole = async (userId: number) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`/api/proxy/admin/user/${userId}`, {
        method: "PUT",
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle auth failure
        if (data.error === "Auth failed") {
          handleAuthFailure();
          return;
        }
        throw new Error(data.error || "Failed to toggle role");
      }

      // Success - refresh user list
      setSuccessMessage("User role updated successfully");
      await fetchUsers();
    } catch (err) {
      console.error("Error toggling role:", err);
      setError(err instanceof Error ? err.message : "Failed to toggle role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`/api/proxy/admin/user/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle auth failure
        if (data.error === "Auth failed") {
          handleAuthFailure();
          return;
        }
        throw new Error(data.error || "Failed to delete user");
      }

      // Success - refresh user list
      setSuccessMessage("User deleted successfully");
      setDeleteConfirm(null);
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err instanceof Error ? err.message : "Failed to delete user");
      setDeleteConfirm(null);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAuthFailure = () => {
    // Clear cookies by calling logout endpoint
    fetch("/api/auth/logout", { method: "POST" })
      .then(() => {
        router.push("/login");
        router.refresh();
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        router.push("/login");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage user accounts and roles
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          /* Users Table */
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {user.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {/* Toggle Role Button */}
                          <button
                            onClick={() => handleToggleRole(user.id)}
                            disabled={actionLoading === user.id}
                            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:bg-gray-400"
                          >
                            {actionLoading === user.id ? "..." : "Toggle Role"}
                          </button>

                          {/* Delete Button */}
                          {deleteConfirm === user.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={actionLoading === user.id}
                                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:bg-gray-400"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={actionLoading === user.id}
                                className="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user.id)}
                              disabled={actionLoading === user.id}
                              className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:bg-gray-400"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
