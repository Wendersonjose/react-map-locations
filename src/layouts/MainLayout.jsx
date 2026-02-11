import React from 'react';
import { Toaster } from 'sonner';

/**
 * MainLayout
 * Responsável por estruturar o layout (Sidebar + Content + Toaster)
 */
const MainLayout = ({ sidebar, content }) => {
  return (
    <div className='flex h-screen w-full flex-col md:flex-row bg-gray-100 overflow-hidden'>
      {/* Área da Sidebar */}
      {sidebar}
      
      {/* Área Principal (Mapa) */}
      <div className='flex-1 relative h-full'>
        {content}
      </div>
      
      {/* Notificações no topo direito */}
      <Toaster richColors position='top-right' />
    </div>
  );
};

export default MainLayout;
