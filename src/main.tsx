import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import * as ReactDOM from 'react-dom/client';
import { App } from './app';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider
      toastOptions={{ defaultOptions: { position: 'top-right' } }}
    >
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
