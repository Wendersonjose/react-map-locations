/**
 * Componente Raiz da Aplicação (Layout Main).
 * Estrutura a tela dividindo entre Sidebar (lista/busca) e MapComponent (visualização).
 * Inclui também o 'Toaster' para notificações globais.
 */
import { Toaster } from 'sonner';
import Sidebar from './components/Sidebar';
import MapComponent from './components/Map';

export default function App() {
  return (
    // Container flexível: coluna em mobile, linha em desktop (md:flex-row)
    <div className='flex h-screen w-full flex-col md:flex-row bg-gray-100 overflow-hidden'>
      
      {/* Barra lateral com lista de locais */}
      <Sidebar />
      
      {/* Área principal do mapa (flex-1 ocupa o espaço restante) */}
      <div className='flex-1 relative h-full'>
        <MapComponent />
      </div>
      
      {/* Provider de Notificações (Toasts) posicionado no topo direito */}
      <Toaster richColors position='top-right' />
    </div>
  );
}
