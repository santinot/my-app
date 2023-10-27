import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeMessage from "./HomeMessage";

export default function HomeThread(props) {
  const { threads } = props;
  const first = threads.shift();
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        // disabled = "true"
      >
        <HomeMessage key={first.id} message={first} />
      </AccordionSummary>
      {threads.map((message) => (
        <AccordionDetails key={message.id}>
          <HomeMessage key={message.id} message={message} />
        </AccordionDetails>
      ))}
    </Accordion>
  );
}
