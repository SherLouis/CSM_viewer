import ReactDOM from 'react-dom/client';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BasePage from './BasePage';
import { ArticlesPage } from '../pages/Edit/ArticlesPage/ArticlesPage';
import { ArticleResultsPage } from '../pages/Edit/ArticleResultsPage/ArticleResultsPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <HashRouter>
    <App/>
  </HashRouter>
);

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <BasePage title='CSM viewer'>
          <Routes>
            <Route path='*' element={<ArticlesPage/>} /> {/* This is the default Route */}
            <Route path='/edit/sources' element={<ArticlesPage/>} />
            <Route path='/edit/sources/:articleId/results' element={<ArticleResultsPage/>}/>
          </Routes>
        </BasePage>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
