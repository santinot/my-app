import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
//import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Badge } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const lightColor = "rgba(255, 255, 255, 0.7)";

function Header(props) {

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
          <Grid item xs />
            <Typography color="inherit" variant="h5" component="h1">
              <HomeIcon /> Home Page
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

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
