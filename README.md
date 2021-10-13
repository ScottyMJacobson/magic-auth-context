# magic-auth-context
A react context and hook that provides [Magic.link](https://magic.link/) functionality across your app.

## Features

- 3-line integration
- Supports React [hooks](https://reactjs.org/docs/hooks-intro.html).
- Built with TypeScript, so includes TS types.
- Since Magic.link [maintains a user's session for 7 days](https://magic.link/docs/api-reference/client-side-sdks/web#re-authenticate-users), `magic-auth-context` automatically attempts to re-authenticate on startup if a user is already logged into your app.

## Installation

Using [yarn](https://yarnpkg.com/)

```bash
yarn add magic-auth-context
```

## Getting Started

For a working example - look at the example app included at `example/`.

First, get your [Magic.link](https://dashboard.magic.link/) public API key.

Configure the library by wrapping your application in `MagicAuthProvider`, and providing this `magicApiKey`.

For example, in an app where you're calling `ReactDOM.render()` yourself:

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

```jsx
// src/ComponentThatUsesAuth.jsx

function ComponentThatUsesAuth() {
    const { isLoggedIn, currentUserEmail, attemptingReauthentication, logout, loginWithMagicLink } = useMagicAuth();
    const [emailValue, setEmailValue] = React.useState<string>('');

    if (attemptingReauthentication) {
        return <div>Attempting to reauthenticate user...</div>
    }

    if (isLoggedIn) {
        return (
            <div>
                Hello {currentUserEmail}{" "}
                <br />
                <button onClick={logout}>
                    Log out
                </button>
            </div>
        )
    }

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginWithMagicLink({ email: emailValue });
    }

    return <form id="login-with-email" onSubmit={handleLoginSubmit}>
        <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" name="email" aria-describedby="emailHelp" value={emailValue} onChange={e => setEmailValue(e.target.value)} />
        </div>
        <button type="submit">Log In</button>
    </form>
}
```

## TODOs

- More sensible exposing of metadata - perhaps `metadata` object vs `currentUserEmail` string
- Handle Magic errors
- Configure whether to automatically attempt to re-authenticate on startup
    - Security considerations around shared computers / persistent sessions
- Support `loginWithSMS()`
- Add Magic.link API key screenshot
- Refresh DIDToken when it expires

## Influences

Thank you to [`dts-cli`](https://www.npmjs.com/package/dts-cli) for providing the framework to make the library, and [`react-oidc-context`](https://github.com/AxaGuilDEv/react-oidc) for inspiration.

## License
This project is licensed under the MIT license. See the LICENSE file for more info.