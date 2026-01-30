"use client";

/**
 * Audio Management Page
 * Phase 5 - List, download, and upload audio
 */

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface AudioItem {
  id: number;
  title: string;
  artist: string;
  description?: string;
  lat: number;
  lon: number;
}

export default function AudioPage() {
  const router = useRouter();
  const [audioList, setAudioList] = useState<AudioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    artist: "",
    description: "",
    lat: "",
    lon: "",
    audio: null as File | null,
  });

  // Fetch audio list on mount
  useEffect(() => {
    fetchAudioList();
  }, []);

  const fetchAudioList = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/proxy/audio/list");
      const data = await response.json();

      if (!response.ok) {
        // Handle auth failure
        if (data.error === "Auth failed") {
          handleAuthFailure();
          return;
        }
        throw new Error(data.error || "Failed to fetch audio list");
      }

      setAudioList(data);
    } catch (err) {
      console.error("Error fetching audio list:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch audio list"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (audioId: number, title: string) => {
    try {
      setDownloadingId(audioId);

      const response = await fetch(`/api/proxy/audio/download/${audioId}`);

      if (!response.ok) {
        const data = await response.json();
        if (data.error === "Auth failed") {
          handleAuthFailure();
          return;
        }
        throw new Error("Failed to download audio");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, "_")}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccessMessage(`Downloaded: ${title}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error downloading audio:", err);
      setError(
        err instanceof Error ? err.message : "Failed to download audio"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const handleUploadSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("artist", uploadForm.artist);
      formData.append("lat", uploadForm.lat);
      formData.append("lon", uploadForm.lon);
      if (uploadForm.description) {
        formData.append("description", uploadForm.description);
      }
      if (uploadForm.audio) {
        formData.append("audio", uploadForm.audio);
      }

      const response = await fetch("/api/proxy/audio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Auth failed") {
          handleAuthFailure();
          return;
        }
        throw new Error(data.error || "Upload failed");
      }

      setSuccessMessage("Audio uploaded successfully!");
      setShowUploadForm(false);
      setUploadForm({
        title: "",
        artist: "",
        description: "",
        lat: "",
        lon: "",
        audio: null,
      });
      // Refresh audio list
      fetchAudioList();
    } catch (err) {
      console.error("Error uploading audio:", err);
      setError(err instanceof Error ? err.message : "Failed to upload audio");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAuthFailure = () => {
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
            <h1 className="text-2xl font-bold text-gray-900">
              Audio Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage audio files and uploads
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              {showUploadForm ? "Cancel Upload" : "Upload Audio"}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
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

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Upload New Audio
            </h2>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Artist *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadForm.artist}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, artist: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={uploadForm.lat}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, lat: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={uploadForm.lon}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, lon: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Audio File *
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  required
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      audio: e.target.files?.[0] || null,
                    })
                  }
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isUploading ? "Uploading..." : "Upload Audio"}
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading audio list...</p>
          </div>
        ) : (
          /* Audio List Table */
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Artist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {audioList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No audio files found
                    </td>
                  </tr>
                ) : (
                  audioList.map((audio) => (
                    <tr key={audio.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {audio.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {audio.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {audio.artist}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {audio.lat.toFixed(4)}, {audio.lon.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {audio.description || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleDownload(audio.id, audio.title)}
                          disabled={downloadingId === audio.id}
                          className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {downloadingId === audio.id
                            ? "Downloading..."
                            : "Download"}
                        </button>
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
