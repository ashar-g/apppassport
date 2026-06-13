/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppWindow, User, ShieldAlert, LogOut, Terminal, Activity, FileKey } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: UserProfile;
  onLogout: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, profile, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/85 backdrop-blur-md">
      <div id="navbar-container" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          id="navbar-brand"
          className="flex cursor-pointer items-center space-x-2" 
          onClick={() => setCurrentTab('home')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
            <ShieldAlert size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-sans text-lg font-bold tracking-tight text-zinc-900">
              App<span className="text-emerald-600">Passport</span>
            </h1>
            <p className="font-mono text-[9px] font-medium tracking-widest text-zinc-400 uppercase">
              Identity Protocol
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav id="navbar-navigation" className="hidden md:flex items-center space-x-1">
          <button
            id="nav-btn-home"
            onClick={() => setCurrentTab('home')}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === 'home'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <Activity size={16} />
            <span>Overview</span>
          </button>
          
          <button
            id="nav-btn-dashboard"
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === 'dashboard'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <AppWindow size={16} />
            <span>Developer Space</span>
          </button>

          <button
            id="nav-btn-playground"
            onClick={() => setCurrentTab('playground')}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === 'playground'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <Terminal size={16} />
            <span>OAuth Playground</span>
          </button>

          <button
            id="nav-btn-profile"
            onClick={() => setCurrentTab('profile')}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              currentTab === 'profile'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <User size={16} />
            <span>Digital Identity</span>
          </button>
        </nav>

        {/* User Identity and Session Actions */}
        <div id="navbar-actions" className="flex items-center space-x-4">
          {/* Quick connection state indicators */}
          <div className="hidden lg:flex items-center space-x-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-3 py-1 font-mono text-[10px] text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Pass_ID Connected</span>
          </div>

          {/* Profile Quick-view */}
          <div 
            id="navbar-profile-trigger"
            onClick={() => setCurrentTab('profile')}
            className="flex cursor-pointer items-center space-x-2 rounded-xl border border-zinc-150 p-1.5 pr-3 transition-all hover:bg-zinc-50"
          >
            <img
              referrerPolicy="no-referrer"
              src={profile.avatar}
              alt={profile.name}
              className="h-7 w-7 rounded-lg object-cover ring-2 ring-emerald-50"
            />
            <div className="hidden sm:block text-left">
              <p className="line-clamp-1 font-sans text-xs font-semibold text-zinc-800 leading-none">
                {profile.name}
              </p>
              <span className="font-mono text-[8px] font-semibold text-zinc-400 leading-none uppercase">
                {profile.developerStatus ? 'Developer' : 'User'}
              </span>
            </div>
          </div>

          {/* Logout Trigger */}
          <button
            id="nav-logout-btn"
            onClick={onLogout}
            title="Sign out of AppPassport session"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-100"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Rail (Horizontal scrollable at bottom for tight screens) */}
      <div id="mobile-navigation-bar" className="flex md:hidden items-center justify-around border-t border-zinc-100 bg-zinc-50/95 py-2 px-2">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-semibold ${
            currentTab === 'home' ? 'text-emerald-600' : 'text-zinc-500'
          }`}
        >
          <Activity size={18} />
          <span>Home</span>
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-semibold ${
            currentTab === 'dashboard' ? 'text-emerald-600' : 'text-zinc-500'
          }`}
        >
          <AppWindow size={18} />
          <span>Console</span>
        </button>
        <button
          onClick={() => setCurrentTab('playground')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-semibold ${
            currentTab === 'playground' ? 'text-emerald-600' : 'text-zinc-500'
          }`}
        >
          <Terminal size={18} />
          <span>SSO Demo</span>
        </button>
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-semibold ${
            currentTab === 'profile' ? 'text-emerald-600' : 'text-zinc-500'
          }`}
        >
          <User size={18} />
          <span>Passport</span>
        </button>
      </div>
    </header>
  );
}
