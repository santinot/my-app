import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
//import App from "./App";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import ContactsPage from "./pages/ContactsPage";
import GmailPage from "./pages/GmailPage";
import WhatsappPage from "./pages/WhatsappPage";
import SettingsPage from "./pages/SettingsPage";
import LogoutPage from "./pages/LogoutPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInPage />,
  },
  // {
  //   path: "/sign-in",
  //   element: <SignInPage />,
  // },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/contacts",
    element: <ContactsPage />,
  },
  {
    path: "/gmail",
    element: <GmailPage />,
  },
  {
    path: "/whatsapp",
    element: <WhatsappPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    path: "*",
    element: <h1 align="center">Error 404, Page Not Found</h1>,
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <RouterProvider router={router} />
);
