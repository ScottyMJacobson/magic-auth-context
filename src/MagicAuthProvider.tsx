import React, { useState, useEffect } from 'react';
import { MagicAuthContext } from './MagicAuthContext';
import { Magic } from 'magic-sdk';
import { LoginWithMagicLinkConfiguration } from '@magic-sdk/types';
import { MagicSDKAdditionalConfiguration, SDKBase } from '@magic-sdk/provider'; // Types

let magicInstance: SDKBase;

/**
 * Necessary because Magic uses the window object, which isn't available when nextjs is server-side-rendering
 *
 * To solve this, we just init magic lazily
 * @returns
 */
function getMagicInstance(
  magicApiKey: string,
  magicOptions?: MagicSDKAdditionalConfiguration
): SDKBase {
  if (!magicInstance) {
    magicInstance = new Magic(magicApiKey, magicOptions);
  }
  return magicInstance;
}

export default function MagicAuthProvider({
  children,
  magicApiKey,
  magicOptions,
}: {
  children: React.ReactNode;
  magicApiKey: string;
  magicOptions?: MagicSDKAdditionalConfiguration;
}): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [magicDIDToken, setmagicDIDToken] = useState<string | null>(null);
  const [currentUserEmail, setcurrentUserEmail] = useState<string | null>(null);
  const [attemptingReauthentication, setAttemptingReauthentication] =
    useState<boolean>(false);

  const loginWithMagicLink = async (
    config: LoginWithMagicLinkConfiguration
  ) => {
    let jwt;
    try {
      // This promise doesn't resolve until the email has been verified by the user
      // If successful, jwt will be a 15-minute active jwt that can be used to authorize requests
      jwt = await getMagicInstance(
        magicApiKey,
        magicOptions
      ).auth.loginWithMagicLink(config);
    } catch (e) {
      console.error('Error getting magic jwt', e);
      return null;
    }
    setIsLoggedIn(true);
    setmagicDIDToken(jwt);
    const metadata = await getMagicInstance(
      magicApiKey,
      magicOptions
    ).user.getMetadata();
    setcurrentUserEmail(metadata.email);
    return jwt;
  };

  const logout = async () => {
    await getMagicInstance(magicApiKey, magicOptions).user.logout();
    setIsLoggedIn(false);
    setmagicDIDToken(null);
    setcurrentUserEmail(null);
  };

  // Attempt to re-authenticate the magic user automatically on init - magic sessions are good for 7 days https://magic.link/docs/client-sdk/web/examples/reauthenticating-users
  useEffect(() => {
    setAttemptingReauthentication(true);
    (async () => {
      let alreadyLoggedIn: boolean;
      try {
        alreadyLoggedIn = await getMagicInstance(
          magicApiKey,
          magicOptions
        ).user.isLoggedIn();
      } catch (e) {
        console.error('Caught error attempting to reauthenticate user.', e);
        alreadyLoggedIn = false;
      }

      if (alreadyLoggedIn) {
        const jwt = await getMagicInstance(
          magicApiKey,
          magicOptions
        ).user.getIdToken();
        setIsLoggedIn(true);
        setmagicDIDToken(jwt);
        const metadata = await getMagicInstance(
          magicApiKey,
          magicOptions
        ).user.getMetadata();
        setcurrentUserEmail(metadata.email);
      }

      setAttemptingReauthentication(false);
    })();
  }, [magicApiKey, magicOptions]); // magicApiKey and magicOptions are technically dependencies but should never change. Proper handling of a config that changes would require some teardown

  return (
    <>
      <MagicAuthContext.Provider
        value={{
          isLoggedIn,
          currentUserEmail,
          magicDIDToken,
          loginWithMagicLink,
          logout,
          attemptingReauthentication,
        }}
      >
        {children}
      </MagicAuthContext.Provider>
    </>
  );
}
