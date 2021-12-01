import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';

import Login from './pages/Login';
import Me from './pages/Me';
import ConfigsHome from './pages/configs/';
import Companys from './pages/configs/Companys';
import Users from './pages/configs/Users';
import Roles from './pages/configs/Roles';
import { isAuthenticated } from './services/auth';
import { getInitialPage, HasPermission, useProfile } from './hooks/useProfile';
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
import NewQuotaSale from './pages/Quotas/Stock/NewQuotaSale';
import Sales from './pages/Quotas/Sales';
import EditQuotaSale from './pages/Quotas/Sales/EditQuotaSale';
import QuotasReport from './pages/Quotas/Reports';
import Commercial from './pages/Commercial';
import { Logs } from './pages/Commercial/Logs';
import Sellers from './pages/Commercial/Sellers';
import Leads from './pages/Commercial/Leads';
import Schedules from './pages/Commercial/Schedules';
import SimpleReport from './pages/Financial/Reports/SimpleReport';

interface PrivateRouteProps extends RouteProps{
  component: any;
  neededPermission?: string;
}

const PrivateRoute = ({component: Component, neededPermission = "", ...rest} : PrivateRouteProps) => {
  const { permissions } = useProfile();

  const initialPage = getInitialPage(permissions);

  return <Route {...rest} render={props => (
                !isAuthenticated() ? (
                    <Redirect to={{ pathname: '/' , state: "Por favor, acesse sua conta."}}/>
                    
                ) : ( neededPermission !== "" && !HasPermission(permissions, neededPermission) ? (
                        <Redirect to={{ pathname: initialPage , state: "Você não tem permissão para essa página"}}/>
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

        <PrivateRoute path="/home" exact neededPermission="" component={ConfigsHome} />
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
        <PrivateRoute path="/reports" neededPermission="Financeiro Completo" exact component={SimpleReport} />

        <PrivateRoute path="/contempladas" neededPermission="" exact component={Quotas} />

        <PrivateRoute path="/venda-contempladas" neededPermission="Contempladas" exact component={Sales} />
        <PrivateRoute path="/cadastrar-venda/:quota" neededPermission="Contempladas" exact component={NewQuotaSale} />
        <PrivateRoute path="/editar-venda/:quota/:quotaSale" neededPermission="Contempladas" exact component={EditQuotaSale} />
        <PrivateRoute path="/relatorio-contempladas" neededPermission="Contempladas" exact component={QuotasReport} />

        <PrivateRoute path="/comercial" neededPermission="Vendas Limitado" exact component={Commercial} />
        <PrivateRoute path="/vendedores" neededPermission="Vendas Completo" exact component={Sellers} />
        <PrivateRoute path="/historico/:user" neededPermission="Vendas Completo" exact component={Logs} />
        <PrivateRoute path="/leads" neededPermission="Vendas Limitado" exact component={Leads} />
        <PrivateRoute path="/meusleads" neededPermission="Vendas Limitado" exact component={Leads} />
        <PrivateRoute path="/agenda" neededPermission="Vendas Limitado" exact component={Schedules} />

        {/* <PrivateRoute path="/empresas" component={Roles} /> */}
      </Switch>
    );
};
  
export default Routes;