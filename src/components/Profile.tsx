/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { simulateJwtCreation } from '../data';
import { ShieldCheck, User, AtSign, Globe, Sparkles, Database, Check, Fingerprint, Award, ToggleLeft, ToggleRight, Phone, Info } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function Profile({ profile, onUpdateProfile }: ProfileProps) {
  // Editing modes states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || '');
  const [company, setCompany] = useState(profile.company || '');
  const [wallet, setWallet] = useState(profile.walletAddress || '');
  
  // Custom display simulation JWT states
  const [revealJwt, setRevealJwt] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Generate a live preview JWT based on current profile and standard openid scopes
  const currentFauxJwt = simulateJwtCreation(profile, 'client_id_profile_verifier_sso', ['openid', 'profile', 'email']);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      email,
      phone,
      company,
      walletAddress: wallet
    });
    setIsEditing(false);
  };

  const handleVerifyIdentity = () => {
    onUpdateProfile({
      ...profile,
      verified: true
    });
  };

  const toggleDeveloperStatus = () => {
    onUpdateProfile({
      ...profile,
      developerStatus: !profile.developerStatus
    });
  };

  const copyJwtToClipboard = () => {
    navigator.clipboard.writeText(currentFauxJwt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div id="profile-view" className="bg-zinc-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        <div id="profile-heading" className="border-b border-zinc-200 pb-6 mb-8">
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-zinc-900">
            Digital Identity Passport
          </h1>
          <p className="font-sans text-sm text-zinc-500 mt-1">
            Manage your cryptographic claim packets, toggle developer statuses, and verify secure passport keypairs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column A: Interactive Passport Card Representation */}
          <div className="md:col-span-1 space-y-4">
            
            {/* The Physical Card look */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 text-white p-5 shadow-xl transition-transform duration-300 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-zinc-900 to-zinc-850/30 -z-10" />
              
              {/* Card Header styling */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-1">
                  <Fingerprint size={16} className="text-emerald-400" />
                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-zinc-400">
                    ID VERIFIED PROTOCOL
                  </span>
                </div>
                <span className="font-mono text-[8px] border border-emerald-500/30 rounded px-1.5 py-0.5 text-emerald-400 bg-emerald-950/40">
                  {profile.verified ? 'SECURED badge' : 'UNVERIFIED badge'}
                </span>
              </div>

              {/* Photo & Profile Specs block */}
              <div className="mt-4 flex flex-col items-center">
                <img
                  referrerPolicy="no-referrer"
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-20 w-20 rounded-xl object-cover ring-2 ring-zinc-700 shadow-inner"
                />
                
                <h3 className="font-sans text-base font-bold text-zinc-50 mt-3 text-center leading-snug">
                  {profile.name}
                </h3>
                
                <p className="font-mono text-[10px] text-zinc-400 mt-0.5">
                  {profile.email}
                </p>
              </div>

              {/* Holographic detail list */}
              <div className="mt-5 border-t border-zinc-800/80 pt-4 space-y-2.5 font-mono text-[9px] text-zinc-400 uppercase">
                <div className="flex justify-between">
                  <span>UNIX UNIQUE_ID:</span>
                  <span className="text-zinc-100 font-semibold">{profile.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>REG_TIMESTAMP:</span>
                  <span className="text-zinc-100 font-semibold">{new Date(profile.registeredAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>CRYPTO SCOPE:</span>
                  <span className="text-emerald-400 font-bold">
                    {profile.developerStatus ? 'DEVELOPER ACCESS' : 'CLIENT PROFILE'}
                  </span>
                </div>
              </div>

              {/* Subtle watermark overlay */}
              <div className="mt-4 flex justify-between items-center text-[7px] font-mono text-zinc-550 border-t border-zinc-850 pt-2 text-center text-zinc-500 hover:text-zinc-400">
                <span>PASSPORT PUBLIC SECP256K1</span>
                <span>SYSTEM NODE APPROVED</span>
              </div>
            </div>

            {/* Verification Helper Widget if unverified */}
            {!profile.verified && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-4">
                <h4 className="font-sans text-xs font-bold text-yellow-800 flex items-center gap-1">
                  <Info size={14} />
                  <span>Unverified Signature</span>
                </h4>
                <p className="font-sans text-[11px] text-yellow-700 mt-1">
                  Your identity hasn't passed verification. Complete identity pairing checklist to unlock production API limits.
                </p>
                <button
                  type="button"
                  onClick={handleVerifyIdentity}
                  className="mt-3 w-full rounded-lg bg-yellow-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-yellow-700"
                >
                  Verify Now (1-Click Sim)
                </button>
              </div>
            )}

            {/* Developer Toggle Panel */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 font-sans space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 block leading-tight">Developer Status</h4>
                  <span className="text-[10px] text-zinc-400">Unlock custom API playground setup</span>
                </div>
                <button
                  onClick={toggleDeveloperStatus}
                  className="focus:outline-none text-zinc-500 hover:text-emerald-600 transition-colors"
                  title="Toggle status"
                >
                  {profile.developerStatus ? (
                    <ToggleRight size={28} className="text-emerald-600 stroke-[2.3]" />
                  ) : (
                    <ToggleLeft size={28} className="text-zinc-300 stroke-[2.3]" />
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Column B & C: Profiles configuration panel and active claims packet */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Interactive Settings Frame */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                <h3 className="font-sans text-base font-bold text-neutral-900 flex items-center space-x-2">
                  <User size={18} className="text-zinc-500" />
                  <span>Profile Attributes</span>
                </h3>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-neutral-50"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Claims'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4 text-zinc-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase font-mono mb-1">
                        Full Name claimant
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase font-mono mb-1">
                        Identity Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase font-mono mb-1">
                        Telephone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase font-mono mb-1">
                        Employer / Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase font-mono mb-1">
                      Web3 wallet Address claim (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Commit Profile Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans text-xs">
                  <div>
                    <span className="text-zinc-400 uppercase font-mono text-[9px] block">Full Claimant Name</span>
                    <span className="text-zinc-800 font-bold block mt-1 text-sm">{profile.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase font-mono text-[9px] block">Identity Email Address</span>
                    <span className="text-zinc-800 font-semibold block mt-1 text-sm flex items-center gap-1">
                      <span>{profile.email}</span>
                      <span className="text-emerald-600 text-[10px] bg-emerald-50 border border-emerald-100 px-1 rounded">Verified</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase font-mono text-[9px] block">Telephone Number</span>
                    <span className="text-zinc-800 font-medium block mt-1">{profile.phone || 'Not configured'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase font-mono text-[9px] block">Claimed Company</span>
                    <span className="text-zinc-800 font-medium block mt-1">{profile.company || 'Not configured'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-zinc-400 uppercase font-mono text-[9px] block">Credential Wallet Connection</span>
                    <span className="text-zinc-700 font-mono block mt-1 break-all bg-zinc-50 p-2 rounded-lg border border-zinc-250">
                      {profile.walletAddress || 'No linked Web3 identity wallet linked to AppPassport.'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Cryptologic JWT packet demonstration box */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
                <h3 className="font-sans text-base font-bold text-neutral-900 flex items-center space-x-2">
                  <Database size={18} className="text-zinc-500" />
                  <span>Signed JWT Claims Packet</span>
                </h3>
                
                <button
                  onClick={() => setRevealJwt(!revealJwt)}
                  className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  {revealJwt ? 'Hide Token' : 'Reveal Live JWT'}
                </button>
              </div>

              <p className="font-sans text-xs text-zinc-500 leading-relaxed mb-4">
                This is a mock representation of the secure OpenID Connect (OIDC) JSON Web Token signed dynamically by AppPassport whenever you login to partner applications.
              </p>

              {revealJwt && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-400 space-y-3">
                  <div className="flex justify-between items-center text-zinc-500 border-b border-zinc-800 pb-2">
                    <span>RS256 Private-Key Signed Token</span>
                    <button
                      type="button"
                      onClick={copyJwtToClipboard}
                      className="flex items-center space-x-1 text-emerald-500 hover:text-emerald-400 text-[10px] font-sans"
                    >
                      {isCopied ? <Check size={11} /> : <Award size={11} />}
                      <span>{isCopied ? 'Copied' : 'Copy JWT'}</span>
                    </button>
                  </div>

                  <p className="text-amber-500 break-all leading-relaxed">
                    eyJhbGciOiJSUzI1NiIsImtpZCI6ImFwcHBhc3Nfa2V5X3Byb2RfdjEifQ.
                  </p>
                  
                  {/* Decoded content block */}
                  <div className="bg-zinc-900 rounded-lg p-3 hover:bg-zinc-850 transition-colors border border-zinc-800">
                    <p className="text-zinc-500 mb-1 font-sans text-[10px] uppercase">// JSON claims decrypted payload:</p>
                    <pre className="text-left text-neutral-300 font-semibold font-mono text-[10px] overflow-x-auto">
{`{
  "iss": "https://passport.dev",
  "sub": "${profile.id}",
  "aud": "client_id_profile_verifier_sso",
  "name": "${profile.name}",
  "email": "${profile.email}",
  "picture": "${profile.avatar.substring(0, 32)}...",
  "developer": ${profile.developerStatus},
  "verified_identity": ${profile.verified},
  "iat": ${Math.floor(Date.now() / 1000)}
}`}
                    </pre>
                  </div>

                  <p className="text-emerald-500 break-all leading-none mt-2">
                    signature_sha256_mock_d3b0ea9278a9c80f6820c78a1bc40d6c70283bd7832ba06cbef7
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
