import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';

import Login from './pages/Login';
import Me from './pages/Me';
import ConfigsHome from './pages/configs/';
import Companys from './pages/configs/Companys';
import Users from './pages/configs/Users';
import Roles from './pages/configs/Roles';
import { isAuthenticated } from './services/auth';
import { HasPermission, useProfile } from './hooks/useProfile';
import Financial from './pages/Financial';
import Payments from './pages/Financial/Payments';
import PaymentCategories from './pages/Financial/PaymentCategories';

interface PrivateRouteProps extends RouteProps{
  component: any;
  neededPermission?: string;
}

const PrivateRoute = ({component: Component, neededPermission = "", ...rest} : PrivateRouteProps) => {
  const { permissions } = useProfile();

  return <Route {...rest} render={props => (
                !isAuthenticated() ? (
                    <Redirect to={{ pathname: '/' , state: "Por favor, acesse sua conta."}}/>
                    
                ) : ( neededPermission !== "" && !HasPermission(permissions, neededPermission) ? (
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

        <Route path="/eu" exact component={Me} />

        <PrivateRoute path="/home" exact component={ConfigsHome} />
        <PrivateRoute path="/empresas" neededPermission="Configurações" exact component={Companys} />
        <PrivateRoute path="/usuarios" neededPermission="Usuários" exact component={Users} />
        <PrivateRoute path="/permissoes" neededPermission="Configurações" exact component={Roles} />

        <PrivateRoute path="/financeiro" neededPermission="Financeiro Limitado" exact component={Financial} />
        <PrivateRoute path="/pagamentos" neededPermission="Financeiro Limitado" exact component={Payments} />
        <PrivateRoute path="/categorias" neededPermission="Financeiro Limitado" exact component={PaymentCategories} />

        {/* <PrivateRoute path="/empresas" component={Roles} /> */}
      </Switch>
    );
};
  
export default Routes;