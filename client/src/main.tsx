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
  </React.StrictMode>,
)
