# Mapa de Locais Favoritos (Desafio Ivare)

Aplicação desenvolvida para o desafio técnico de Front-end da Ivare. Permite visualizar mapas, buscar endereços e salvar locais favoritos.

##  Tecnologias Utilizadas

- **React + Vite**: Performance e DX.
- **Leaflet (react-leaflet)**: Mapas interativos (OpenStreetMap).
- **Zustand**: Gerenciamento de estado leve e persistência local.
- **Tanstack React Query**: Gerenciamento de requisições assíncronas (Busca).
- **TailwindCSS**: Estilização moderna e responsiva.
- **Axios**: Requisições HTTP.

##  Como rodar o projeto

1. Clone o repositório ou acesse a pasta do projeto.
2. Instale as dependências:
   `ash
   npm install
   ` 
3. Inicie o servidor de desenvolvimento:
   `ash
   npm run dev
   ` 
4. Acesse http://localhost:5173

##  Funcionalidades

- **Mapa Interativo**: Começa em Uberlândia-MG.
- **Busca**: Pesquise por endereços usando a API Nominatim (OpenStreetMap).
- **Favoritos**: Clique no mapa para selecionar e salvar um local com nome personalizado.
- **Persistência**: Seus locais ficam salvos no navegador (LocalStorage).
- **Navegação**: Clique na lista lateral para voar até o local salvo.

##  Decisões Técnicas

- Optei pelo **Leaflet** ao invés do Google Maps para evitar necessidade de chaves de API pagas/complexas para avaliação, mantendo o foco na funcionalidade.
- **Zustand** foi escolhido pela simplicidade em lidar com estados globais sem o boilerplate do Context API ou Redux.

