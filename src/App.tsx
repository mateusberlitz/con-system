import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { SidebarDrawerProvider } from './components/_Contexts/SidebarDrawerContext';

function App() {
  return (
    <BrowserRouter>
      <SidebarDrawerProvider>
        <ChakraProvider theme={theme}>
          <Routes />
        </ChakraProvider>
      </SidebarDrawerProvider>
    </BrowserRouter>
  );
}

export default App;
