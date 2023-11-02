import React from "react";
import { Button, Avatar, Modal } from "@mui/material";
import ContactsPut from "./ContactsPut";

export default function ContactsPutModal(props) {
  const { info, user } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button>
        <Avatar
          title="Elimina Contatto"
          src="img/pencil.png"
          variant="square"
          onClick={handleOpen}
        />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <ContactsPut info={info} user={user} />
        </>
      </Modal>
    </>
  );
}
