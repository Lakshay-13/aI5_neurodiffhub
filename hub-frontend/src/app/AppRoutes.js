import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from "../components/Home";
import Docs from "../components/Docs";
import Error404 from '../components/Error/404';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Logout from '../components/auth/Logout';
import ResetPassword from '../components/auth/ResetPassword';
import Account from '../components/settings/Account';
import APIKeys from '../components/settings/APIKeys';
import Organizations from '../components/settings/Organizations';
import Profile from '../components/settings/Profile';
import Projects from '../components/settings/Projects';
import Solutions from '../components/Solutions'
import SolutionView from '../components/Solutions/SolutionView';
import EditSolution from '../components/Solutions/EditSolution';
import UserPage from '../components/UserPage';
import Equations from '../components/admin/Equations';
import FeaturedSolutions from '../components/admin/FeaturedSolutions';
import SolutionsDashboard from '../components/admin/SolutionsDashboard';
import Admins from '../components/admin/Admins';
import AdminEditSolution from '../components/admin/AdminEditSolution';
import UseCases from '../components/admin/UseCases';
import About from '../components/About'
import Privacy from '../components/Privacy'
import { useAuthContext } from "../services/AuthService";


const AppRouter = (props) => {

  console.log("================================== AppRouter ======================================");

  function AuthenticatedRoute({ component: Component, ...rest }) {
    // Get Auth Context
    const auth = useAuthContext();

    return (
      <Route
        {...rest}
        render={(props, location) =>
          auth.state.isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  return (
    <React.Fragment>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/solutions" exact component={Solutions} />
        <Route path="/solutions/:id" exact component={SolutionView} />
        <Route path="/user/:username" exact component={UserPage} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/login" exact component={Login} />
        <Route path="/reset_password" exact component={ResetPassword} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/docs/:page" exact component={Docs} />
        <Route path="/about" exact component={About} />
        <Route path="/privacy" exact component={Privacy} />
        <AuthenticatedRoute path="/settings/account" component={Account} />
        <AuthenticatedRoute path="/settings/profile" component={Profile} />
        <AuthenticatedRoute path="/settings/apikeys" component={APIKeys} />
        <AuthenticatedRoute path="/settings/organizations" component={Organizations} />
        <AuthenticatedRoute path="/settings/projects" component={Projects} />
        <AuthenticatedRoute path="/admin/equations" component={Equations} />
        <AuthenticatedRoute path="/admin/featuredsolutions" component={FeaturedSolutions} />
        <AuthenticatedRoute path="/admin/solutionsdashboard" component={SolutionsDashboard} />
        <AuthenticatedRoute path="/admin/usecases" component={UseCases} />
        <AuthenticatedRoute path="/admin/admins" component={Admins} />
        <AuthenticatedRoute path="/admin/solutions/edit/:id" component={AdminEditSolution} />
        {/* <AuthenticatedRoute path="/solutions/edit/:id" component={EditSolution} /> */}
        <Route component={Error404} />
      </Switch>
    </React.Fragment>
  );
}

export default AppRouter;