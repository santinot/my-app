import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import ContactsPage from "./pages/ContactsPage";
import GmailPage from "./pages/GmailPage";
import WhatsappPage from "./pages/WhatsappPage";
import SettingsPage from "./pages/SettingsPage";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");


const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInPage socket={socket} />,
  },
  {
    path: "/home",
    element: <HomePage socket={socket}/>,
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
    path: "*",
    element: <h1 align="center">Error 404, Page Not Found</h1>,
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <RouterProvider router={router} />
);
