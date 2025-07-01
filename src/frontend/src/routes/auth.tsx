import React, { useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ActorSubclass } from '@dfinity/agent';
// import { createActor } from '../../../declarations/internet_identity';
// import { canisterId } from '../../../declarations/internet_identity/index.js';
// import { _SERVICE } from 'declarations/internet_identity/internet_identity.did';
import { createActor } from '../../../declarations/authentication';
import { canisterId } from '../../../declarations/authentication/index.js';
import { _SERVICE } from 'declarations/authentication/authentication.did';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: Auth,
})

const network = import.meta.env.DFX_NETWORK || 'local';

const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'; // Local

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
}

interface AppState {
  actor: ActorSubclass<_SERVICE> | undefined;
  authClient: AuthClient | undefined;
  isAuthenticated: boolean;
  principal: string;
}

// Reusable button component
const Button = ({ onClick, children }: ButtonProps) => <button onClick={onClick}>{children}</button>;

function Auth() {
  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);

  const [state, setState] = useState<AppState>({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: 'Click "Whoami" to see your principal ID'
  });

  const updateActor = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });
    const isAuthenticated = await authClient.isAuthenticated();

    setState((prev: AppState): AppState => ({
      ...prev,
      actor,
      authClient,
      isAuthenticated
    }));
  };

  const login = async () => {
    if (state.authClient) {
      await state.authClient.login({
        identityProvider,
        onSuccess: updateActor
      });
    }
  };

  const logout = async () => {
    if (state.authClient) {
      await state.authClient.logout();
    }
    updateActor();
  };

  const whoami = async () => {
    setState((prev) => ({
      ...prev,
      principal: 'Loading...'
    }));

    let result;

    let principal: string = 'Click "Whoami" to see your principal ID';

    if (state.actor) {
      result = await state.actor.whoami();
      principal = result.toString();
    }

    setState((prev) => ({
      ...prev,
      principal
    }));
  };

  return (
    <div>
      <h1>Who Am I?</h1>
      <div id="info-box" className="info-box">
        <div className="info-content">
          <p>
            <i className="fas fa-info-circle"></i> A <strong>principal</strong> is a unique identifier in the Internet
            Computer ecosystem.
          </p>
          <p>
            It represents an entity (user, canister smart contract, or other) and is used for identification and
            authorization purposes.
          </p>
          <p>
            In this example, click "Whoami" to find out the principal ID with which you're interacting with the backend.
            If you're not signed in, you will see that you're using the so-called anonymous principal, "2vxsx-fae".
          </p>
          <p>
            After you've logged in with Internet Identity, you'll see a longer principal, which is unique to your
            identity and the dapp you're using.
          </p>
        </div>
      </div>

      {!state.isAuthenticated ? (
        <Button onClick={login}>Login with Internet Identity</Button>
      ) : (
        <Button onClick={logout}>Logout</Button>
      )}

      <Button onClick={whoami}>Whoami</Button>

      {state.principal && (
        <div>
          <h2>Your principal ID is:</h2>
          <h4>{state.principal}</h4>
        </div>
      )}
    </div>
  );
};

export default Auth;