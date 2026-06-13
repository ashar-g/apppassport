/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppRegistry, UserProfile, SimulationState, AuthLog } from '../types';
import { simulateJwtCreation, generateId, getBgColorFromSeed } from '../data';
import { ShieldCheck, Fingerprint, LogIn, ArrowRight, RefreshCw, Terminal, Check, Info, Server, HelpCircle, ArrowLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { useCustomAuth0 } from './Auth0Wrapper';

interface OAuthPlaygroundProps {
  apps: AppRegistry[];
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
  profile: UserProfile;
  onAddLog: (newLog: AuthLog) => void;
}

export default function OAuthPlayground({ apps, selectedAppId, setSelectedAppId, profile, onAddLog }: OAuthPlaygroundProps) {
  const selectedApp = apps.find(a => a.id === selectedAppId) || apps[0];
  const { isConfigured, isAuthenticated } = useCustomAuth0();
  
  // Local flow states
  const [step, setStep] = useState<'app_initial' | 'consent_check' | 'redirecting' | 'authenticated'>('app_initial');
  
  // Scope toggles
  const [scopeOpenId, setScopeOpenId] = useState(true);
  const [scopeProfile, setScopeProfile] = useState(true);
  const [scopeEmail, setScopeEmail] = useState(true);
  
  // Generated credentials
  const [authCode, setAuthCode] = useState('');
  const [signedToken, setSignedToken] = useState('');
  const [verifiedPayload, setVerifiedPayload] = useState<any>(null);

  // Quick select updates
  useEffect(() => {
    if (selectedApp) {
      handleReset();
    }
  }, [selectedAppId]);

  const handleReset = () => {
    setStep('app_initial');
    setAuthCode('');
    setSignedToken('');
    setVerifiedPayload(null);
  };

  const startOAuthFlow = () => {
    setStep('consent_check');
  };

  const handleAuthorize = () => {
    setStep('redirecting');
    
    // Simulate callback redirect timing
    setTimeout(() => {
      const generatedCode = 'code_auth_' + generateId(12);
      const scopes = ['openid'];
      if (scopeProfile) scopes.push('profile');
      if (scopeEmail) scopes.push('email');

      const token = simulateJwtCreation(profile, selectedApp.clientId, scopes);
      
      // Decoded token payload mock
      const decodedPayload = {
        iss: 'https://passport.dev',
        sub: profile.id,
        aud: selectedApp.clientId,
        name: profile.name,
        email: scopeEmail ? profile.email : undefined,
        picture: scopeProfile ? profile.avatar : undefined,
        verified_identity: profile.verified
      };

      setAuthCode(generatedCode);
      setSignedToken(token);
      setVerifiedPayload(decodedPayload);
      setStep('authenticated');

      // Add record to the central security audit log of AppPassport
      onAddLog({
        id: 'log_' + generateId(6),
        appName: selectedApp.name,
        timestamp: new Date().toISOString(),
        status: 'Authorized',
        ipAddress: '192.168.1.100',
        browser: 'Playground Simulator Client',
        scope: scopes
      });
    }, 1800);
  };

  const handleCancel = () => {
    handleReset();
  };

  return (
    <div id="playground-view" className="bg-zinc-50/20 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-5xl">

        {/* Header Title */}
        <div id="playground-header" className="border-b border-zinc-200 pb-6 mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
              OIDC & OAuth 2.0 Identity Playground
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Visualize complete Single Sign-On operations, exchange authorization codes, and decode verified JWT packets.
            </p>
          </div>
          
          {/* Quick Select Client Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold font-mono text-zinc-400 uppercase">Target Client App:</span>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-700"
            >
              {apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Pane: Interactive Live Sandbox Window (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Simulation Interface Header */}
            <div className="rounded-2xl border border-zinc-250 bg-white shadow-md overflow-hidden">
              <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                </div>
                <span className="font-sans font-bold flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-zinc-200">Sandbox: {selectedApp.name}</span>
                </span>
                <span className="text-zinc-650 opacity-0 sm:opacity-100 uppercase tracking-wider text-[8px] font-bold">Secure Frame</span>
              </div>

              {/* STAGE A: Pre-Auth Partner Interface */}
              {step === 'app_initial' && (
                <div className="p-8 text-center bg-zinc-50/50">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg">
                    <LogIn size={26} />
                  </div>
                  
                  <h3 className="text-base font-bold text-zinc-800">
                    Welcome to <span className="text-emerald-700">{selectedApp.name}</span>
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs text-zinc-500 leading-normal">
                    This mock application represents an external partner client site configured to integrate secure identity packages with AppPassport.
                  </p>

                  <div className="mt-6 flex flex-col items-center justify-center">
                    <button
                      onClick={startOAuthFlow}
                      className="group flex items-center space-x-2 rounded-xl bg-zinc-900 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-800 transition-all shadow-md"
                    >
                      <Fingerprint size={16} className="text-emerald-400" />
                      <span>Single Sign-On with AppPassport</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                    
                    <span className="mt-4 font-mono text-[9px] text-zinc-400">
                      Target URI: https://passport.dev/oauth/authorize?client_id={selectedApp.clientId}...
                    </span>
                  </div>
                </div>
              )}

              {/* STAGE B: AppPassport Consent Frame Modal */}
              {step === 'consent_check' && (
                <div className="p-6 bg-white border-t border-zinc-105">
                  
                  {/* Passport Identity Provider Branding bar */}
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                        🛡️
                      </div>
                      <div>
                        <h4 className="font-sans text-xs font-bold text-zinc-900 leading-none">AppPassport Identity Provider</h4>
                        <p className="font-mono text-[8px] tracking-widest text-zinc-400 uppercase leading-none mt-1">Authorization Server</p>
                      </div>
                    </div>
                    {isConfigured && isAuthenticated && (
                      <span className="font-mono text-[9px] bg-blue-50 text-blue-700 border border-blue-105 px-2 py-0.5 rounded uppercase font-bold shrink-0">
                        Auth0 Federated Mode
                      </span>
                    )}
                  </div>

                  {/* Informant block */}
                  <div className="mb-5 p-3 rounded-xl border border-zinc-150 bg-zinc-50 flex items-start space-x-2.5">
                    <Info size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-600 leading-normal">
                      <strong>{selectedApp.name}</strong> is requesting authorizations to verify your credentials. If approved, identity values will be securely delivered to the callback handler.
                    </p>
                  </div>

                  {/* Scopes Selection Checkboxes */}
                  <div className="space-y-3 mb-6">
                    <h5 className="font-sans text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Select Access Scopes to Grant</h5>
                    
                    <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 px-4 bg-white">
                      
                      {/* Scope OpenID */}
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-start space-x-2.5">
                          <input
                            type="checkbox"
                            disabled
                            checked={scopeOpenId}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-zinc-800 block leading-tight">openid (Required)</span>
                            <span className="text-[10px] text-zinc-400">Unique user identifier for subject claim validation.</span>
                          </div>
                        </div>
                      </div>

                      {/* Scope Profile */}
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-start space-x-2.5">
                          <input
                            type="checkbox"
                            checked={scopeProfile}
                            onChange={(e) => setScopeProfile(e.target.checked)}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-zinc-800 block leading-tight">profile</span>
                            <span className="text-[10px] text-zinc-400">Read access to your name, avatar image, and developer credentials.</span>
                          </div>
                        </div>
                        <span className="font-mono text-[9px] text-zinc-400 bg-zinc-50 border px-1.5 py-0.5 rounded">
                          {profile.name}
                        </span>
                      </div>

                      {/* Scope Email */}
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-start space-x-2.5">
                          <input
                            type="checkbox"
                            checked={scopeEmail}
                            onChange={(e) => setScopeEmail(e.target.checked)}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-zinc-800 block leading-tight">email</span>
                            <span className="text-[10px] text-zinc-400">Read access to your verified primary email address.</span>
                          </div>
                        </div>
                        <span className="font-mono text-[9px] text-zinc-400 bg-zinc-50 border px-1.5 py-0.5 rounded">
                          {profile.email}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Accept / Refuse controls */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-650 hover:bg-zinc-50"
                    >
                      Refuse Access
                    </button>
                    <button
                      type="button"
                      onClick={handleAuthorize}
                      className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 flex items-center space-x-1.5"
                    >
                      <Fingerprint size={14} />
                      <span>Approve Identity Sharing</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE C: Redirection Transition */}
              {step === 'redirecting' && (
                <div className="p-12 text-center bg-zinc-50/20">
                  <div className="mx-auto mb-4 flex h-12 w-12 animate-spin items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-dashed border-emerald-500" />
                  
                  <h4 className="text-base font-bold text-zinc-800 animate-pulse">
                    Completing Key Exchange Handshake...
                  </h4>
                  <p className="mx-auto mt-2 max-w-sm text-xs text-zinc-500">
                    Signing token payloads, generating callbacks protocols, and redirecting safely to: <span className="font-mono bg-zinc-100 p-0.5 text-zinc-600 text-[10px]">{selectedApp.redirectUri}</span>
                  </p>
                </div>
              )}

              {/* STAGE D: Successfully Logged in client frame */}
              {step === 'authenticated' && (
                <div className="p-8 text-center bg-emerald-50/5">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                    <ShieldCheck size={28} />
                  </div>

                  <h3 className="text-lg font-extrabold text-zinc-900 leading-none">
                    OAuth Authorization Successful!
                  </h3>
                  <p className="mt-2 text-xs text-zinc-500 max-w-sm mx-auto">
                    You are signed into <span className="font-bold text-zinc-800">{selectedApp.name}</span> using your AppPassport wallet.
                  </p>

                  {/* Mock profile retrieved inside the partner app */}
                  <div className="mt-6 max-w-md mx-auto rounded-xl border border-emerald-100 bg-white p-4 shadow-sm text-left flex items-center space-x-3">
                    <img
                      referrerPolicy="no-referrer"
                      src={scopeProfile ? profile.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256'}
                      alt="avatar"
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-xs text-zinc-800 leading-none">
                        {scopeProfile ? profile.name : 'Anonymous Client'}
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono block mt-1">
                        {scopeEmail ? profile.email : 'Email access refused'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={handleReset}
                      className="rounded-xl border border-zinc-250 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 flex items-center space-x-1 mx-auto"
                    >
                      <RefreshCw size={12} />
                      <span>Simulate Next Login Session</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Pane: Technical Trace Monitor & Specs (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* OIDC Console Monitor box */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 shadow text-zinc-400 font-mono text-[11px] leading-relaxed">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5 mb-3 text-zinc-500 font-sans font-bold">
                <span className="flex items-center space-x-1">
                  <Terminal size={14} className="text-amber-500" />
                  <span>OIDC KeyExchange Logs</span>
                </span>
                
                <span className="text-[9px] uppercase tracking-wider text-amber-500 font-mono">DEBUG_SHELL</span>
              </div>

              {step === 'app_initial' ? (
                <div className="py-8 text-center text-zinc-650">
                  <p>// Waiting to capture OAuth auth code requests...</p>
                  <p className="mt-1 text-[10px]">Click "Single Sign-On" in sandbox to capture telemetry.</p>
                </div>
              ) : step === 'consent_check' ? (
                <div className="space-y-2 text-zinc-400">
                  <p className="text-zinc-500">// Intercepting authorization transaction:</p>
                  <p className="text-amber-500">GET https://passport.dev/oauth/authorize</p>
                  <div className="pl-3 space-y-1 text-zinc-500">
                    <p>response_type: <span className="text-neutral-300">"code"</span></p>
                    <p>client_id_claim: <span className="text-neutral-300">"{selectedApp.clientId}"</span></p>
                    <p>scope_array: <span className="text-neutral-300">"[openid, profile, email]"</span></p>
                    <p>redirect_uri: <span className="text-neutral-300">"{selectedApp.redirectUri}"</span></p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Generated auth authorization logs */}
                  <div className="space-y-1 border-b border-zinc-900 pb-2">
                    <p className="text-zinc-500">// Code Grant Handshake Completed:</p>
                    <p className="text-indigo-400">AuthCode Delivered → Redirect URI Callback</p>
                    <p className="text-[10px] text-zinc-500">URI: {selectedApp.redirectUri}?code={authCode || '...'}</p>
                  </div>

                  {/* Token Post endpoint swap */}
                  <div className="space-y-1 border-b border-zinc-900 pb-2">
                    <p className="text-zinc-500">// Token Exchange Request:</p>
                    <p className="text-amber-500">POST /api/oauth/token HTTP/1.1</p>
                    <div className="pl-3 space-y-0.5 text-[10px] text-zinc-500">
                      <p>grant_type: "authorization_code"</p>
                      <p>client_id_hash: "{selectedApp.clientId}"</p>
                      <p>client_secret: "*****************"</p>
                    </div>
                  </div>

                  {/* Token decrypted payload */}
                  <div>
                    <p className="text-zinc-500">// Token Exchange Response Payload:</p>
                    <pre className="text-[10px] text-neutral-300 bg-zinc-900 p-2.5 rounded-lg overflow-x-auto mt-1 border border-zinc-850">
{`{
  "access_token": "at_${generateId(12)}",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "${signedToken.substring(0, 22)}...${signedToken.substring(signedToken.length - 15)}",
  "scope": "openid profile email"
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Educational Help Widget */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm font-sans space-y-2.5 text-xs text-zinc-600">
              <h4 className="font-bold text-zinc-800 flex items-center gap-1">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>OIDC Spec Guidelines</span>
              </h4>
              <p className="leading-normal">
                AppPassport implements the standard <strong>Authorization Code Grant with PKCE</strong>. This ensures client secrets are not leaked, and mobile/single-page web apps are authenticated strictly.
              </p>
              <div className="pt-2 border-t border-zinc-100 text-[11px] text-emerald-700 font-semibold">
                You can try registering custom callback apps on the Developer Console to verify how they're mapped in this dropdown list.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
