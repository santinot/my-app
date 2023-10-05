import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { red } from "@mui/material/colors";
import * as React from "react";
import Typography from "./Typography";


function Message(props) {
    const { title, subheader, body, key } = props;
  return (
    <Card sx={{ textAlign: "left" }} key={key}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
            SM
          </Avatar>
        }
        title= {title}
        subheader= {subheader}
      />
      <Stack direction="row" spacing={1} sx={{marginLeft: 2}}>
        <Chip icon={<FaceIcon />} label="With Icon" />
        <Chip icon={<FaceIcon />} label="With Icon" variant="outlined" />
      </Stack>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Message;
