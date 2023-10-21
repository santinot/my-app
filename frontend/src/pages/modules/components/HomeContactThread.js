import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
//import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeMessage from "./HomeMessage";
import HomeContactCard from "./HomeContactCard";

export default function HomeContactThread(props) {
  const { threads } = props;
  const first = threads.values[0];
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <HomeContactCard key={first.id} message={first} label={threads.label} />
      </AccordionSummary>
      {threads.values.map((message) => {
        if (Array.isArray(message)) {
          return message.map((innerMessage) => (
            <AccordionDetails key={innerMessage.id}>
              <HomeMessage key={innerMessage.id} message={innerMessage} />
            </AccordionDetails>
          ));
        }
        return (
          <AccordionDetails key={message.id}>
            <HomeMessage key={message.id} message={message} />
          </AccordionDetails>
        );
      })}
    </Accordion>
  );
}
