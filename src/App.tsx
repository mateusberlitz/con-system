import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { SidebarDrawerProvider } from './components/_Contexts/SidebarDrawerContext';
import { ProfileProvider } from './hooks/useProfile';
import { WorkingCompanyProvider } from './hooks/useWorkingCompany';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {

  return (
    
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <SidebarDrawerProvider>
            <ChakraProvider theme={theme}>
                      <ProfileProvider>
                          <WorkingCompanyProvider>
                              <Routes />
                          </WorkingCompanyProvider>
                      </ProfileProvider>
            </ChakraProvider>
          </SidebarDrawerProvider>
      </QueryClientProvider>
    </BrowserRouter>
  
);
}

export default App;
