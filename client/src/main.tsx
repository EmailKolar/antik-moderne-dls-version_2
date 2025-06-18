import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './theme'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import router from './pages/routes'
import { ClerkProvider } from '@clerk/clerk-react'

import * as Sentry from "@sentry/react";
console.log('Sentry DSN:', import.meta.env.VITE_SENTRY_DSN)

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "https://3ad909e3f85183e3f25b24a034a6d095@o4509513311846400.ingest.de.sentry.io/4509513386688592",
  environment:"development",
  sendDefaultPii: true,
});

console.log("Sentry initialized");
//Sentry.captureException(new Error("Test Sentry error from frontend"));



const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 3,
        refetchOnMount: true,
        refetchOnReconnect: true,
        staleTime: 5000,
        cacheTime: 10000,
      },
    },
  }
);

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
    <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ColorModeScript />
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools/>
      <RouterProvider router={router} />
    </QueryClientProvider>
    </ChakraProvider>
    </ClerkProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)
