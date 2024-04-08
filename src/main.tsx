import * as React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import * as ReactDOM from 'react-dom/client';
import { App } from './app';
import { theme } from './theme';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
    <ChakraProvider
      theme={theme}
      toastOptions={{ defaultOptions: { position: 'top-right' } }}
    >
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
