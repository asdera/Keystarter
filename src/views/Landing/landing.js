import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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
      <Button variant="contained" className={classes.button}>
        Investor
      </Button>
      <Button variant="contained" className={classes.button}>
        Project Creator
      </Button>
    </div>
  );
}
