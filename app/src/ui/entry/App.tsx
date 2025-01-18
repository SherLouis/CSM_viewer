import ReactDOM from 'react-dom/client';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BasePage from './BasePage';
import { SourcesPage } from '../pages/Edit/SourcesPage/SourcesPage';
import { SourceDetailsPage } from '../pages/Edit/SourceDetailsPage/SourceDetailsPage';
import { AppContextProvider } from '../context/AppContext';
import SettingsPage from '../pages/Settings';
import { PreferencesContextProvider } from '../context/PreferenceContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <HashRouter>
    <App />
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
        <AppContextProvider>
          <PreferencesContextProvider>
            <Notifications position="top-right" />
            <BasePage title='CSM data'>
              <Routes>
                <Route path='*' element={<SourcesPage />} />
                <Route path='/edit/sources' element={<SourcesPage />} />
                <Route path='/edit/sources/:sourceIdParam' element={<SourceDetailsPage />} />
                <Route path='/settings' element={<SettingsPage />} />
              </Routes>
            </BasePage>
          </PreferencesContextProvider>
        </AppContextProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
