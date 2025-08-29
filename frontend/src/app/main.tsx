import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ShadcnToaster } from "@/components/ui/sonner"
import store from './store.ts'
import { ThemeProvider } from '@/provider/theme.provider.tsx'



const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Toaster />
          <ThemeProvider >
            <App />
          </ThemeProvider>
          <ShadcnToaster />
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
)
