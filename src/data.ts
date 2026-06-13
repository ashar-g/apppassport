/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, AppRegistry, AuthLog } from './types';

// Helper to generate IDs
export const generateId = (length: number = 10): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};

// Default profile loaded from localStorage if exists, or initial state
export const INITIAL_PROFILE: UserProfile = {
  id: 'pass_usr_8f0a21d',
  name: 'Alex Rivera',
  email: 'alex.rivera@passport.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  developerStatus: true,
  verified: true,
  registeredAt: '2026-01-15T08:30:00Z',
  phone: '+1 (555) 382-9401',
  company: 'Rivera Labs Inc.',
  walletAddress: '0x71C...390a'
};

// Default registered apps
export const INITIAL_APPS: AppRegistry[] = [
  {
    id: 'app_prod_f3m8a',
    name: 'FocusFlow Planner',
    description: 'Mindfulness scheduling and productivity app for modern developers.',
    redirectUri: 'https://focusflow.dev/auth/callback',
    clientId: 'client_id_ff_8x28a9b1c7',
    clientSecret: 'secret_ff_sec_99a8b8c8d8e8f8g8',
    createdAt: '2026-02-10T12:00:00Z',
    iconSeed: 'focusflow',
    category: 'productivity',
    activeUsers: 1420,
    dailyAuths: 382
  },
  {
    id: 'app_fin_29p7y',
    name: 'Apex Crypto Ledger',
    description: 'Secure, real-time decentralized ledger for tracking multi-chain wallet portfolios.',
    redirectUri: 'https://apexledger.io/login/callback',
    clientId: 'client_id_apex_4ff99e2f',
    clientSecret: 'secret_apex_sec_aa11bb22cc33dd44',
    createdAt: '2026-03-22T09:15:00Z',
    iconSeed: 'apex',
    category: 'finance',
    activeUsers: 840,
    dailyAuths: 195
  },
  {
    id: 'app_soc_77z1u',
    name: 'DevSync Communities',
    description: 'Micro-chat and forum integrations mirroring professional developer communities.',
    redirectUri: 'https://devsync.com/oauth/apppassport',
    clientId: 'client_id_ds_bb77dd24',
    clientSecret: 'secret_ds_sec_ee55ff66gg77hh88',
    createdAt: '2026-05-01T15:45:00Z',
    iconSeed: 'devsync',
    category: 'social',
    activeUsers: 3120,
    dailyAuths: 940
  }
];

// Initial audit logs represent past authentications
export const INITIAL_LOGS: AuthLog[] = [
  {
    id: 'log_01',
    appName: 'FocusFlow Planner',
    timestamp: '2026-06-12T19:42:15Z',
    status: 'Authorized',
    ipAddress: '192.168.1.45',
    browser: 'Chrome / macOS',
    scope: ['openid', 'profile', 'email']
  },
  {
    id: 'log_02',
    appName: 'DevSync Communities',
    timestamp: '2026-06-11T14:15:32Z',
    status: 'Token Refreshed',
    ipAddress: '192.168.1.45',
    browser: 'Safari / iPhone',
    scope: ['openid', 'profile']
  },
  {
    id: 'log_03',
    appName: 'Apex Crypto Ledger',
    timestamp: '2026-06-10T09:12:05Z',
    status: 'Authorized',
    ipAddress: '172.56.21.104',
    browser: 'Firefox / Linux',
    scope: ['openid', 'profile', 'email', 'offline_access']
  },
  {
    id: 'log_04',
    appName: 'Unknown Client',
    timestamp: '2026-06-09T22:05:12Z',
    status: 'Failed Attempt',
    ipAddress: '203.0.113.88',
    browser: 'Python-requests / Ubuntu',
    scope: ['openid']
  }
];

// Seed to determine unique pastel icons
export const getBgColorFromSeed = (seed: string): string => {
  const hash = seed.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const colors = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-rose-500 to-orange-500',
    'from-amber-400 to-orange-600',
    'from-cyan-400 to-blue-600',
    'from-violet-500 to-fuchsia-600'
  ];
  return colors[hash % colors.length];
};

// Simulate creating a JWT ID Token
export const simulateJwtCreation = (profile: UserProfile, clientId: string, scope: string[]): string => {
  const header = {
    alg: 'RS256',
    kid: 'apppass_key_prod_v1',
    typ: 'JWT'
  };
  
  const payload = {
    iss: 'https://passport.dev',
    sub: profile.id,
    aud: clientId,
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    auth_time: Math.floor(Date.now() / 1000),
    name: profile.name,
    email: scope.includes('email') ? profile.email : undefined,
    picture: scope.includes('profile') ? profile.avatar : undefined,
    developer: scope.includes('profile') ? profile.developerStatus : undefined,
    verified_identity: profile.verified
  };

  // Convert to simplified faux JWT format
  const b64Header = btoa(JSON.stringify(header)).replace(/=/g, '');
  const b64Payload = btoa(JSON.stringify(payload)).replace(/=/g, '');
  const mockSignature = 'signature_sha256_' + generateId(16);
  
  return `${b64Header}.${b64Payload}.${mockSignature}`;
};
