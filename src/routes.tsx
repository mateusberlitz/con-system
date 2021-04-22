import { Switch, Route, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';

import Login from './pages/Login';
import ConfigsHome from './pages/configs/';
import Companys from './pages/configs/Companys';
import Users from './pages/configs/Users';
import Roles from './pages/configs/Roles';
import { isAuthenticated } from './services/auth';
import { ComponentType, ReactComponentElement, ReactElement, ReactNode, ReactInstance } from 'react';

interface PrivateRouteProps extends RouteProps{
  component: any;
}

const PrivateRoute = ({component: Component, ...rest} : PrivateRouteProps) => (
  <Route {...rest} render={props => (

        isAuthenticated() ? (
              <Component {...props} />
        ) : (
              <Redirect to={{ pathname: '/home' }}/>
        )
      )
    } 
  />
)

const Routes = (): JSX.Element => {
    return (
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/home" exact component={ConfigsHome} />
        <Route path="/empresas" exact component={Companys} />
        <Route path="/usuarios" exact component={Users} />
        <Route path="/permissoes" exact component={Roles} />

        {/* <PrivateRoute path="/empresas" component={Roles} /> */}
      </Switch>
    );
};
  
export default Routes;