import ReactDOM from 'react-dom/client';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import './app.css';
import CreatePage from '../../pages/create/create';
import { useState } from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App/>);

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <CreatePage />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
