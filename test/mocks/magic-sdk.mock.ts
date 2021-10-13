const FAKE_DID_TOKEN = 'did:some-fake-token';

type MagicState = {
  loggedIn: boolean;
  metadata: null | {
    email: string
  };
  magicDIDToken: null | string;
}

const state: MagicState = {
  loggedIn: false,
  metadata: null,
  magicDIDToken: null,
};

const userApi = {
  isLoggedIn: () => Promise.resolve(state.loggedIn),
  getMetadata: () => Promise.resolve(state.metadata),
  logout: () => { state.loggedIn = false; return Promise.resolve() },
};

const authApi = {
  loginWithMagicLink: ({ email }: { email: string }) => { state.metadata = { email }; state.magicDIDToken = FAKE_DID_TOKEN; return Promise.resolve(FAKE_DID_TOKEN) }
}

class MockMagicSDK {
  user = userApi
  auth = authApi
}

const MockMagicModule = {
  Magic: MockMagicSDK
};

export default MockMagicModule;
