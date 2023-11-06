import * as React from "react";
import { AppBar, Grid, Toolbar, Typography } from "@mui/material";

const color = "#0068AD";

function Header(props) {
  const { label } = props;
  return (
    <React.Fragment>
      <AppBar sx={{ bgcolor: color }} position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs />
            <Typography color="inherit" variant="h5" component="h1">
              {label}
            </Typography>
            <Grid item xs />
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Header;
