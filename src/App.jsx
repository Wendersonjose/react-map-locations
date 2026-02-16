import HomePage from './pages/HomePage';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <HomePage />
      <Toaster richColors position="top-center" />
    </>
  );
}
