import React from "react";
import "./App.css";
import Landing from "../Landing/landing";
import Header from "../Header/header";
import Projects from "../Projects/projects";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function App() {
  return (
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={Landing} />
        <Route path="/create" component={Create} />
        <Route path="/donate" component={Projects} />
      </div>
    </Router>
  );
}

function Create() {
  return <h2>Create</h2>;
}

export default App;