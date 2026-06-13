/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  developerStatus: boolean;
  verified: boolean;
  registeredAt: string;
  phone?: string;
  company?: string;
  walletAddress?: string;
}

export interface AppRegistry {
  id: string;
  name: string;
  description: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
  createdAt: string;
  iconSeed: string; // Used to generate distinct visual colors/icons
  category: 'social' | 'finance' | 'productivity' | 'utility' | 'developer';
  activeUsers: number;
  dailyAuths: number;
}

export interface AuthLog {
  id: string;
  appName: string;
  timestamp: string;
  status: 'Authorized' | 'Revoked' | 'Token Refreshed' | 'Failed Attempt';
  ipAddress: string;
  browser: string;
  scope: string[];
}

export interface SimulationState {
  step: 'none' | 'auth_request' | 'consent' | 'authorized';
  targetAppId: string;
  requestedScopes: string[];
  callbackCode: string | null;
  idToken: string | null;
}
