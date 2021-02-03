import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecurlyProvider, Elements } from "@recurly/react-recurly";

ReactDOM.render(
  <React.StrictMode>
    <RecurlyProvider publicKey={process.env.REACT_APP_RECURLY_PUBLIC_KEY ?? ""}>
      <Elements>
        <App />
      </Elements>
    </RecurlyProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
