import { Switch, Route, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';

import Login from './pages/Login';
import ConfigsHome from './pages/configs/';
import Companys from './pages/configs/Companys';
import Users from './pages/configs/Users';
import Roles from './pages/configs/Roles';
import { isAuthenticated } from './services/auth';
import { HasPermission } from './hooks/useProfile';
import { ComponentType, ReactComponentElement, ReactElement, ReactNode, ReactInstance } from 'react';
import { useToast } from '@chakra-ui/toast';
import { useRedirectedToasts } from './hooks/useRedirectedToasts';
import { getHeapCodeStatistics } from 'node:v8';

interface PrivateRouteProps extends RouteProps{
  component: any;
  neededPermission: string;
}

const PrivateRoute = ({component: Component, neededPermission, ...rest} : PrivateRouteProps) => {
  const { sendNewToast } = useRedirectedToasts();

  !isAuthenticated() && sendNewToast({
    title: "Ops",
    description: "Está área precisa de login.",
    status: 'warning',
    duration: 9000,
    isClosable: true,
  });

  return <Route {...rest} render={props => (
                isAuthenticated() && HasPermission(neededPermission) ? (
                    <Component {...props} />
                ) 
                : (
                    <Redirect to={{ pathname: '/' }}/>
                )
              )
            } 
          />
}

const Routes = (): JSX.Element => {
    return (
      <Switch>
        <Route path="/" exact component={Login} />
        <PrivateRoute path="/home" neededPermission="Configurações" exact component={ConfigsHome} />
        <PrivateRoute path="/empresas" neededPermission="Empresas" exact component={Companys} />
        <PrivateRoute path="/usuarios" neededPermission="Usuários" exact component={Users} />
        <PrivateRoute path="/permissoes" neededPermission="Usuários" exact component={Roles} />

        {/* <PrivateRoute path="/empresas" component={Roles} /> */}
      </Switch>
    );
};
  
export default Routes;