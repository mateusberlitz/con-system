import { Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import ConfigsHome from './pages/configs/';

const Routes = (): JSX.Element => {
    return (
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/home" exact component={ConfigsHome} />
      </Switch>
    );
};
  
export default Routes;