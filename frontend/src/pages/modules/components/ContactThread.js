import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
//import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Message from "./Message";
import Contact from "./Contact";

export default function ContactThread(props) {
  const { threads } = props;
  const first = threads.values[0];
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Contact key={first.id} message={first} label={threads.label} />
      </AccordionSummary>
      {threads.values.map((message) => (
        <AccordionDetails key={message.id}>
          <Message key={message.id} message={message} />
        </AccordionDetails>
      ))}
    </Accordion>
  );
}
