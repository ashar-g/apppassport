/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, ArrowRight, Fingerprint, RefreshCcw, Cpu, Globe, KeyRound, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HomeProps {
  setCurrentTab: (tab: string) => void;
  profile: UserProfile;
}

export default function Home({ setCurrentTab, profile }: HomeProps) {
  return (
    <div id="home-view" className="min-h-[calc(100vh-4rem)] bg-zinc-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-50/70 via-transparent to-transparent -z-10" />
        
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center space-x-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-800">
            <Sparkles size={12} className="text-emerald-500 animate-spin" />
            <span>AppPassport Protocol v4.1 is Now Public</span>
          </div>

          {/* Heading */}
          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
            The Decoupled SSO Passport for{' '}
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Infinitely Many Applications
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-600 sm:text-lg">
            Say goodbye to repeating login configurations, managing redundant user schemas, and leaking credentials. AppPassport serves as a cryptographically signed developer pass that users authenticate once and carry everywhere.
          </p>

          {/* Action Callouts */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setCurrentTab('playground')}
              className="group flex items-center justify-center space-x-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-zinc-800 transition-all hover:scale-[1.02]"
            >
              <span>Launch SSO Playground</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center justify-center space-x-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-all hover:border-zinc-300"
            >
              <Cpu size={16} className="text-zinc-500" />
              <span>Register Custom Clients</span>
            </button>
          </div>
        </div>

        {/* Visual Showcase (Simulated SSO flow widget of AppPassport) */}
        <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl">
          <div className="rounded-xl border border-zinc-100 bg-zinc-900 p-6 shadow-inner text-left">
            {/* Window header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 font-mono text-xs text-zinc-500">
              <div className="flex space-x-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span>apppassport-node-sdk_example.ts</span>
              <span className="opacity-0 sm:opacity-100">JWT RS256</span>
            </div>

            {/* Simulated code or stats layout */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token visualization */}
              <div className="rounded-lg bg-zinc-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto border border-zinc-850">
                <p className="text-zinc-600 mb-2">// Authenticated AppPassport ID Token</p>
                <p className="text-amber-500 break-all">eyJhbGciOiJSUzI1NiIsImtpZCI6ImFwcHBhc3Nfa2V5In0.</p>
                <p className="text-teal-400 break-all">eyJpc3MiOiJodHRwczovL3Bhc3Nwb3J0LmRldiIsInN1YiI6InBhc3NfMTIzIiwibmFtZSI6IkFsZXggUml2ZXJhIiwiZW1haWwiOiJhbGV4LnJpdmVyYUBwYXNzcG9ydC5kZXYiLCJ2ZXJpZmllZCI6dHJ1ZX0.</p>
                <p className="text-emerald-600 break-all">signature_sha256_8f0a21daef6693a0bcf57</p>
              </div>

              {/* Step checklist */}
              <div className="flex flex-col justify-between py-2 text-zinc-300">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-3">Enterprise-Grade Architecture Built In</h3>
                  <ul className="space-y-3 font-sans text-xs text-zinc-400">
                    <li className="flex items-start space-x-2">
                      <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>State-of-the-art RS256:</strong> Tokens are verified securely using JSON Web Key Sets (JWKS).</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Fingerprint size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Decentralized Biometrics:</strong> Integrates with secure web auth triggers and identity logs.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <RefreshCcw size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Strict Resource Revoking:</strong> Instantly invalidate developer tokens or update scope access from your dashboard.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-zinc-800 font-mono text-[11px] text-zinc-500 flex justify-between items-center bg-zinc-950/40 p-2 rounded">
                  <span>Authorized Identity:</span>
                  <span className="text-zinc-300 font-semibold">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-sans text-2xl font-bold tracking-tight text-zinc-900 border-l-4 border-emerald-500 pl-3">
          AppPassport Core Features
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1: Identity Card Vault */}
          <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              <Fingerprint size={24} />
            </div>
            <h3 className="font-sans text-base font-bold text-zinc-900">Digital Passport ID</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
              Your absolute profile state resides securely under your control. Manage verification badges, cryptographic keys, and connected emails instantly.
            </p>
            <button 
              onClick={() => setCurrentTab('profile')}
              className="mt-4 font-sans text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>Inspect Identity Pass</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Card 2: Developer Console */}
          <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
              <KeyRound size={24} />
            </div>
            <h3 className="font-sans text-base font-bold text-zinc-900">Developer Client Console</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
              Register apps, construct secure client IDs, configure OAuth Redirect URIs, and copy system secrets. Track active user session ratios across your apps.
            </p>
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="mt-4 font-sans text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
            >
              <span>Visit Console Space</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Card 3: Inter-app SSO Simulator */}
          <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 mb-4 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="font-sans text-base font-bold text-zinc-900">OAuth Playground</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
              Simulate full OAuth 2.0 grant logs! Connect pre-loaded client apps or test login flows for your own registered app to see token structures instantly.
            </p>
            <button 
              onClick={() => setCurrentTab('playground')}
              className="mt-4 font-sans text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
            >
              <span>Open Auth Playground</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-zinc-900 p-8 text-white">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <div>
              <p className="font-mono text-3xl font-extrabold text-emerald-400">99.99%</p>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-mono">Uptime SLA</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-extrabold text-emerald-400">~12ms</p>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-mono">Auth Latency</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-extrabold text-emerald-400">12,400+</p>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-mono">Total Verified Passes</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-extrabold text-emerald-400">1.2M+</p>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-mono">Api Grants/Day</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
