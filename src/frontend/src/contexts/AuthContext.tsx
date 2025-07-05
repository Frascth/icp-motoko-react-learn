import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../declarations/authentication';
import { canisterId } from '../../../declarations/authentication/index.js';
import type { _SERVICE } from 'declarations/authentication/authentication.did';
import { ActorSubclass } from '@dfinity/agent';

const network = import.meta.env.DFX_NETWORK || 'local';

const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app'
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

interface AuthContextProps {
  actor: ActorSubclass<_SERVICE> | null;
  authClient: AuthClient | null;
  isAuthenticated: boolean;
  principal: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<ActorSubclass<_SERVICE> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState("Click Whoami to see your principal");

  const updateAuth = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    const isAuthed = await client.isAuthenticated();
    setIsAuthenticated(isAuthed);

    const identity = client.getIdentity();
    const actor = createActor(canisterId, { agentOptions: { identity } });
    setActor(actor);

    const principalResponse = await actor.whoami();
    setPrincipal(principalResponse.toString());
  };

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider,
      onSuccess: updateAuth,
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    await updateAuth();
  };

  useEffect(() => {
    updateAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        actor,
        authClient,
        isAuthenticated,
        principal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
