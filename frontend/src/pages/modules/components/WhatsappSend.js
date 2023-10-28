import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Grid,
  CardHeader,
  Alert,
  Snackbar,
  Box,
  Stack,
  LinearProgress,
} from "@mui/material";
import WhatsappAttachements from "./WhatsappAttachments";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function WhatsappSend(props) {
  const { chatId, closeModal } = props;
  const [body, setBody] = React.useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/whatsapp/singleChat/" + chatId + "/5", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setMessages(data);
        console.log(data);
      });
    });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "body":
        setBody(value);
        break;
      default:
        break;
    }
  };

  const sendMessage = () => {
    if (body !== "") {
      fetch("http://localhost:3001/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          content: body,
        }),
      })
        .then((response) => {
          response.status === 200
            ? handleClick()
            : alert("Errore nell'invio del messaggio, riprova");
        })
        .catch((error) => {
          console.error("Errore nella richiesta:", error);
        });
    } else {
      return alert("Corpo del messaggio vuoto");
    }
  };

  //Snackbar
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    closeModal();
  };

  return (
    <Card sx={style}>
      <CardHeader
        sx={{ bgcolor: "#009be5", height: "30px" }}
        title={
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            Scrivi un nuovo Messaggio
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box borderRadius={1} border={1} borderColor="#009BE5">
              <Stack sx={{ px: 2, mt: 1, mb: 1 }} spacing={2}>
                {messages.length === 0 ? (
                  <Box sx={{ width: "100%", mt: 1 }}>
                    <LinearProgress sx={{ height: "10px" }} />
                  </Box>
                ) : (
                  messages.map((message) => {
                    if (message.attachment !== null) {
                      return (
                        <WhatsappAttachements attachments={message.attachment} key={message.id}/>
                      );
                    } else {
                      return (
                        <TextField
                          key={message.id}
                          defaultValue={message.snippet}
                          variant="outlined"
                          multiline
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            alignSelf: `${
                              message.fromMe ? "flex-end" : "flex-start"
                            }`,
                            bgcolor: `${
                              message.fromMe ? "#6B95BC" : "#E0E0E0"
                            }`,
                            color: `${message.fromMe ? "white" : "black"}`,
                            width: "70%",
                            maxHeight: "100px",
                            overflow: "auto",
                            borderRadius: "5px",
                          }}
                        />
                      );
                    }
                  })
                )}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="body"
              label="Corpo del messaggio"
              type="search"
              variant="filled"
              placeholder="Scrivi qui..."
              multiline
              rows={3}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              key={"key"}
              size="large"
              variant="contained"
              sx={{ mt: -1 }}
              onClick={sendMessage}
            >
              Invia
            </Button>
          </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Messaggio Inviato Correttamente!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
