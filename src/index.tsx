import ReactDOM from "react-dom";

// router
import { BrowserRouter as Router } from "react-router-dom";

// components
import App from "./App";

// styles
import "normalize.css"; // css reset
import "./global.css"; // global styling

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
