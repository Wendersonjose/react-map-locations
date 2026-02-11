import MainLayout from './layouts/MainLayout';
import PlacesSidebar from './features/places/components/PlacesSidebar';
import MapContainer from './features/map/components/MapContainer';

export default function App() {
  return (
    <MainLayout
      sidebar={<PlacesSidebar />}
      content={<MapContainer />}
    />
  );
}
