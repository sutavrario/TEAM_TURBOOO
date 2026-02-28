import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App'; // Path updated to match your folder structure
import { Auth0Provider } from '@auth0/auth0-react';

// Assuming your global CSS is in the 'styles' folder. If it's named differently, update this!
import './styles/index.css'; 

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN || 'vocalguard-dev.us.auth0.com';
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '3OyUz30IO6bZYCiFB1JdeOz2tzseyjPk';
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://vocalguard-api';

console.log('🔄 Initializing Auth0...');
console.log('Domain:', auth0Domain);
console.log('Client ID:', auth0ClientId);

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Audience
      }}
      onError={(error) => console.error('Auth0 Error:', error)}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
);

console.log('✅ App mounted successfully');