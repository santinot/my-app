import * as React from "react";
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
  Stack,
  Pagination,
} from "@mui/material";
import HomeMessage from "./HomeMessage";
import MenuIcon from "@mui/icons-material/Menu";
let uniquekey = 0;

export default function GmailContent() {
  const [showProgress, setShowProgress] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [emails, setEmails] = React.useState([]);
  const [pageTokens, setPageTokens] = React.useState([]);

  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    fetch("http://localhost:3001/api/email/me/pageTokenList/inbox", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setPageTokens(data);
      });
    });
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(false);
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  React.useEffect(() => {
    if (pageTokens.length === 0) {
      setEmails([]);
      return;
    }
    fetch(
      "http://localhost:3001/api/email/me/getEmails/inbox/" +
        pageTokens[page - 1 < 0 ? undefined : page - 1],
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      response.json().then((data) => {
        setEmails(data);
      });
    });
  }, [pageTokens, page]);
  console.log(emails);

  return (
    <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
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
            Elenco Email
          </Typography>
        </Toolbar>
      </AppBar>
      {emails.length > 0 && (
        <Stack justifyContent="center" alignItems="center" height="5vh">
          <Pagination
            count={pageTokens.length - 2}
            variant="outlined"
            shape="rounded"
            page={page}
            onChange={handleChangePage}
          />
        </Stack>
      )}
      {emails.length === 0 ? (
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
                  <strong>Nessuna Email Ricevuta</strong>
                </AlertTitle>
              </Alert>
            </div>
          )}
        </Box>
      ) : (
        emails.map((email) => (
          <Grid item key={uniquekey++}>
            <HomeMessage key={uniquekey++} message={email} />
          </Grid>
        ))
      )}
      {emails.length > 0 && (
        <Stack justifyContent="center" alignItems="center" height="5vh">
          <Pagination
            count={pageTokens.length - 2}
            variant="outlined"
            shape="rounded"
            page={page}
            onChange={handleChangePage}
          />
        </Stack>
      )}
    </Paper>
  );
}
