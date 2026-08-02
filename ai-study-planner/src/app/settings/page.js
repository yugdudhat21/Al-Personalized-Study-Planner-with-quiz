'use client';

import { useState, useEffect } from 'react';
import { Settings, Cpu, User, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, profile } = useAuthStore();
  const [ollamaStatus, setOllamaStatus] = useState('checking'); // 'online', 'offline', 'checking'
  const [models, setModels] = useState([]);

  const checkOllamaConnection = async () => {
    setOllamaStatus('checking');
    try {
      const res = await fetch('http://localhost:11434/api/tags', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setModels(data.models || []);
        setOllamaStatus('online');
      } else {
        setOllamaStatus('offline');
      }
    } catch (err) {
      setOllamaStatus('offline');
    }
  };

  useEffect(() => {
    checkOllamaConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-gray-400" /> Account & Engine Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage profile details, inspect Ollama local AI server connection status, and deployment settings.
        </p>
      </div>

      {/* Ollama AI Status Card */}
      <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Ollama Local AI Engine</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Endpoint: <code>http://localhost:11434</code>
              </p>
            </div>
          </div>

          <button
            onClick={checkOllamaConnection}
            className="p-2.5 rounded-xl glass-card text-gray-400 hover:text-white transition"
            title="Recheck Ollama Connection"
          >
            <RefreshCw className={`w-5 h-5 ${ollamaStatus === 'checking' ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-gray-100/50 dark:bg-gray-800/40 border border-gray-200/20 dark:border-gray-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Connection Status</span>

          {ollamaStatus === 'online' ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Online & Ready
            </span>
          ) : ollamaStatus === 'offline' ? (
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-xs flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> Offline (Fallback Planner Active)
            </span>
          ) : (
            <span className="text-xs text-gray-400 animate-pulse">Testing localhost:11434...</span>
          )}
        </div>

        {ollamaStatus === 'online' && models.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">Available Pulled Models:</span>
            <div className="flex flex-wrap gap-2">
              {models.map((m) => (
                <span key={m.name} className="px-3 py-1 rounded-lg glass-card text-xs font-mono font-bold text-purple-400">
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Info Card */}
      <div className="p-6 glass-card rounded-3xl border border-gray-200/20 dark:border-gray-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Profile Details</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your Supabase user information</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Full Name</span>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              {profile?.full_name || 'Student User'}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Email Address</span>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
