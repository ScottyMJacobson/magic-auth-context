import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MagicAuthProvider } from '../.';
import ComponentThatUsesAuth from './components/ComponentThatUsesAuth';

const App = () => {
  return (
    <MagicAuthProvider
      magicApiKey={import.meta.env.VITE_MAGIC_API_KEY as string}
    >
      <ComponentThatUsesAuth />
    </MagicAuthProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
