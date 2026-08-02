'use client';

import { useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity, Flame } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useSubjectStore } from '@/store/subjectStore';
import { usePlannerStore } from '@/store/plannerStore';
import { useAnalyticsStore } from '@/store/analyticsStore';

export default function AnalyticsPage() {
  const { subjects, testScores } = useSubjectStore();
  const { sessions } = usePlannerStore();
  const {
    dailyStudyData,
    weeklyCompletionData,
    subjectDistributionData,
    scoreTrendData,
    productivityHeatmapData,
    computeAnalytics,
  } = useAnalyticsStore();

  useEffect(() => {
    computeAnalytics(sessions, subjects, testScores);
  }, [sessions, subjects, testScores, computeAnalytics]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-emerald-500" /> Performance & Study Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Deep data visualizations on study hours, weekly completion rates, test scores, and consistency heatmaps.
        </p>
      </div>

      {/* Grid of Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Daily Study Hours */}
        <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" /> Daily Study Hours (Last 7 Days)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStudyData}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                />
                <Bar dataKey="hours" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Completion Rate */}
        <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Weekly Session Completion Rate
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyCompletionData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#6366F1" fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="planned" stroke="#94a3b8" fillOpacity={0} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Subject Time Distribution */}
        <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-500" /> Subject Time Distribution
            </h3>
          </div>
          <div className="h-64 w-full">
            {subjectDistributionData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                Log study sessions to see subject distribution.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Test Score Trend */}
        <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" /> Test & Assessment Score Trend (%)
            </h3>
          </div>
          <div className="h-64 w-full">
            {scoreTrendData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                Log test scores in Subjects tab to track score progression over time.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Section 5: Productivity Heatmap */}
      <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4">
        <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" /> Productivity Heatmap (Last 30 Days)
        </h3>
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
          {productivityHeatmapData.map((item) => (
            <div
              key={item.date}
              title={`${item.date}: ${item.minutes} study minutes`}
              className={`h-8 rounded-lg transition transform hover:scale-110 flex items-center justify-center text-[10px] font-bold ${
                item.level === 4
                  ? 'bg-emerald-500 text-white shadow-md'
                  : item.level === 3
                  ? 'bg-emerald-600/80 text-white'
                  : item.level === 2
                  ? 'bg-emerald-700/60 text-white'
                  : item.level === 1
                  ? 'bg-emerald-800/40 text-emerald-300'
                  : 'bg-gray-200/50 dark:bg-gray-800/40 text-gray-400'
              }`}
            >
              {item.minutes > 0 ? `${item.minutes}m` : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
