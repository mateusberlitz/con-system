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
import Providers from './pages/Financial/Providers';
import CashFlow from './pages/Financial/CashFlow';
import Bills from './pages/Financial/Bills';
import BillCategories from './pages/Financial/BillCategories';
import Sources from './pages/Financial/Sources';
import Reports from './pages/Financial/Reports';
import CashDesks from './pages/Financial/CashDesks';
import CashDeskCategories from './pages/Financial/CashDesksCategories';
import Invoices from './pages/Financial/Invoices';
import Quotas from './pages/Quotas/Stock';

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
                      HasPermission(permissions, "Financeiro Limitado") || HasPermission(permissions, "Financeiro Completo") ?
                        <Redirect to={{ pathname: '/financeiro' , state: "Você não tem permissão para essa página"}}/>

                        : <Redirect to={{ pathname: '/home' , state: "Você não tem permissão para essa página"}}/>
                      )
                      : (
                          <Component {...props} />
                        )
                    )
              )
            } 
          />
}

const Routes = (): JSX.Element => {
    return (
      <Switch>
        <Route path="/" exact component={Login} />

        <Route path="/eu" exact component={Me} />

        <PrivateRoute path="/home" exact neededPermission="Configurações" component={ConfigsHome} />
        <PrivateRoute path="/empresas" neededPermission="Configurações" exact component={Companys} />
        <PrivateRoute path="/usuarios" neededPermission="Usuários" exact component={Users} />
        <PrivateRoute path="/permissoes" neededPermission="Configurações" exact component={Roles} />

        <PrivateRoute path="/financeiro" neededPermission="Financeiro Limitado" exact component={Financial} />
        <PrivateRoute path="/pagamentos" neededPermission="Financeiro Limitado" exact component={Payments} />
        <PrivateRoute path="/pagamentos/categorias" neededPermission="Financeiro Limitado" exact component={PaymentCategories} />
        <PrivateRoute path="/pagamentos/notas" neededPermission="Financeiro Limitado" exact component={Invoices} />
        <PrivateRoute path="/pagamentos/fornecedores" neededPermission="Financeiro Limitado" exact component={Providers} />
        <PrivateRoute path="/receber" neededPermission="Financeiro Completo" exact component={Bills} />
        <PrivateRoute path="/receber/categorias" neededPermission="Financeiro Completo" exact component={BillCategories} />
        <PrivateRoute path="/receber/fontes" neededPermission="Financeiro Completo" exact component={Sources} />
        <PrivateRoute path="/fluxo" neededPermission="Financeiro Completo" exact component={CashFlow} />
        <PrivateRoute path="/caixa" neededPermission="Financeiro Completo" exact component={CashDesks} />
        <PrivateRoute path="/caixa/categorias" neededPermission="Financeiro Completo" exact component={CashDeskCategories} />
        <PrivateRoute path="/relatorios" neededPermission="Financeiro Completo" exact component={Reports} />

        <PrivateRoute path="/contempladas" neededPermission="" exact component={Quotas} />

        {/* <PrivateRoute path="/empresas" component={Roles} /> */}
      </Switch>
    );
};
  
export default Routes;