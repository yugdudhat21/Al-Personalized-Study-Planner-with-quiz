'use client';

import { useEffect } from 'react';
import TeacherLayout from '@/components/layout/TeacherLayout';
import { AlertTriangle, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { useTeacherStore } from '@/store/teacherStore';

export default function TeacherAnalyticsPage() {
  const { weakTopics, fetchClassWeakTopics } = useTeacherStore();

  useEffect(() => {
    fetchClassWeakTopics();
  }, []);

  // Aggregate weak topics by topic name for chart
  const topicMap = {};
  weakTopics.forEach((wt) => {
    if (!topicMap[wt.topic]) {
      topicMap[wt.topic] = { topic: wt.topic, count: 0, avgAccuracy: 0, totalAccuracy: 0 };
    }
    topicMap[wt.topic].count += 1;
    topicMap[wt.topic].totalAccuracy += Number(wt.accuracy || 0);
  });

  const chartData = Object.values(topicMap).map((item) => ({
    topic: item.topic,
    studentsAffected: item.count,
    accuracy: Number((item.totalAccuracy / item.count).toFixed(1)),
  }));

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-red-500" /> Class Weak Topic Analytics & Trends
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Visual breakdown of low-accuracy topics (&lt; 60%) across active student assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Students Affected per Weak Topic */}
          <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-500" /> Students Affected per Weak Topic
            </h3>
            <div className="h-64 w-full">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-slate-400">
                  No weak topics flagged yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="topic" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="studentsAffected" fill="#EF4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Average Accuracy per Flagged Topic */}
          <div className="p-6 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Topic Accuracy Level (%)
            </h3>
            <div className="h-64 w-full">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-slate-400">
                  No weak topics flagged yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="topic" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="accuracy" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
