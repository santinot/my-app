import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ContactsInfoBox from "./ContactsInfoBox";
import ContactsCreateModal from "./ContactsCreateModal";
let uniquekey = 0;

export default function ContactsContent(props) {
  const { user } = props;
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/api/contact/getContacts/" + user, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setContacts(data);
      });
    });
  }, [user]);

  return (
    <Paper sx={{ margin: "auto", overflow: "hidden", maxWidth: "1400px" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Elenco Contatti
          </Typography>
          <ContactsCreateModal contacts={contacts} user={user} />
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {contacts.length === 0 ? (
            <Box sx={{ width: "100%", mt: 1 }}>
              {showProgress ? (
                <LinearProgress sx={{ height: "10px", marginTop: "10px" }} />
              ) : (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Alert
                    severity="info"
                    sx={{ marginTop: "20px", width: "30%", textAlign: "left" }}
                  >
                    <AlertTitle>
                      <strong>Nessun Contatto Presente in Rubrica</strong>
                    </AlertTitle>
                    Aggiungi un contatto per iniziare
                  </Alert>
                </div>
              )}
            </Box>
          ) : (
            contacts.map((contact) => (
              <Grid item key={uniquekey++}>
                <ContactsInfoBox key={contact._id} info={contact} user={user} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Paper>
  );
}
