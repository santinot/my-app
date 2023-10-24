import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Grid, Avatar, CardHeader } from "@mui/material";
import { validationEmail } from "../form/validation";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 620,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function GmailSend(props) {
  const { info } = props;
  const id = info.id;
  const type = info.type;

  const [to, setTo] = React.useState(info.title);
  const [subject, setSubject] = React.useState(info.subheader);
  const [body, setBody] = React.useState(info.body);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "to":
        setTo(value);
        break;
      case "subject":
        setSubject(value);
        break;
      case "body":
        setBody(value);
        break;
      default:
        break;
    }
  };

  const sendEmail = () => {
    //TODO
  };

  return (
    <Card sx={style}>
      <CardHeader
        sx={{ bgcolor: "#009be5", height: "30px" }}
        title={
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            Scrivi una nuova Email
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* <Grid item xs={3} align="center">
            <Avatar
              src="/img/form.png"
              variant="square"
              sx={{ width: 56, height: 56 }}
            />
          </Grid> */}
          <Grid item xs={6}>
            <TextField
              name="to"
              label="Indirizzo Destinatario"
              type="search"
              variant="filled"
              value={(info.title).match(/<(.*?)>/)?.[1] || ""}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="subject"
              label="Oggetto dell'email"
              type="search"
              variant="filled"
              value={"Re: " + info.subheader}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="body"
              label="Corpo dell'email"
              type="search"
              variant="filled"
              placeholder="Scrivi qui..."
              multiline
              rows={15}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              key={"updateContact"}
              size="large"
              variant="contained"
              sx={{ mt: -1 }}
              onClick={sendEmail}
            >
              Invia
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
