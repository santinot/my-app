import React from "react";
import { Button, Avatar } from "@mui/material";

export default function ContactDeleteBtn(props) {
  const { id } = props;
  const deleteContact = () => {
    if (window.confirm("Sei sicuro di voler eliminare il contatto?")) {
      fetch("http://localhost:3001/api/contact/deleteContact/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((response) => {
            response.status === 200 ? window.location.reload() : alert("Errore nell'inserimento del contatto, riprova");
        })
        .catch((error) => {
          console.error("Errore nella richiesta:", error);
        });
    }
  };

  return (
    <Button
      sx={{ marginTop: "50px", marginLeft: "20px" }}
      onClick={deleteContact}
    >
      <Avatar alt="Elimina Contatto" src="img/garbage.png" />
    </Button>
  );
}
