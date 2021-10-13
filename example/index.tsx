import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MagicAuthProvider, useMagicAuth } from '../.';

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

const App = () => {
  return (
      <MagicAuthProvider magicApiKey={process.env.MAGIC_API_KEY as string}>
        <ComponentThatUsesAuth />
      </MagicAuthProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
