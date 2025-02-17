import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ThemeProvider } from '@/context/ThemeProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { BrowserRouter } from "react-router";

import { NuqsAdapter } from 'nuqs/adapters/react'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuqsAdapter>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </NuqsAdapter>
  </StrictMode >,
)
