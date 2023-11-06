import * as React from "react";
import {
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  Typography,
  Grid,
  Box,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Cookies from "js-cookie";
let uniquekey = 0;

export default function SettingsContent(props) {
  const { user } = props;
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    fetch("http://localhost:3001/api/user/get/" + user, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setUsername(data[0].username);
      });
    });
  }, [user]);

  const updateUser = () => {
    if (username === "" || password === "") {
      return alert("Riempire tutti i campi per effettuare la modifica");
    }
    fetch("http://localhost:3001/api/user/modify", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user,
        username: username,
        password: password,
      }),
    }).then((response) => {
      response.status === 200
        ? window.location.reload()
        : alert("Errore nella modifica del contatto, riprova");
    });
  };

  const deleteUser = () => {
    if (
      window.confirm("Sei sicuro di voler eliminare il tuo account?") === true
    ) {
      fetch("http://localhost:3001/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            Cookies.remove("user");
            window.location.href = "/";
          } else {
            alert("Errore nella cancellazione dell'account, riprova.");
          }
        })
        .catch((error) => {
          console.error("Errore nella richiesta:", error);
          alert("Si è verificato un errore durante la richiesta.");
        });
    }
  };

  const logoutUser = () => {
    if (
      window.confirm("Sei sicuro di voler disconnettere il tuo account?") ===
      true
    ) {
      fetch("http://localhost:3001/api/user/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            Cookies.remove("user");
            window.location.href = "/";
          } else {
            alert("Errore nella disconnessione dell'account, riprova.");
          }
        })
        .catch((error) => {
          console.error("Errore nella richiesta:", error);
          alert("Si è verificato un errore durante la richiesta.");
        });
    }
  };

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
            Elenco Impostazioni
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} sx={{ width: "90%", mt: 2, mb: 2 }}>
          <Grid item xs={3} align="center">
            <Avatar
              src="/img/personal-information.png"
              variant="square"
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="username"
              label="Nome Utente"
              type="search"
              variant="filled"
              value={username}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="password"
              label="Password Utente"
              type="search"
              variant="filled"
              placeholder="********"
              value={password}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={1}>
            <Button
              key={uniquekey++}
              size="large"
              variant="contained"
              sx={{ mt: -1, top: "30%" }}
              onClick={updateUser}
            >
              Modifica
            </Button>
          </Grid>
          <Grid item xs={6} align="center" sx={{ mt: 4 }}>
            <Button
              key={uniquekey++}
              size="large"
              variant="contained"
              color="error"
              sx={{ mt: -1 }}
              onClick={deleteUser}
            >
              ELIMINA ACCOUNT
            </Button>
          </Grid>
          <Grid item xs={6} align="center" sx={{ mt: 4 }}>
            <Button
              key={uniquekey++}
              size="large"
              variant="contained"
              color="error"
              sx={{ mt: -1 }}
              onClick={logoutUser}
            >
              DISCONNETTI ACCOUNT
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
