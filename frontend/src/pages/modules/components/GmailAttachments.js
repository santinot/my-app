import * as React from "react";
import { Chip, Stack } from "@mui/material";
import AttachFile from "@mui/icons-material/AttachFile";

export default function GmailAttachments(props) {
  const handleClick = (messageId, id, title) => () => {
    fetch(
      "http://localhost:3001/api/email/me/getAttachment/" +
        messageId +
        "/" +
        id +
        "/" +
        title,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      alert("File " + title + " downloaded");
      response.json().then((data) => {
        console.log(data);
      });
    });
  };

  const { attachments, messageId } = props;
  if (Array.isArray(attachments) && attachments.length > 0) {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ marginLeft: 2, marginBottom: 1 }}
      >
        {attachments.map((attachment) => (
          <Chip
            key={attachment.id}
            icon={<AttachFile />}
            label={attachment.title}
            id={attachment.id}
            variant="outlined"
            clickable
            onClick={handleClick(messageId, attachment.id, attachment.title)}
          />
        ))}
      </Stack>
    );
  } else {
    return null;
  }
}
