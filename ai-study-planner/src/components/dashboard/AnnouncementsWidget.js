'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Bell, Calendar, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
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
    }
    fetchAnnouncements();
  }, []);

  if (loading) return null;
  if (!announcements || announcements.length === 0) return null;

  const latestNotice = announcements[0];

  return (
    <div className="bg-gradient-to-r from-red-950/40 via-purple-950/30 to-indigo-950/40 border border-red-500/30 backdrop-blur-xl p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-2xl text-red-400 shrink-0">
          <Megaphone className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
              {latestNotice.priority === 'Urgent' ? '🚨 Teacher Alert' : '📌 Notice'}
            </span>
            <span className="text-xs text-slate-400 font-medium">{latestNotice.date}</span>
          </div>
          <h3 className="text-base font-bold text-white leading-snug">
            {latestNotice.title}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2">
            {latestNotice.content}
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-semibold shrink-0">
        By {latestNotice.author}
      </div>
    </div>
  );
}
