import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ContactsIcon from "@mui/icons-material/Contacts";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: "Pannello di Controllo",
    children: [
      {
        id: "Home Page",
        icon: <HomeIcon />,
        ref: "/home",
      },
      { id: "Rubrica", icon: <ContactsIcon />, ref: "/contacts" },
      { id: "Gmail", icon: <MailOutlineIcon />, ref: "/gmail" },
      { id: "Whatsapp", icon: <WhatsAppIcon /> , ref: "/whatsapp"},
    ],
  },
  {
    id: "Pannello di Servizio",
    children: [
      { id: "Impostazioni", icon: <SettingsIcon />, ref: "/settings" },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { ...other } = props;
  const [label, setLabel] = React.useState(useLocation().pathname);
  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          MessageHub
          <Avatar
            alt="MessageHub"
            src="img/network.png"
            sx={{ width: 56, height: 56, margin: 1 }}
          />
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3}}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, ref }) => (
              <ListItem disablePadding key={childId}>
              <Link to={ref} style={{ textDecoration: 'none' }}>
                <ListItemButton selected={label === ref ? true : false} sx={item} onClick={() => (setLabel(ref))}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </Link>
              </ListItem>
            ))}
            <Divider sx={{ mt: 3 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
