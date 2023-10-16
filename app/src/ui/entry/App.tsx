import ReactDOM from 'react-dom/client';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BasePage from './BasePage';
import { SourcesPage } from '../pages/Edit/SourcesPage/SourcesPage';
import { SourceDetailsPage } from '../pages/Edit/SourceDetailsPage/SourceDetailsPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <HashRouter>
    <App/>
  </HashRouter>
);

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  
  console.log("App rendered");
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Notifications position="top-right"/>
        <BasePage title='CSM data'>
          <Routes>
            <Route path='*' element={<SourcesPage/>} /> {/* This is the default Route */}
            <Route path='/edit/sources' element={<SourcesPage/>} />
            <Route path='/edit/sources/:sourceIdParam' element={<SourceDetailsPage/>}/>
          </Routes>
        </BasePage>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
