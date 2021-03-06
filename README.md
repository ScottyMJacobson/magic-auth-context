# magic-auth-context
A react context and hook that provides [Magic.link](https://magic.link/) functionality across your app.

```tsx
// Wrap your app...
import { MagicAuthProvider } from 'magic-auth-context';
<MagicAuthProvider>
  <App />
</MagicAuthProvider>

// You're now free to use the hook wherever...
import { useMagicAuth } from 'magic-auth-context';

// Inside some component that prompts the login flow
const { loginWithMagicLink } = useMagicAuth();
// ... somewhere further down in that component
const magicToken = await loginWithMagicLink({ email })

// Inside another component that shows the user
const { metadata } = useMagicAuth();
return `Hello, ${metadata?.email}!`;
```

## Features

- 5-line integration
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

![Magic API Key](https://user-images.githubusercontent.com/8656857/138496734-2ab5b2d3-130d-428f-a6e5-6eaea69d2571.png)

Configure the library by wrapping your application in `MagicAuthProvider`, and providing this `magicApiKey`.

For example, in an app where you're calling `ReactDOM.render()` yourself:

```tsx
// src/index.tsx
import React from "react"
import ReactDOM from "react-dom"
import { MagicAuthProvider } from "magic-auth-context"
import App from "./App"

ReactDOM.render(
    <MagicAuthProvider magicApiKey='your-magic-api-token'>
        <App />
    <MagicAuthProvider />,
    document.getElementById('app')
);
```
_(In production apps I'd recommend using an env variable)_

Then you can use the `useMagicAuth` hook in your components to access authentication state (`isLoggedIn`, `attemptingReauthentication`, `metadata`, and `magicDIDToken`) and authentication methods (`loginWithMagicLink()` and `logout()`).

```tsx
// src/ComponentThatUsesAuth.tsx

function ComponentThatUsesAuth() {
    const { isLoggedIn, metadata, attemptingReauthentication, logout, loginWithMagicLink } = useMagicAuth();
    const [emailValue, setEmailValue] = React.useState<string>('');

    if (attemptingReauthentication) {
        return <div>Attempting to reauthenticate user...</div>
    }

    if (isLoggedIn) {
        return (
            <div>
                Hello {metadata?.email}{" "}
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

## Influences

Thank you to [`dts-cli`](https://www.npmjs.com/package/dts-cli) for providing the framework to make the library, and [`react-oidc-context`](https://github.com/AxaGuilDEv/react-oidc) for inspiration.

## License
This project is licensed under the MIT license. See the LICENSE file for more info.
