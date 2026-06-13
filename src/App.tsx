/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserProfile, AppRegistry, AuthLog } from './types';
import { INITIAL_PROFILE, INITIAL_APPS, INITIAL_LOGS, generateId } from './data';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import OAuthPlayground from './components/OAuthPlayground';
import { ShieldCheck, HeartPulse, RefreshCw, X, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation Routing States
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedAppId, setSelectedAppId] = useState<string>('');

  // Primary Platform state variables
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [apps, setApps] = useState<AppRegistry[]>(INITIAL_APPS);
  const [authLogs, setAuthLogs] = useState<AuthLog[]>(INITIAL_LOGS);

  // Success Notification banner overlay triggers
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  // 1. Initial State Hydration via persistent localStorage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('apppass_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      const storedApps = localStorage.getItem('apppass_apps');
      if (storedApps) {
        setApps(JSON.parse(storedApps));
      } else {
        localStorage.setItem('apppass_apps', JSON.stringify(INITIAL_APPS));
      }

      const storedLogs = localStorage.getItem('apppass_logs');
      if (storedLogs) {
        setAuthLogs(JSON.parse(storedLogs));
      } else {
        localStorage.setItem('apppass_logs', JSON.stringify(INITIAL_LOGS));
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // Sync state helpers
  const triggerPushBanner = (message: string) => {
    setBannerMsg(message);
    setTimeout(() => {
      setBannerMsg(null);
    }, 4000);
  };

  // 2. Action Handlers: Profile updating
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('apppass_profile', JSON.stringify(updatedProfile));
    triggerPushBanner('Identity claim profile updated securely!');
  };

  // 3. Action Handlers: App Registries management
  const handleRegisterApp = (newAppDetails: Omit<AppRegistry, 'id' | 'clientId' | 'clientSecret' | 'createdAt' | 'iconSeed' | 'activeUsers' | 'dailyAuths'>) => {
    const generatedIdVal = 'app_' + generateId(6);
    const generatedClientId = 'client_id_' + newAppDetails.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + generateId(8);
    const generatedClientSec = 'secret_sec_' + generateId(20);

    const fullAppRecord: AppRegistry = {
      id: generatedIdVal,
      name: newAppDetails.name,
      description: newAppDetails.description,
      redirectUri: newAppDetails.redirectUri,
      clientId: generatedClientId,
      clientSecret: generatedClientSec,
      createdAt: new Date().toISOString(),
      iconSeed: newAppDetails.name.trim().toLowerCase(),
      category: newAppDetails.category,
      activeUsers: 0,
      dailyAuths: 0
    };

    const nextApps = [fullAppRecord, ...apps];
    setApps(nextApps);
    localStorage.setItem('apppass_apps', JSON.stringify(nextApps));
    triggerPushBanner(`Successfully registered credentials for ${newAppDetails.name}!`);
  };

  const handleDeleteApp = (appId: string) => {
    const appToDelete = apps.find(a => a.id === appId);
    const nextApps = apps.filter(a => a.id !== appId);
    setApps(nextApps);
    localStorage.setItem('apppass_apps', JSON.stringify(nextApps));
    triggerPushBanner(`Deleted client registry: ${appToDelete?.name || 'Application'}`);
  };

  // 4. Action Handlers: Append log trigger events
  const handleAddLogItem = (newLog: AuthLog) => {
    const nextLogs = [newLog, ...authLogs];
    setAuthLogs(nextLogs);
    localStorage.setItem('apppass_logs', JSON.stringify(nextLogs));
  };

  // 5. Inter-app transition hook
  const handleTriggerPlaygroundWithApp = (appId: string) => {
    setSelectedAppId(appId);
    setCurrentTab('playground');
    triggerPushBanner('Switched to OAuth Playground sandbox window!');
  };

  // 6. Hard reset option for demonstration purposes
  const handleResetToFactoryDefault = () => {
    if (confirm('Are you sure you want to restore AppPassport defaults? All custom registrations will be reset.')) {
      localStorage.removeItem('apppass_profile');
      localStorage.removeItem('apppass_apps');
      localStorage.removeItem('apppass_logs');
      setProfile(INITIAL_PROFILE);
      setApps(INITIAL_APPS);
      setAuthLogs(INITIAL_LOGS);
      setCurrentTab('home');
      triggerPushBanner('AppPassport initialized back to default simulation state.');
    }
  };

  // Helper mapping views
  const renderCurrentView = () => {
    switch (currentTab) {
      case 'home':
        return <Home setCurrentTab={setCurrentTab} profile={profile} />;
      case 'dashboard':
        return (
          <Dashboard
            apps={apps}
            onRegisterApp={handleRegisterApp}
            onDeleteApp={handleDeleteApp}
            authLogs={authLogs}
            onTriggerPlaygroundWithApp={handleTriggerPlaygroundWithApp}
          />
        );
      case 'profile':
        return <Profile profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case 'playground':
        return (
          <OAuthPlayground
            apps={apps}
            selectedAppId={selectedAppId || (apps[0] ? apps[0].id : '')}
            setSelectedAppId={setSelectedAppId}
            profile={profile}
            onAddLog={handleAddLogItem}
          />
        );
      default:
        return <Home setCurrentTab={setCurrentTab} profile={profile} />;
    }
  };

  return (
    <div id="apppassport-root" className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-emerald-150 selection:text-emerald-900">
      
      {/* Banner Notifications overlay */}
      {bannerMsg && (
        <div id="notification-toast" className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-2xl animate-fade-in-up max-w-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div className="text-xs">
            <h5 className="font-bold text-zinc-900 font-sans leading-none">Security Status Verified</h5>
            <p className="text-zinc-500 font-sans mt-1">{bannerMsg}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setBannerMsg(null)}
            className="text-zinc-300 hover:text-zinc-500 p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Grid pattern background wrapper */}
      <div className="flex-grow flex flex-col">
        {/* Navigation Head */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          profile={profile}
          onLogout={() => {
            triggerPushBanner('Successfully logged index session out. Simulating authentication refresh.');
            setCurrentTab('home');
          }}
        />

        {/* Dynamic View Panel Stage */}
        <main className="flex-grow">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Footer component */}
      <footer className="border-t border-zinc-200 bg-zinc-100 py-6 px-4 text-center text-zinc-500 font-sans text-xs">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-zinc-700">AppPassport Protocol</span>
            <span className="text-zinc-400">|</span>
            <span>Cryptographic OAuth SSO Service Provider</span>
          </div>
          
          {/* Debug restore defaults trigger */}
          <div className="flex items-center space-x-4 text-zinc-400">
            <button
              onClick={handleResetToFactoryDefault}
              className="hover:text-amber-600 font-sans font-semibold underline underline-offset-4 cursor-pointer"
            >
              Restore Initial Seeds
            </button>
            <span>•</span>
            <span className="font-mono text-[10px]">Active Node: WA_DC_IAD1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
