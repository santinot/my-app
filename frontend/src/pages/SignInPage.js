import * as React from "react";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "./modules/components/Typography";
import AppFooter from "./modules/views/AppFooter";
import AppAppBar from "./modules/views/AppAppBar";
import AppForm from "./modules/views/AppForm";
import withRoot from "./modules/withRoot";


function SignIn() {
  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Accedi
          </Typography>
          <Stack spacing={2} alignItems="center">
            <Button
              size="large"
              component="label"
              variant="outlined"
              startIcon=<img
                src="/google.png"
                alt="Google"
                width={30}
                height={30}
              />
            >
              Accedi con Google
            </Button>
            <Button
              size="large"
              component="label"
              variant="outlined"
              startIcon=<img
                src="/whatsapp.png"
                alt="Whatsapp"
                width={35}
                height={35}
              />
            >
              Accedi con Whatsapp
            </Button>
          </Stack>
        </React.Fragment>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);
