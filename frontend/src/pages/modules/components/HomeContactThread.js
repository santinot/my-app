import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeMessage from "./HomeMessage";
import HomeContactCard from "./HomeContactCard";

export default function HomeContactThread(props) {
  const { threads } = props;
  const first = threads.values[0];
  return (
    <Accordion sx={{ bgcolor: "#FAF7FF" }}>
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
            <AccordionDetails key={innerMessage.id} sx={{ pt: 0, pb: 0 }}>
              <HomeMessage
                key={innerMessage.id}
                message={innerMessage}
                splitBtn="true"
              />
            </AccordionDetails>
          ));
        }
        return (
          <AccordionDetails key={message.id} sx={{ pt: 0, pb: 0 }}>
            <HomeMessage key={message.id} message={message} splitBtn="true"/>
          </AccordionDetails>
        );
      })}
    </Accordion>
  );
}
