import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

export default function Landing() {
  const classes = useStyles();

  return (
    <div>
      <h1>
        <b>I'm a</b>
      </h1>
      <Link to="/donate">
        <Button variant="contained" className={classes.button}>
          Investor
        </Button>
      </Link>
      <Link to="/create">
        <Button variant="contained" className={classes.button}>
          Project Creator
        </Button>
      </Link>
    </div>
  );
}
