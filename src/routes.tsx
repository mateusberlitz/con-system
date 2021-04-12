import { Switch, Route } from 'react-router-dom';

import Login from './pages/Login';

const Routes = (): JSX.Element => {
    return (
      <Switch>
        <Route path="/" exact component={Login} />
      </Switch>
    );
};
  
export default Routes;