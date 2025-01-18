import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import ChatComponent from './components/ChatComponent';

// Configure Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION,
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID
    }
  }
};

Amplify.configure(amplifyConfig);

function App({ signOut, user }) {
  return (
    <div className="app" align='center'>
      <header>
        <h1>Welcome {user.username}</h1>
        <button onClick={signOut}>Sign out</button>
      </header>
      <ChatComponent />
    </div>
  );
}

export default withAuthenticator(App);
