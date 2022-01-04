import { Switch, Route, Redirect } from "react-router-dom";
import Home from "../views/home";
import SignUp from "../views/signup";
import Login from "../views/login";
import ForDaycares from "../views/daycare";
import ForParents from "../views/parents";
import KidSpaceApp from "../views-app/kidSpaceApp";
import ErrorPage from "../views/error";
import { useContext } from "react";
import { TokenContext } from "./context";
import KidData from "../views-app/data";
import Graph from "../views-app/graph";
import AccountSettings from "../views-app/accountSettings";

export default function Switches() {
  const [token] = useContext(TokenContext);

  return (
    <Switch>
      <Route exact path="/">
        {token ? <Redirect to="/app" /> : <Home />}
      </Route>
      <Route exact path="/signup">
        {token ? <Redirect to="/app" /> : <SignUp />}
      </Route>
      <Route exact path="/login">
        {token ? <Redirect to="/app" /> : <Login />}
      </Route>
      <Route exact path="/for-parents">
        {token ? <Redirect to="/app" /> : <ForParents />}
      </Route>
      <Route exact path="/for-daycares">
        {token ? <Redirect to="/app" /> : <ForDaycares />}
      </Route>
      <Route exact path="/app">
        {token ? <KidSpaceApp /> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/app/:kidID">
        {token ? <KidData /> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/app/:kidID/graph">
        {token ? <Graph /> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/app/:userID/edit">
        {token ? <AccountSettings /> : <Redirect to="/login" />}
      </Route>
      <Route component={ErrorPage} />
    </Switch>
  );
}
