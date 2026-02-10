/**
 * Ponto de entrada (Entry Point) da aplicação React.
 * Configura os Providers globais: React Query e Contextos.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

// Instância do cliente React Query para gerenciamento de cache de requisições
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provê o cliente de queries para toda a árvore de componentes */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
