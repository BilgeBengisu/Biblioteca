import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext.tsx';
const queryClient = new QueryClient();


import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './apollo-client';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ApolloProvider client={apolloClient}>  
          <Router>
            <App />
          </Router>
        </ApolloProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);