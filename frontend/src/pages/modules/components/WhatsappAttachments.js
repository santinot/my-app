import * as React from "react";
import Chip from "@mui/material/Chip";
import AttachFile from "@mui/icons-material/AttachFile";
import Stack from "@mui/material/Stack";
let messageId = 0;

const handleClick = (name, data) => () => {
//   fetch("http://localhost:3001/api/whatsapp/download/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       name: name,
//       data: data,
//     }),
//   }).then((response) => {
//     alert("File " + name + " downloaded");
//     response.json().then((data) => {
//       console.log(data);
//     });
//   });
console.log("click");
};

export default function WhatsappAttachements(props) {
  const { attachments } = props;
  if (Array.isArray(attachments) && attachments.length > 0) {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ marginLeft: 2, marginBottom: 1 }}
      >
        {attachments.map((attachment) => (
          <Chip
            key={messageId++}
            icon={<AttachFile />}
            label={attachment.mimetype + "-" + attachment.name}
            id={attachment.data}
            variant="outlined"
            clickable
            onClick={handleClick(attachment.name, attachment.data)}
          />
        ))}
      </Stack>
    );
  } else {
    return null;
  }
}
