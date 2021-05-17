import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { SidebarDrawerProvider } from './components/_Contexts/SidebarDrawerContext';
import { ProfileProvider } from './hooks/useProfile';
import { SelectedCompanyProvider } from './hooks/useSelectedCompany';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  // return (
    
  //     <BrowserRouter>
  //       <QueryClientProvider client={queryClient}>
  //           <SidebarDrawerProvider>
  //             <ChakraProvider theme={theme}>
  //                   {
  //                     isAuthenticated() ? (
  //                       <ProfileProvider>
  //                         <Routes />
  //                       </ProfileProvider>
  //                     )
  //                     :(
  //                       <Routes />
  //                     )
  //                   }
  //             </ChakraProvider>
  //           </SidebarDrawerProvider>
  //       </QueryClientProvider>
  //     </BrowserRouter>
    
  // );

  return (
    
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <SidebarDrawerProvider>
            <ChakraProvider theme={theme}>
                      <ProfileProvider>
                          <SelectedCompanyProvider>
                              <Routes />
                          </SelectedCompanyProvider>
                      </ProfileProvider>
            </ChakraProvider>
          </SidebarDrawerProvider>
      </QueryClientProvider>
    </BrowserRouter>
  
);
}

export default App;
