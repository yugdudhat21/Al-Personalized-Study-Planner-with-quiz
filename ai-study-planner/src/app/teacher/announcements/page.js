'use client';

import { useState, useEffect } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import {
  Megaphone,
  PlusCircle,
  Bell,
  Send,
  User,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Urgent');
  const [category, setCategory] = useState('Exam Alert');

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
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

  const handlePost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and announcement content are required.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, priority, category }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Announcement broadcasted to students!');
        setTitle('');
        setContent('');
        fetchAnnouncements();
      } else {
        toast.error(data.error || 'Failed to post announcement.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error posting announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-900/40 via-purple-900/30 to-indigo-900/40 border border-red-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-red-600 to-purple-600 rounded-2xl shadow-lg glow-accent text-white">
              <Megaphone className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Class Notice Board & Broadcasts
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Publish urgent notices, exam alerts, and homework updates directly to students' portals.
              </p>
            </div>
          </div>
        </div>

        {/* Main Layout: Post Form (Left 5 cols) & Live Broadcast Feed (Right 7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form */}
          <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-red-500" />
              New Broadcast Notice
            </h2>

            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Announcement Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics Mid-Term Exam Date Confirmed"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Priority Tag
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Urgent">🚨 Urgent</option>
                    <option value="Normal">📌 Normal</option>
                    <option value="Low">ℹ️ Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Exam Alert">Exam Alert</option>
                    <option value="Homework">Homework</option>
                    <option value="Class Update">Class Update</option>
                    <option value="General Note">General Note</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Detailed Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Write full details for students..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a2333] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Broadcast Notice Now
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Feed */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" /> Active Class Notices ({announcements.length})
              </span>
            </h2>

            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading notices...</div>
            ) : announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                              item.priority === 'Urgent'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            {item.priority === 'Urgent' ? '🚨 Urgent' : '📌 Notice'}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                      </div>

                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {item.date}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-semibold">
                        <User className="w-3.5 h-3.5 text-indigo-400" /> {item.author}
                      </span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Broadcasted to Students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center text-slate-400">
                No notices broadcasted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
