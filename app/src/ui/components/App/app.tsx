import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import './app.css';
import CreatePage from './pages/create/create';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
<MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
  <CreatePage />
</MantineProvider>
);