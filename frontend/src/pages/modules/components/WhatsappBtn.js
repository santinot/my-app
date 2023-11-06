import * as React from "react";
import { Button, Typography, Modal } from "@mui/material";
import { green } from "@mui/material/colors";
import WhatsappSend from "./WhatsappSend";

export default function WhatsappBtn(props) {
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
        sx={{ bgcolor: green[600] }}
        size="small"
        onClick={handleOpen}
      >
        <Typography display="block">
          Rispondi con <strong>WhatsApp</strong>
        </Typography>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <WhatsappSend chatId={info.id} closeModal={handleClose} />
        </>
      </Modal>
    </div>
  );
}
