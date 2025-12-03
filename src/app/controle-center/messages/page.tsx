"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  service: string | null;
  status: string;
  isImportant: boolean;
  isStarred: boolean;
  notes: string | null;
  createdAt: string;
}

type FilterStatus = "all" | "unread" | "read" | "replied" | "archived" | "starred" | "important";

const AUTO_REFRESH_INTERVAL = 10000; // 10 seconds

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      let url = "/api/admin/messages?";
      if (filter === "starred") {
        url += "isStarred=true";
      } else if (filter === "important") {
        url += "isImportant=true";
      } else if (filter !== "all") {
        url += `status=${filter}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  // Initial fetch and filter/search changes
  useEffect(() => {
    fetchMessages(true);
  }, [fetchMessages]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchMessages(false);
      }, AUTO_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, fetchMessages]);

  const updateMessage = async (id: string, updates: Partial<Message>) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? updated : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage(updated);
        }
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-HTTPS contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const markAsRead = (message: Message) => {
    if (message.status === "unread") {
      updateMessage(message.id, { status: "read" });
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    setNotes(message.notes || "");
    markAsRead(message);
  };

  const saveNotes = () => {
    if (selectedMessage) {
      updateMessage(selectedMessage.id, { notes });
      setShowNotes(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-700";
      case "read":
        return "bg-gray-100 text-gray-700";
      case "replied":
        return "bg-green-100 text-green-700";
      case "archived":
        return "bg-zinc-100 text-zinc-500";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "unread":
        return "Non lu";
      case "read":
        return "Lu";
      case "replied":
        return "Répondu";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} message(s) non lu(s)` : "Tous les messages ont été lus"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Auto-refresh indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">
                Dernière mise à jour: {lastRefresh.toLocaleTimeString("fr-FR")}
              </span>
              <button
                onClick={() => fetchMessages(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
                title="Actualiser"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            {/* Auto-refresh toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-zinc-600">Auto-sync</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${autoRefresh ? "bg-pink-600" : "bg-zinc-300"}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${autoRefresh ? "translate-x-4" : ""}`} />
                </div>
              </div>
              {autoRefresh && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </label>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-white border-r border-zinc-200 p-4">
          <nav className="space-y-1">
            {[
              { key: "all", label: "Tous", icon: "inbox" },
              { key: "unread", label: "Non lus", icon: "mail" },
              { key: "read", label: "Lus", icon: "mail-open" },
              { key: "replied", label: "Répondus", icon: "reply" },
              { key: "starred", label: "Favoris", icon: "star" },
              { key: "important", label: "Importants", icon: "flag" },
              { key: "archived", label: "Archivés", icon: "archive" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as FilterStatus)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                  filter === item.key
                    ? "bg-pink-50 text-pink-600"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {item.icon === "inbox" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                )}
                {item.icon === "mail" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {item.icon === "mail-open" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                )}
                {item.icon === "reply" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                )}
                {item.icon === "star" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
                {item.icon === "flag" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                )}
                {item.icon === "archive" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                )}
                <span className="font-medium">{item.label}</span>
                {item.key === "unread" && unreadCount > 0 && (
                  <span className="ml-auto bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Message List */}
        <div className="flex-1 flex">
          <div className={`${selectedMessage ? "w-1/2" : "w-full"} border-r border-zinc-200 bg-white overflow-hidden flex flex-col`}>
            {/* Search */}
            <div className="p-4 border-b border-zinc-200">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>Aucun message</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => openMessage(message)}
                    className={`p-4 border-b border-zinc-100 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? "bg-pink-50"
                        : message.status === "unread"
                        ? "bg-blue-50/50 hover:bg-blue-50"
                        : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status indicators */}
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMessage(message.id, { isStarred: !message.isStarred });
                          }}
                          className={`${message.isStarred ? "text-yellow-500" : "text-zinc-300 hover:text-yellow-500"}`}
                        >
                          <svg className="w-5 h-5" fill={message.isStarred ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMessage(message.id, { isImportant: !message.isImportant });
                          }}
                          className={`${message.isImportant ? "text-red-500" : "text-zinc-300 hover:text-red-500"}`}
                        >
                          <svg className="w-5 h-5" fill={message.isImportant ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`font-semibold truncate ${message.status === "unread" ? "text-zinc-900" : "text-zinc-700"}`}>
                            {message.name}
                          </span>
                          <span className="text-xs text-zinc-400 whitespace-nowrap">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm truncate mb-1 ${message.status === "unread" ? "font-medium text-zinc-800" : "text-zinc-600"}`}>
                          {message.subject}
                        </p>
                        <p className="text-sm text-zinc-500 truncate">
                          {message.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(message.status)}`}>
                            {getStatusLabel(message.status)}
                          </span>
                          {message.service && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              {message.service}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <div className="w-1/2 bg-white flex flex-col">
              {/* Detail Header */}
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => updateMessage(selectedMessage.id, { status: e.target.value })}
                    className={`text-sm px-3 py-1.5 rounded-lg border-0 ${getStatusColor(selectedMessage.status)} cursor-pointer`}
                  >
                    <option value="unread">Non lu</option>
                    <option value="read">Lu</option>
                    <option value="replied">Répondu</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNotes(true)}
                    className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"
                    title="Notes"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                  {selectedMessage.subject}
                </h2>

                {/* Contact Info */}
                <div className="bg-zinc-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 uppercase tracking-wide">Nom</label>
                      <p className="font-medium text-zinc-900">{selectedMessage.name}</p>
                    </div>
                    {selectedMessage.company && (
                      <div>
                        <label className="text-xs text-zinc-400 uppercase tracking-wide">Entreprise</label>
                        <p className="font-medium text-zinc-900">{selectedMessage.company}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs text-zinc-400 uppercase tracking-wide">Email</label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-900">{selectedMessage.email}</p>
                        <button
                          onClick={() => copyToClipboard(selectedMessage.email, "email")}
                          className="p-1 text-zinc-400 hover:text-zinc-600"
                          title="Copier"
                        >
                          {copiedField === "email" ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          )}
                        </button>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="p-1 text-zinc-400 hover:text-pink-600"
                          title="Envoyer un email"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <label className="text-xs text-zinc-400 uppercase tracking-wide">Téléphone</label>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-zinc-900">{selectedMessage.phone}</p>
                          <button
                            onClick={() => copyToClipboard(selectedMessage.phone!, "phone")}
                            className="p-1 text-zinc-400 hover:text-zinc-600"
                            title="Copier"
                          >
                            {copiedField === "phone" ? (
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            )}
                          </button>
                          <a
                            href={`tel:${selectedMessage.phone}`}
                            className="p-1 text-zinc-400 hover:text-pink-600"
                            title="Appeler"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedMessage.service && (
                    <div className="mt-4 pt-4 border-t border-zinc-200">
                      <label className="text-xs text-zinc-400 uppercase tracking-wide">Service intéressé</label>
                      <p className="font-medium text-purple-600">{selectedMessage.service}</p>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs text-zinc-400 uppercase tracking-wide mb-2 block">Message</label>
                  <div className="bg-white border border-zinc-200 rounded-xl p-4">
                    <p className="text-zinc-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedMessage.notes && (
                  <div className="mt-6">
                    <label className="text-xs text-zinc-400 uppercase tracking-wide mb-2 block">Notes internes</label>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-zinc-700 whitespace-pre-wrap">{selectedMessage.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    onClick={() => updateMessage(selectedMessage.id, { status: "replied" })}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Répondre par email
                  </a>
                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 text-zinc-700 rounded-xl hover:bg-zinc-200 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Appeler
                    </a>
                  )}
                </div>

                <p className="text-sm text-zinc-400 mt-4">
                  Reçu le {formatDate(selectedMessage.createdAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {showNotes && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Notes internes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes sur ce message..."
              className="w-full h-40 px-4 py-3 border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNotes(false)}
                className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveNotes}
                className="flex-1 px-4 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
