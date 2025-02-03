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

// Custom sign-up form configuration
const formFields = {
  signUp: {
    username: {
      order: 1,
      isRequired: true,
      placeholder: 'Enter username'
    },
    email: {
      order: 2,
      isRequired: true,
      placeholder: 'Enter your email'
    },
    password: {
      order: 3,
      isRequired: true,
      placeholder: 'Enter your password'
    },
    confirm_password: {
      order: 4,
      isRequired: true,
      placeholder: 'Confirm your password'
    }
  }
};

// Custom components configuration
const components = {
  Header() {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>GenAI-Assistant</h1>
        <p>Please sign up or sign in to continue</p>
      </div>
    );
  }
};

function App({ signOut, user }) {
  return (
    <>
      <div className="messages-container">
        <ChatComponent />
      </div>
    </>
  );
}

export default withAuthenticator(App, {
  components,
  formFields,
  initialState: 'signIn'
});
