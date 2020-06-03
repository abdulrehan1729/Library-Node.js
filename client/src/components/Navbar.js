import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "../App.css";
import axios from "axios";
import jwt_decode from "jwt-decode";

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      redirectTo: null,
    };
    this.logout = this.logout.bind(this);
  }

  logout(event) {
    event.preventDefault();
    axios
      .post("/user/logout", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.props.updateUser({
            loggedIn: false,
            user: null,
          });
        }
      })
      .catch((error) => {
        console.log("Logout error");
      });
  }

  render() {
    const loggedIn = this.props.loggedIn;
    let token = localStorage.getItem("jwt");
    let role = "";
    if (token) {
      role = jwt_decode(token).role;
    }

    if (loggedIn) {
      return (
        <div>
          <header className="navbar App-header" id="nav-container">
            <div className="col-4">
              <section className="navbar-section">
                <Link to="/books" className="btn btn-link text-secondary">
                  <span className="text-secondary">Books</span>
                </Link>
                {role === "admin" ? (
                  <Link to="/requests" className="btn btn-link text-secondary">
                    <span className="text-secondary">Requests</span>
                  </Link>
                ) : (
                  <Link
                    to="/user-history"
                    className="btn btn-link text-secondary"
                  >
                    <span className="text-secondary">History</span>
                  </Link>
                )}
                <Link
                  style={{ float: "right" }}
                  to="#"
                  className="btn btn-link text-secondary"
                  onClick={this.logout}
                >
                  <span className="text-secondary">logout</span>
                </Link>
              </section>
            </div>
          </header>
          <Redirect to="/books" />
        </div>
      );
    } else {
      return (
        <div>
          <header className="navbar App-header" id="nav-container">
            <h1>Library</h1>
          </header>
          <Redirect to="/" />
        </div>
      );
    }
  }
}

export default Navbar;
