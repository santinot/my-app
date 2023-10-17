import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
//import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Message from "./Message";

export default function Thread(props) {
  const { threads } = props;
  const first = threads.shift();
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Message key={first.id} message={first} />
      </AccordionSummary>
      {threads.map((message) => (
        <AccordionDetails key={message.id}>
          <Message key={message.id} message={message} />
        </AccordionDetails>
      ))}
    </Accordion>
  );
}
