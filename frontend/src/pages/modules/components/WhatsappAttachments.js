import * as React from "react";
import { Chip, Stack } from "@mui/material";
import AttachFile from "@mui/icons-material/AttachFile";
let uniquekey = 0;

export default function WhatsappAttachements(props) {
  const { attachments, fromMe } = props;

  const handleClick = (attachment) => () => {
    fetch("http://localhost:3001/api/whatsapp/downloadMedia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attachment: attachment,
      }),
    }).then((response) => {
      response.status === 200
        ? alert("Media scaricato con successo")
        : alert("Errore, riprova!");
    });
  };

  if (Array.isArray(attachments) && attachments.length > 0) {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ marginLeft: 2, marginBottom: 1, alignSelf: `${fromMe ? "flex-end" : "flex-start"}`, }}
      >
        {attachments.map((attachment) => (
          <Chip
            key={uniquekey++}
            icon={<AttachFile />}
            label={attachment.mimetype + "-" + attachment.name}
            variant="outlined"
            clickable
            sx={{
              alignSelf: `${fromMe ? "flex-end" : "flex-start"}`,
            }}
            onClick={handleClick(attachment)}
          />
        ))}
      </Stack>
    );
  } else {
    return null;
  }
}
