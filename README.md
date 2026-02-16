# Mapa de Locais Favoritos (Desafio Ivare)

![Screenshot](screenshot.png)

Este projeto foi desenvolvido como parte do desafio técnico para a vaga de Front-end na Ivare. Trata-se de uma aplicação interativa de mapas que permite aos usuários buscar endereços, navegar pelo mapa e salvar seus locais favoritos.

##  Funcionalidades

- ** Mapa Interativo**: Visualização baseada em OpenStreetMap (via Leaflet) com controles de zoom e navegação fluida.
- ** Busca Inteligente**:
  - Pesquisa por endereço completo.
  - Pesquisa por CEP (integração com BrasilAPI e Nominatim).
  - Busca reversa: Clique em qualquer ponto do mapa para descobrir o endereço.
- ** Favoritos**:
  - Salve locais com nome personalizado.
  - Categorize seus locais (Casa, Trabalho, Restaurante, Parque, Compras, Geral).
  - Marcadores personalizados no mapa com ícones e cores por categoria.
- ** Persistência de Dados**: Seus locais ficam salvos no navegador (LocalStorage)
- ** Responsivo**: Interface adaptada para desktop e mobile.

##  Tecnologias Utilizadas

- **React + Vite**: Framework e bundler para alta performance e DX.
- **Leaflet + React-Leaflet**: Biblioteca de mapas robusta e open-source.
- **Zustand**: Gerenciamento de estado global simples e leve.
- **TanStack Query (React Query)**: Gerenciamento eficiente de requisições assíncronas e cache.
- **Axios**: Cliente HTTP para consumo de APIs.
- **TailwindCSS**: Estilização utilitária moderna.
- **Lucide React**: Biblioteca de ícones consistente e leve.
- **Sonner**: Sistema de notificações toast elegante.

##  Como Rodar o Projeto

1. **Clone o repositório**:
   \\\ash
   git clone https://github.com/Wendersonjose/react-map-locations.git
   cd mapa-locais-favoritos
   \\\`n
2. **Instale as dependências**:
   \\\ash
   npm install
   \\\`n
3. **Inicie o servidor de desenvolvimento**:
   \\\ash
   npm run dev
   \\\`n
4. **Acesse a aplicação**:
   Abra seu navegador em [http://localhost:5173](http://localhost:5173)

##  Estrutura do Projeto

```
src/
 features/           # Funcionalidades modulares
    map/            # Componentes visuais do mapa (Marcadores, View)
    locations/      # Lógica de listagem, busca e formulários (Sidebar, SearchBar)
 services/           # Integrações com APIs (BrasilAPI, Nominatim)
 store/              # Gerenciamento de estado global (Zustand)
 hooks/              # Hooks personalizados (useSearchLocation)
 ...
```
##  Decisões Técnicas

- **Leaflet**: Escolhido por ser gratuito, leve e não exigir chaves de API complexas para um projeto de avaliação, facilitando o teste por qualquer pessoa.
- **Zustand**: Adotado pela simplicidade e menor boilerplate comparado ao Redux, ideal para o escopo deste projeto.
- **Arquitetura**: Organização por *features* para manter o código desacoplado e escalável.

---

Desenvolvido por [Wenderson José](https://github.com/Wendersonjose)
