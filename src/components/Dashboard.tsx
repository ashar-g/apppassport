/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppRegistry, AuthLog } from '../types';
import { getBgColorFromSeed, generateId } from '../data';
import { Plus, Trash2, Key, Info, HelpCircle, Check, Copy, ExternalLink, Activity, Terminal } from 'lucide-react';

interface DashboardProps {
  apps: AppRegistry[];
  onRegisterApp: (app: Omit<AppRegistry, 'id' | 'clientId' | 'clientSecret' | 'createdAt' | 'iconSeed' | 'activeUsers' | 'dailyAuths'>) => void;
  onDeleteApp: (appId: string) => void;
  authLogs: AuthLog[];
  onTriggerPlaygroundWithApp: (appId: string) => void;
}

export default function Dashboard({ apps, onRegisterApp, onDeleteApp, authLogs, onTriggerPlaygroundWithApp }: DashboardProps) {
  // App Creation Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [appName, setAppName] = useState('');
  const [appRedirect, setAppRedirect] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [appCategory, setAppCategory] = useState<'social' | 'finance' | 'productivity' | 'utility' | 'developer'>('productivity');
  
  // Feedback states
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const triggerCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !appRedirect.trim()) {
      setFormError('App Name and Redirect URI are strictly required.');
      return;
    }
    
    // Quick URI validation
    try {
      new URL(appRedirect);
    } catch (_) {
      setFormError('Please enter a valid absolute Redirect URI (e.g. https://myclient.com/callback)');
      return;
    }

    onRegisterApp({
      name: appName,
      description: appDesc || 'No custom description provided.',
      redirectUri: appRedirect,
      category: appCategory
    });

    // Reset Form
    setAppName('');
    setAppRedirect('');
    setAppDesc('');
    setAppCategory('productivity');
    setFormError('');
    setShowAddForm(false);
  };

  return (
    <div id="dashboard-view" className="bg-zinc-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header summary and trigger button */}
        <div id="dashboard-header" className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-zinc-900">
              Developer Client Console
            </h1>
            <p className="font-sans text-sm text-zinc-500 mt-1">
              Configure OAuth applications, fetch secure client credentials, and analyze activity logs.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} />
            <span>Register New Client</span>
          </button>
        </div>

        {/* Dynamic App registration form */}
        {showAddForm && (
          <form 
            id="register-app-form"
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md transition-all animate-fade-in"
          >
            <h3 className="font-sans text-base font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">
              Add New Credentials Scope
            </h3>

            {formError && (
              <p className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {formError}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase font-mono mb-1">
                  Application Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Awesome Startup App"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-zinc-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase font-mono mb-1">
                  OAuth Redirect Callback URI *
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://myapp.example.com/oauth/callback"
                  value={appRedirect}
                  onChange={(e) => setAppRedirect(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-zinc-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase font-mono mb-1">
                  Service Category
                </label>
                <select
                  value={appCategory}
                  onChange={(e) => setAppCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-zinc-50/50"
                >
                  <option value="productivity">Productivity (Calendars, Notes)</option>
                  <option value="social">Social Media & Communication</option>
                  <option value="finance">Finance / Ledger Portfolio</option>
                  <option value="utility">General System Utility</option>
                  <option value="developer">Developer Infrastructure & API Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase font-mono mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="Provide a prompt-driven description for consent screen context"
                  value={appDesc}
                  onChange={(e) => setAppDesc(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-zinc-50/50"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormError('');
                }}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Assemble Client Registry
              </button>
            </div>
          </form>
        )}

        {/* List of custom apps */}
        <section id="registered-apps-section" className="mt-8">
          <h2 className="font-sans text-lg font-bold text-zinc-900 mb-4 flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Your Registered Applications ({apps.length})</span>
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {apps.map((app) => {
              const gradient = getBgColorFromSeed(app.iconSeed);
              return (
                <div 
                  key={app.id} 
                  id={`app-card-${app.id}`}
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: visual icon banner */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white font-bold text-lg shadow-md`}>
                          {app.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-sans text-base font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                            {app.name}
                          </h3>
                          <span className="font-mono text-[9px] font-semibold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-0.5 rounded border border-zinc-150">
                            {app.category}
                          </span>
                        </div>
                      </div>
                      
                      {/* Delete App option */}
                      <button
                        onClick={() => onDeleteApp(app.id)}
                        className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete client registry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="mt-3.5 text-xs text-zinc-600 line-clamp-2">
                      {app.description}
                    </p>

                    {/* App Credentials section */}
                    <div className="mt-4 rounded-xl border border-zinc-150 bg-zinc-50/70 p-3.5 font-mono text-[11px] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-semibold font-sans">CLIENT_ID</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-zinc-700 font-semibold max-w-[180px] sm:max-w-xs truncate">{app.clientId}</span>
                          <button 
                            type="button"
                            onClick={() => triggerCopy(app.clientId, `${app.id}-cid`)}
                            className="text-zinc-400 hover:text-emerald-600 p-0.5"
                          >
                            {copiedText === `${app.id}-cid` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-semibold font-sans">CLIENT_SECRET</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-zinc-700 font-semibold max-w-[180px] sm:max-w-xs truncate">*********************</span>
                          <button 
                            type="button"
                            onClick={() => triggerCopy(app.clientSecret, `${app.id}-sec`)}
                            className="text-zinc-400 hover:text-emerald-600 p-0.5"
                            title="Copy actual secret key"
                          >
                            {copiedText === `${app.id}-sec` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-zinc-200/50 pt-1.5 mt-1">
                        <span className="text-zinc-400 font-semibold font-sans">REDIRECT_URI_CALLBACK</span>
                        <div className="flex items-center space-x-1 text-zinc-600 font-semibold">
                          <span className="truncate max-w-[180px] sm:max-w-xs text-[10px]">{app.redirectUri}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational indicators & instant test option */}
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3.5 font-sans">
                    <div className="flex space-x-4 text-xs text-zinc-500">
                      <div>
                        <span className="font-mono font-bold text-zinc-800 text-sm block leading-none">{app.activeUsers}</span>
                        <span className="text-[10px] text-zinc-400 uppercase">Active Users</span>
                      </div>
                      <div>
                        <span className="font-mono font-bold text-zinc-800 text-sm block leading-none">{app.dailyAuths}</span>
                        <span className="text-[10px] text-zinc-400 uppercase">Auths today</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onTriggerPlaygroundWithApp(app.id)}
                      className="flex items-center space-x-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      <Terminal size={12} />
                      <span>Simulate Login</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Security / Verification Logs Section */}
        <section id="security-logs-section" className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-lg font-bold text-zinc-900 flex items-center space-x-2">
              <Activity size={18} className="text-zinc-600" />
              <span>Real-time Secure Authentication History</span>
            </h2>
            <span className="font-mono text-[10px] bg-zinc-100 border border-zinc-200 rounded px-2 py-0.5 text-zinc-550">
              Live Monitor
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-zinc-200 font-sans text-left">
              <thead className="bg-zinc-50/50">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold font-mono uppercase text-zinc-400">Application</th>
                  <th className="px-6 py-3.5 text-xs font-bold font-mono uppercase text-zinc-400">Timestamp</th>
                  <th className="px-6 py-3.5 text-xs font-bold font-mono uppercase text-zinc-400">Terminal IP</th>
                  <th className="px-6 py-3.5 text-xs font-bold font-mono uppercase text-zinc-400">Scopes Requested</th>
                  <th className="px-6 py-3.5 text-xs font-bold font-mono uppercase text-zinc-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-xs">
                {authLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/40">
                    <td className="px-6 py-4 font-bold text-zinc-800">{log.appName}</td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-zinc-550">
                      <div>{log.ipAddress}</div>
                      <div className="text-[9px] text-zinc-400 font-sans">{log.browser}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-zinc-650">
                      {log.scope.map((s) => (
                        <span key={s} className="mr-1 inline-block bg-zinc-100 font-semibold rounded border border-zinc-200 px-1.5 py-0.5">
                          {s}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                        log.status === 'Authorized' || log.status === 'Token Refreshed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : log.status === 'Failed Attempt'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-zinc-150 text-zinc-650'
                      }`}>
                        <span>●</span>
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
