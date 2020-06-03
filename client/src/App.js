import React, { Component } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import Books from "./components/Books";
import Requests from "./components/Requests";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import UserHistory from "./components/UserHistory";
class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: null,
    };

    this.updateUser = this.updateUser.bind(this);
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  render() {
    return (
      <div className="App">
        <Router>
          {" "}
          <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
          <Route
            exact
            path="/"
            render={() => <Login updateUser={this.updateUser} />}
          />
          <Route path="/books" render={() => <Books />} />
          {
            <Route
              path="/requests"
              render={() => <Requests loggedIn={this.state.loggedIn} />}
            />
          }
          <Route path="/user-history" render={() => <UserHistory />} />
        </Router>
      </div>
    );
  }
}
export default App;
