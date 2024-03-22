import React, { useEffect, useState } from 'react';
import { Layout } from '../components';

import { useMsal } from "@azure/msal-react";

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig, loginRequest } from '../msAuthConfig/authConfig';

import 'tailwindcss/tailwind.css'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  
  const msalInstance = new PublicClientApplication({...msalConfig});

  return (
    <Layout >
      <MsalProvider instance={msalInstance}>
        <Component {...pageProps} />
      </MsalProvider>
    </Layout>
  );
}

export default MyApp
