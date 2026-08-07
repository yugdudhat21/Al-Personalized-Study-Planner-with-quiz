'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Bell, Calendar, User, Tag, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-red-950/50 via-purple-950/40 to-slate-900 border border-red-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-2xl text-red-400">
          <Megaphone className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Class Notice Board
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
              Live Broadcasts
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Official announcements, exam notifications, and urgent class updates from your faculty.
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading notices...</div>
        ) : announcements.length > 0 ? (
          announcements.map((notice) => (
            <div
              key={notice.id}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-3 relative overflow-hidden group hover:border-red-500/40 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      notice.priority === 'Urgent'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {notice.priority === 'Urgent' ? '🚨 Urgent' : '📌 Notice'}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {notice.category}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  {notice.date}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {notice.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <User className="w-4 h-4 text-purple-400" /> {notice.author}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Verified Announcement
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center text-slate-400">
            No active class notices at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
