import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Project({ match }) {
    return <h3>Requested Param: {match.params.id}</h3>;
}

export default function Projects({ match }) {
    console.log(match)
    return (
      <div>
        <h2>Projects</h2>
  
        {/* <ul>
          <li>
            <Link to={`${match.url}/components`}>Components</Link>
          </li>
          <li>
            <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
          </li>
        </ul> */}
  
        <Route path={`${match.path}/:id`} component={Project} />
        <Route
          exact
          path={match.path}
          render={() => <h3>Please select a project.</h3>}
        />
      </div>
    );
}