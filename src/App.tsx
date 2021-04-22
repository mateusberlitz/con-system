import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { SidebarDrawerProvider } from './components/_Contexts/SidebarDrawerContext';
import { ProfileProvider } from './hooks/useProfile';
import { RedirectedToastsProvider } from './hooks/useRedirectedToasts';
import { isAuthenticated } from './services/auth';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <SidebarDrawerProvider>
            <ChakraProvider theme={theme}>
                <RedirectedToastsProvider>

                      {isAuthenticated() ? 
                        <ProfileProvider>
                            <Routes />
                        </ProfileProvider>
                      :
                        <Routes />
                      }

                </RedirectedToastsProvider>
            </ChakraProvider>
          </SidebarDrawerProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
