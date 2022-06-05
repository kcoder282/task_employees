import { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/antd.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./Static";

export const User = createContext();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
);
