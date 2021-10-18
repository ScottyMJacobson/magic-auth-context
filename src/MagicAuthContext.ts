import React from 'react';
import {
  LoginWithMagicLinkConfiguration,
  MagicUserMetadata,
} from '@magic-sdk/types';

export interface MagicAuthContextProps {
  /**
   * Attempts to lead the user through the Magic.link login flow with the provided email.
   *
   * If unsuccesful, returns null.
   *
   * If successful, returns the new Decentralized ID Token provided by Magic, and assigns it to magicToken in the MagicAuthContext
   *
   * Also accepts params `showUI` and `redirectURI`.
   *
   * See: https://magic.link/docs/api-reference/client-side-sdks/web#loginwithmagiclink
   *
   * @memberof MagicAuthContextProps
   */
  loginWithMagicLink: (
    config: LoginWithMagicLinkConfiguration
  ) => Promise<string | null>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  metadata: MagicUserMetadata | null;
  attemptingReauthentication: boolean;
  magicDIDToken: string | null;
}

export const MagicAuthContext = React.createContext<MagicAuthContextProps>(
  undefined as any
);
MagicAuthContext.displayName = 'MagicAuthContext';
