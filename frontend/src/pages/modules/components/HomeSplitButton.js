import * as React from "react";
import {
  Button,
  ButtonGroup,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Typography,
  Modal,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import GmailSend from "./GmailSend";
import WhatsappSend from "./WhatsappSend";

const options = ["Gmail", "WhatsApp"];

export default function HomeSplitButton(props) {
  const { info } = props;

  const [openModalGmail, setopenModalGmail] = React.useState(false);
  const handleopenModalGmail = () => setopenModalGmail(true);
  const handlecloseModalGmail = () => setopenModalGmail(false);

  const [openModalWhatsapp, setopenModalWhatsapp] = React.useState(false);
  const handleopenModalWhatsapp = () => setopenModalWhatsapp(true);
  const handlecloseModalWhatsapp = () => setopenModalWhatsapp(false);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(
    info.type === "gmail" ? 0 : 1
  );

  const handleClick = () => {
    if (options[selectedIndex] === "Gmail") {
      console.info(`You clicked ${options[selectedIndex]}`);
      handleopenModalGmail();
    } else if (options[selectedIndex] === "WhatsApp") {
      handleopenModalWhatsapp();
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button onClick={handleClick}>
          <Typography display="block">
            Rispondi con <strong>{options[selectedIndex]}</strong>
          </Typography>
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      Rispondi con {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Modal
        open={openModalGmail}
        onClose={handlecloseModalGmail}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <GmailSend info={info} closeModal={handlecloseModalGmail} />
        </>
      </Modal>
      <Modal
        open={openModalWhatsapp}
        onClose={handlecloseModalWhatsapp}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <WhatsappSend
            chatId={info.id}
            closeModal={handlecloseModalWhatsapp}
          />
        </>
      </Modal>
    </React.Fragment>
  );
}
