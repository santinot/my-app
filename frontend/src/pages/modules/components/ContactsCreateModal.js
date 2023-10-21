import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ContactsAdd from "./ContactsAdd";

export default function ContactsCreateModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        size="large"
        onClick={handleOpen}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Crea Nuovo Contatto
        </Typography>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <ContactsAdd />
        </>
      </Modal>
    </div>
  );
}
