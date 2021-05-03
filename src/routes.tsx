import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';

import Login from './pages/Login';
import Me from './pages/Me';
import ConfigsHome from './pages/configs/';
import Companys from './pages/configs/Companys';
import Users from './pages/configs/Users';
import Roles from './pages/configs/Roles';
import { isAuthenticated } from './services/auth';
import { HasPermission, useProfile } from './hooks/useProfile';

interface PrivateRouteProps extends RouteProps{
  component: any;
  neededPermission?: string;
}

const PrivateRoute = ({component: Component, neededPermission = "", ...rest} : PrivateRouteProps) => {
  const { permissions } = useProfile();

  return <Route {...rest} render={props => (
                !isAuthenticated() ? (
                    <Redirect to={{ pathname: '/' , state: "Por favor, acesse sua conta."}}/>
                    
                ) : ( !HasPermission(permissions, neededPermission) ? (
                    <Redirect to={{ pathname: '/home' , state: "Você não tem permissão para essa página"}}/>
                )
                : (
                    <Component {...props} />
                ))
              )
            } 
          />
}

const Routes = (): JSX.Element => {
    return (
      <Switch>
        <Route path="/" exact component={Login} />

        <PrivateRoute path="/eu" neededPermission="Configurações" exact component={Me} />

        <PrivateRoute path="/home" exact component={ConfigsHome} />
        <PrivateRoute path="/empresas" neededPermission="Configurações" exact component={Companys} />
        <PrivateRoute path="/usuarios" neededPermission="Usuários" exact component={Users} />
        <PrivateRoute path="/permissoes" neededPermission="Configurações" exact component={Roles} />

        {/* <PrivateRoute path="/empresas" component={Roles} /> */}
      </Switch>
    );
};
  
export default Routes;