# magic-auth-context
A react context and hook that provides [Magic.link](https://magic.link/) functionality across your app.

Supports React [hooks](https://reactjs.org/docs/hooks-intro.html).

Since Magic.link [maintains a user's session for 7 days](https://magic.link/docs/api-reference/client-side-sdks/web#re-authenticate-users), magic-auth-context automatically attempts to re-authenticate on startup.

## Installation

Using [yarn](https://yarnpkg.com/)

```bash
yarn add magic-auth-context
```

## Getting Started

For a working example - look at the example app included at `example/`.

First, get your [Magic.link](https://dashboard.magic.link/) public API key.

Configure the library by wrapping your application in `MagicAuthProvider`, and providing this `magicApiKey`.

For example, if you're calling `ReactDOM.render` yourself:

```jsx
// src/index.jsx
import React from "react"
import ReactDOM from "react-dom"
import { AuthProvider } from "react-oidc-context"
import App from "./App"

ReactDOM.render(
    <MagicAuthProvider magicApiKey='your-magic-api-token'>
        <App />
    <MagicAuthProvider />,
    document.getElementById('app')
);
```

Then you can use the `useMagicAuth` hook in your components to access authentication state (`isLoggedIn`, `attemptingReauthentication`, `currentUserEmail`, and `magicJWT`) and authentication methods (`loginWithMagicLink()` and `logout()`).

## TODOs

- Handle Magic errors
- Configure whether to automatically attempt to re-authenticate on startup
    - Security considerations around shared computers / persistent sessions
- Support `loginWithSMS()`
- Add Magic.link API key screenshot
- Refresh DIDToken when it expires
- Tests

## Influences

Thank you to [`dts-cli`](https://www.npmjs.com/package/dts-cli) for providing the framework to make the library, and [`react-oidc-context`](https://github.com/AxaGuilDEv/react-oidc) for inspiration.

## License
This project is licensed under the MIT license. See the LICENSE file for more info.
