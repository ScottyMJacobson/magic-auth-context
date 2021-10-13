import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import MockMagic from './mocks/magic-sdk.mock';

jest.mock('magic-sdk', () => MockMagic);

import { MagicAuthProvider, useMagicAuth } from '../src';

describe('MagicAuthProvider', () => {
  it(`Gives child elements access to a MagicAuthContext that provides:
  - isLoggedIn, which is false until login
  - loginWithMagicLink() method 
  - after login, provides isLoggedIn === true and currentUserEmail info
  - provides logout() method
  - after logout, isLoggedIn === false, and info is null`, async () => {
    let logoutFromContext = () => Promise.resolve();

    let App = ({ deferredLoginPromise }: { deferredLoginPromise: Promise<unknown> }) => {
      const { loginWithMagicLink, isLoggedIn, currentUserEmail, magicDIDToken, logout } = useMagicAuth();
      const [resolvedJWT, setResolvedJWT] = React.useState<string | null>();

      logoutFromContext = logout;

      React.useEffect(() => {
        (async () => {
          await deferredLoginPromise;
          const jwt = await loginWithMagicLink({ email: 'fakeemail@mail.com' });
          setResolvedJWT(jwt);
        })()
      }, []);

      return <div>
        {`isLoggedIn is ${String(isLoggedIn)}.`}
        <br />
        {`resolvedJWT is ${resolvedJWT}`}
        <br />
        {`currentUserEmail is ${currentUserEmail}`}
        <br />
        {`magicDIDToken is ${magicDIDToken}`}
      </div>
    }

    let resolveLoginPromise: (value?: unknown) => void = () => {};
    const deferredLoginPromise = new Promise(resolve => {
      resolveLoginPromise = resolve;
    });

    const magicApiKey = 'some-fake-key';
    const tree = <MagicAuthProvider magicApiKey={magicApiKey}>
      <App deferredLoginPromise={deferredLoginPromise} />
    </MagicAuthProvider>
    render(tree);

    expect(screen.getByText('isLoggedIn is false', { exact: false })).toBeInTheDocument();

    // Now resolve the promise and see that the logged in status is true
    resolveLoginPromise();
    expect(await screen.findByText('isLoggedIn is true', { exact: false })).toBeInTheDocument(); // `find` instead of `get` because it might be slightly asynchronous
    expect(await screen.findByText('currentUserEmail is fakeemail@mail.com', { exact: false })).toBeInTheDocument(); // `find` instead of `get` because it might be slightly asynchronous
    expect(await screen.findByText('resolvedJWT is did:some-fake-token', { exact: false })).toBeInTheDocument(); // `find` instead of `get` because it might be slightly asynchronous
    expect(await screen.findByText('magicDIDToken is did:some-fake-token', { exact: false })).toBeInTheDocument(); // `find` instead of `get` because it might be slightly asynchronous

    await act(async () => {
      await logoutFromContext()
    });

    expect(await screen.findByText('isLoggedIn is false', { exact: false })).toBeInTheDocument(); // findByText since it's async
  });
});
