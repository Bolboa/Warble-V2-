import React, { Component } from "react";
import { Link } from "react-router-dom"


class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>some</h2>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    );
  }
}

export default Home;