import {
  Switch,
  Route,
  Redirect,
  RouteProps,
  useParams,
  BrowserRouter,
  useHistory
} from 'react-router-dom'

import Login from './pages/Login'
import Me from './pages/Me'
import ConfigsHome from './pages/configs/'
import Companys from './pages/configs/Companys'
import Users from './pages/configs/Users'
import Roles from './pages/configs/Roles'
import { getInitialPage, HasPermission, useProfile } from './hooks/useProfile'
import Financial from './pages/Financial'
import Payments from './pages/Financial/Payments'
import PaymentCategories from './pages/Financial/PaymentCategories'
import Providers from './pages/Financial/Providers'
import CashFlow from './pages/Financial/CashFlow'
import Bills from './pages/Financial/Bills'
import BillCategories from './pages/Financial/BillCategories'
import Sources from './pages/Financial/Sources'
import Reports from './pages/Financial/Reports'
import CashDesks from './pages/Financial/CashDesks'
import CashDeskCategories from './pages/Financial/CashDesksCategories'
import Invoices from './pages/Financial/Invoices'
import Quotas from './pages/Quotas/Stock'
import NewQuotaSale from './pages/Quotas/Stock/NewQuotaSale'
import Sales from './pages/Quotas/Sales'
import EditQuotaSale from './pages/Quotas/Sales/EditQuotaSale'
import QuotasReport from './pages/Quotas/Reports'
import Commercial from './pages/Commercial'
import { Logs } from './pages/Commercial/Logs'
import Sellers from './pages/Commercial/Sellers'
import Leads from './pages/Commercial/Leads'
import Schedules from './pages/Commercial/Schedules'
import SimpleReport from './pages/Financial/Reports/SimpleReport'
import Teams from './pages/Commercial/Teams'
import CompanyPage from './pages/configs/Companys/CompanyPage'
import Branch from './pages/configs/Branch/'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Flex, Spinner, Text } from '@chakra-ui/react'
import { useTenant } from './hooks/useTenant'
import { Tenant } from './types'
import Commissions from './pages/Commissions'
import CommissionsSalesman from './pages/Commissions/CommissionsSalesman'
import Company from './pages/Commissions/Company'
import ReportsCommissions from './pages/Commissions/Reports'
import Contracts from './pages/Commissions/Contracts'
import Customers from './pages/Commercial/Customers'
import Start from './pages/Start'
import { api } from './services/api'
import { ContractLogs } from './pages/Commissions/Contracts/ContractLogs'
import { isAuthenticated } from './services/auth'
import RecoverPasswordEmail from './pages/RecoverPasswordEmail'
import RecoverPassword from './pages/RecoverPassword'

interface PrivateRouteProps extends RouteProps {
  component: any
  neededPermission?: string
}

const PrivateRoute = ({
  component: Component,
  neededPermission = '',
  ...rest
}: PrivateRouteProps) => {
    const history = useHistory();
    const { permissions } = useProfile();
    const [isFirstSteps, setIsFirstSteps] = useState<boolean>(localStorage.getItem('@lance/firstSteps') === '1' ? false : true);

    const initialPage = getInitialPage(permissions);

    const checkFirstSteps = async () => {

        api.get('/configs').then(response => {
            if(response.data.data.initiated){
                localStorage.setItem('@lance/firstSteps', JSON.stringify(1));
                setIsFirstSteps(false);

                if(rest.path === "/primeiros-passos"){
                history.push(initialPage);
                }
            }else{
                setIsFirstSteps(true);

                if(rest.path !== "/primeiros-passos"){
                history.push('/primeiros-passos');
                }
            }
        });

        //console.log(response);

        //localStorage.setItem('@lance/firstSteps', JSON.stringify(1));
        //localStorage.getItem('@lance/firstSteps');

        // if(isFirstSteps && rest.path !== "/primeiros-passos"){
        //   console.log('redirecionar para start');
        //   //history.push('/primeiros-passos');
        // }else if(!isFirstSteps && rest.path === "/primeiros-passos"){
        //   console.log('redirecionar para pagina');
        //   //history.push(initialPage);
        // }
    }

  //console.log(localStorage.getItem('@lance/firstSteps') === null);  

  // if(localStorage.getItem('@lance/firstSteps') === null){
  //   checkFirstSteps();
  // }else{
  //   console.log('redirecionar para pagina');
  //   //history.push(initialPage);
  // }

    useEffect(() => {}, [permissions]);

    useEffect(() => {
        if(localStorage.getItem('@lance/firstSteps') === null){
            checkFirstSteps();
        }else{
            if(rest.path === "/primeiros-passos"){
                history.push(initialPage);
            }
        }
    }, [isFirstSteps]);

    if(!isAuthenticated()){
        return ( 
            <Route {...rest} render={props => 
                <Redirect
                    to={{ pathname: `/`, state: 'Sessão expirada.' }}
                />
            }/>
        )
    }

    if(permissions){
        return (
            <Route
                {...rest}
                render={props =>
                    neededPermission !== '' && !HasPermission(permissions, neededPermission) ? (
                        <Redirect
                            to={{
                            pathname: `${initialPage}`,
                            state: 'Você não tem permissão para essa página'
                            }}
                        />
                    ) : rest.path === '/' ? (
                        <Redirect to={{ pathname: `${initialPage}`}}/>
                    ) : (
                        <Component {...props} />
                    )
                }
            />
        )
    }

    return <Route {...rest} render={props => 
        <Flex w="100%" h="100vh" alignItems={"center"} justifyContent="center">
            <Spinner />
        </Flex>
    }/>
}

const TenantRoutes = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/:tenant/" component={Routes} />
    </Switch>
  )
}

const Routes = (): JSX.Element => {
  const params: { tenant: string } = useParams()
  const tenantOptions = useTenant()

  const [tenant, setTenant] = useState<Tenant>()
  const [loadingTenant, setLoadingTenant] = useState(true)

  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? `${process.env.REACT_APP_API_URL}system/`
      : `${process.env.REACT_APP_API_LOCAL_URL}system/`
  const getTenant = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}check_tenant/${params.tenant}`)

      setTenant(data)
      setLoadingTenant(false)
    } catch (error: any) {
      setLoadingTenant(false)
    }
  }

  useEffect(() => {
    tenantOptions.handleSetPrefix(params.tenant)
    getTenant()
  }, [])

  return loadingTenant ? (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <Spinner />
    </Flex>
  ) : tenant && Object.keys(tenant).length ? (
    <BrowserRouter basename={`/${params.tenant}`}>
      <Switch>
        {/* <Route path={`/${params.tenant}`}>
            <Route path={`/`} exact component={Login} />
          </Route> */}
        <Route path={`/`} exact component={Login} />

        <PrivateRoute path={`/eu`} exact component={Me} />

        <PrivateRoute path={`/primeiros-passos`} exact component={Start} />

        <Route path={`/recuperar-senha-email`} exact component={RecoverPasswordEmail} />

        <Route path={`/recuperar-senha/:email/:token`} exact component={RecoverPassword} />

        <PrivateRoute
          path={`/home`}
          exact
          neededPermission=""
          component={ConfigsHome}
        />
        <PrivateRoute
          path={`/empresas`}
          neededPermission="Configurações"
          exact
          component={Companys}
        />
        <PrivateRoute
          path={`/empresas/:id`}
          neededPermission="Configurações"
          exact
          component={CompanyPage}
        />
        <PrivateRoute
          path={`/usuarios`}
          neededPermission="Usuários"
          exact
          component={Users}
        />
        <PrivateRoute
          path={`/permissoes`}
          neededPermission="Configurações"
          exact
          component={Roles}
        />
        <PrivateRoute
          path={`/filiais/:id`}
          neededPermission="Configurações"
          exact
          component={Branch}
        />

        <PrivateRoute
          path={`/financeiro`}
          neededPermission="Financeiro Limitado"
          exact
          component={Financial}
        />
        <PrivateRoute
          path={`/pagamentos`}
          neededPermission="Financeiro Limitado"
          exact
          component={Payments}
        />
        <PrivateRoute
          path={`/pagamentos/categorias`}
          neededPermission="Financeiro Limitado"
          exact
          component={PaymentCategories}
        />
        <PrivateRoute
          path={`/pagamentos/notas`}
          neededPermission="Financeiro Limitado"
          exact
          component={Invoices}
        />
        <PrivateRoute
          path={`/pagamentos/fornecedores`}
          neededPermission="Financeiro Limitado"
          exact
          component={Providers}
        />
        <PrivateRoute
          path={`/receber`}
          neededPermission="Financeiro Completo"
          exact
          component={Bills}
        />
        <PrivateRoute
          path={`/receber/categorias`}
          neededPermission="Financeiro Completo"
          exact
          component={BillCategories}
        />
        <PrivateRoute
          path={`/receber/fontes`}
          neededPermission="Financeiro Completo"
          exact
          component={Sources}
        />
        <PrivateRoute
          path={`/fluxo`}
          neededPermission="Financeiro Completo"
          exact
          component={CashFlow}
        />
        <PrivateRoute
          path={`/caixa`}
          neededPermission="Financeiro Completo"
          exact
          component={CashDesks}
        />
        <PrivateRoute
          path={`/caixa/categorias`}
          neededPermission="Financeiro Completo"
          exact
          component={CashDeskCategories}
        />
        <PrivateRoute
          path={`/relatorios`}
          neededPermission="Financeiro Completo"
          exact
          component={Reports}
        />
        <PrivateRoute
          path={`/reports`}
          neededPermission="Financeiro Completo"
          exact
          component={SimpleReport}
        />

        <PrivateRoute
          path={`/contempladas`}
          neededPermission=""
          exact
          component={Quotas}
        />

        <PrivateRoute
          path={`/venda-contempladas`}
          neededPermission="Contempladas"
          exact
          component={Sales}
        />
        <PrivateRoute
          path={`/cadastrar-venda/:quota`}
          neededPermission="Contempladas"
          exact
          component={NewQuotaSale}
        />
        <PrivateRoute
          path={`/editar-venda/:quota/:quotaSale`}
          neededPermission="Contempladas"
          exact
          component={EditQuotaSale}
        />
        <PrivateRoute
          path={`/relatorio-contempladas`}
          neededPermission="Contempladas"
          exact
          component={QuotasReport}
        />

        <PrivateRoute
          path={`/comercial`}
          neededPermission="Comercial Limitado"
          exact
          component={Commercial}
        />
        <PrivateRoute
          path={`/vendedores`}
          neededPermission="Comercial Completo"
          exact
          component={Sellers}
        />
        <PrivateRoute
          path={`/historico/:user`}
          neededPermission="Comercial Completo"
          exact
          component={Logs}
        />
        <PrivateRoute
          path={`/leads`}
          neededPermission="Comercial Limitado"
          exact
          component={Leads}
        />
        <PrivateRoute
          path={`/meusleads`}
          neededPermission="Comercial Limitado"
          exact
          component={Leads}
        />
        <PrivateRoute
          path={`/agenda`}
          neededPermission="Comercial Limitado"
          exact
          component={Schedules}
        />
        <PrivateRoute
          path={`/clientes`}
          neededPermission="Comercial Limitado"
          exact
          component={Customers}
        />
        {/* <PrivateRoute
          path={`/team`}
          neededPermission="Comercial Completo"
          exact
          component={Teams}
        /> */}
        <PrivateRoute
          path={`/team`}
          neededPermission="Comercial Completo"
          exact
          component={Sellers}
        />

        <PrivateRoute path={`/comissões`} neededPermission="Comissões Vendedor" exact component={Commissions} />
        <PrivateRoute path={`/comissões-vendedores`} neededPermission="Comissões Vendedor" exact component={CommissionsSalesman} />
        <PrivateRoute path={`/comissões-empresa`} neededPermission="Comissões Completo" exact component={Company} />
        <PrivateRoute path={`/contratos`} neededPermission="Comissões Vendedor" exact component={Contracts} />
        <PrivateRoute path={`/relatorio-comissões`} neededPermission="Comissões Completo" exact component={ReportsCommissions} />

        <PrivateRoute path={`/contracts/logs`} neededPermission="Comissões Completo" exact component={ContractLogs}/>

        {/* <PrivateRoute path="/empresas" component={Roles} /> */}
      </Switch>
    </BrowserRouter>
  ) : !loadingTenant && !tenant ? (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <Text>Ambiente não encontrado</Text>
    </Flex>
  ) : (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <Text>Ambiente não encontrado</Text>
    </Flex>
  )
}

export default TenantRoutes;
