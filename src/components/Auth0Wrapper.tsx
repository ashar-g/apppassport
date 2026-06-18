/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

interface Auth0Config {
  domain: string;
  clientId: string;
}

interface Auth0ContextType {
  domain: string;
  clientId: string;
  isConfigured: boolean;
  saveConfig: (domain: string, clientId: string) => void;
  clearConfig: () => void;
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const Auth0ConfigContext = createContext<Auth0ContextType | null>(null);

export function useCustomAuth0() {
  const context = useContext(Auth0ConfigContext);
  if (!context) {
    throw new Error('useCustomAuth0 must be used within an Auth0WrapperProvider');
  }
  return context;
}

// Inner component that actually runs inside the Auth0Provider if it's rendered
function Auth0StateBridge({ 
  children, 
  config, 
  saveConfig, 
  clearConfig 
}: { 
  children: React.ReactNode; 
  config: Auth0Config;
  saveConfig: (d: string, c: string) => void;
  clearConfig: () => void;
}) {
  const { isAuthenticated, user, isLoading, loginWithRedirect, logout: rawLogout } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect().catch((err) => {
      console.error('Auth0 Redirect Login Failed:', err);
      alert('Error redirecting to Auth0. Please verify your Domain and Client ID.');
    });
  };

  const handleLogout = () => {
    // Clear the standard Auth0 local cookies/cache
    rawLogout({ 
      logoutParams: { returnTo: window.location.origin }
    });
  };

  return (
    <Auth0ConfigContext.Provider
      value={{
        domain: config.domain,
        clientId: config.clientId,
        isConfigured: true,
        saveConfig,
        clearConfig,
        isAuthenticated: !!isAuthenticated,
        user: user || null,
        isLoading: !!isLoading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </Auth0ConfigContext.Provider>
  );
}

// Fallback provider state when Auth0 is not yet configured or disabled
function MockAuth0Bridge({ 
  children, 
  saveConfig, 
  clearConfig 
}: { 
  children: React.ReactNode; 
  saveConfig: (d: string, c: string) => void;
  clearConfig: () => void;
}) {
  return (
    <Auth0ConfigContext.Provider
      value={{
        domain: '',
        clientId: '',
        isConfigured: false,
        saveConfig,
        clearConfig,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        login: () => {
          // No-op or trigger modal
        },
        logout: () => {},
      }}
    >
      {children}
    </Auth0ConfigContext.Provider>
  );
}

interface Auth0WrapperProps {
  children: React.ReactNode;
}

export function Auth0Wrapper({ children }: Auth0WrapperProps) {
  const [config, setConfig] = useState<Auth0Config | null>(null);

  useEffect(() => {
    // 1. Check for Config in process/Vite environments
    const envDomain = import.meta.env.VITE_AUTH0_DOMAIN || '';
    const envClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';

    if (envDomain && envClientId) {
      setConfig({ domain: envDomain, clientId: envClientId });
      return;
    }

    // 2. Fallback to LocalStorage config or official pre-configured defaults
    const storedDomain = localStorage.getItem('apppass_auth0_domain') || 'proidentity.au.auth0.com';
    const storedClientId = localStorage.getItem('apppass_auth0_client_id') || 'oLpSrx8dEXjxqv8q25Bf33ELPM8mWOVQ';

    if (storedDomain && storedClientId) {
      setConfig({ domain: storedDomain, clientId: storedClientId });
    }
  }, []);

  const saveConfig = (domain: string, clientId: string) => {
    localStorage.setItem('apppass_auth0_domain', domain.trim());
    localStorage.setItem('apppass_auth0_client_id', clientId.trim());
    // Update config in state to trigger re-rendering with Auth0Provider
    setConfig({ domain: domain.trim(), clientId: clientId.trim() });
    
    // Quick reload is often safest to re-bootstrap Auth0Provider on mount
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const clearConfig = () => {
    localStorage.removeItem('apppass_auth0_domain');
    localStorage.removeItem('apppass_auth0_client_id');
    localStorage.removeItem('apppass_profile'); // reset profile back to Alex
    setConfig(null);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // If we have a valid-looking domain and client ID, mount standard Auth0Provider
  if (config && config.domain && config.clientId) {
    return (
      <Auth0Provider
        domain={config.domain}
        clientId={config.clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <Auth0StateBridge 
          config={config} 
          saveConfig={saveConfig} 
          clearConfig={clearConfig}
        >
          {children}
        </Auth0StateBridge>
      </Auth0Provider>
    );
  }

  // Fallback if not configured yet
  return (
    <MockAuth0Bridge 
      saveConfig={saveConfig} 
      clearConfig={clearConfig}
    >
      {children}
    </MockAuth0Bridge>
  );
}
