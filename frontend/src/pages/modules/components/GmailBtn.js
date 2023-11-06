import * as React from "react";
import { Button, Typography, Modal } from "@mui/material";
import GmailSend from "./GmailSend";
import { red } from "@mui/material/colors";

export default function GmailBtn(props) {
  const { info } = props;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{ bgcolor: red[800], ml: 1 }}
        size="small"
        onClick={handleOpen}
      >
        <Typography display="block">
          Rispondi con <strong>Gmail</strong>
        </Typography>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <GmailSend info={info} closeModal={handleClose} />
        </>
      </Modal>
    </div>
  );
}
