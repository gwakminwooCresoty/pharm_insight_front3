import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { BRANDING } from '@/data/branding.dummy';

document.title = BRANDING.serviceName;

export default function App() {
  return <RouterProvider router={router} />;
}
