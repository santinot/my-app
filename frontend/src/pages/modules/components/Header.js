import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Badge } from "@mui/material";

const color = "#0068AD";

function Header(props) {
const { label } = props;
  return (
    <React.Fragment>
      <AppBar sx={{bgcolor:color}} position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
          <Grid item xs />
            <Typography color="inherit" variant="h5" component="h1" >
              {label}
            </Typography>
            <Grid item xs />
            <Grid item>
              <Tooltip title="Nuovi Messaggi">
                <IconButton color="inherit" size="small">
                  Notifiche
                  <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Header;
