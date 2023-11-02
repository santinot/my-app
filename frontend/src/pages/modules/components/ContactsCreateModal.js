import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ContactsAdd from "./ContactsAdd";

export default function ContactsCreateModal(props) {
  const { contacts, user } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        key={"showAddContact"}
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
          <ContactsAdd contacts={contacts} user={user} />
        </>
      </Modal>
    </div>
  );
}
