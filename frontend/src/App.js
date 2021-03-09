import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";

import { Category } from "./Category";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <ul className="nav-ul">
            <li className="nav-li">
              <NavLink to="/categories/gloves" activeClassName="nav-li-active">
                Gloves
              </NavLink>
            </li>
            <li className="nav-li">
              <NavLink
                to="/categories/facemasks"
                activeClassName="nav-li-active"
              >
                Face masks
              </NavLink>
            </li>
            <li className="nav-li">
              <NavLink to="/categories/beanies" activeClassName="nav-li-active">
                Beanies
              </NavLink>
            </li>
          </ul>
        </header>
        <Switch>
          <Route exact path="/">
            <Redirect to="/categories/gloves"></Redirect>
          </Route>
          <Route path="/categories/:categoryId" children={<Category />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
