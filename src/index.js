import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import MarkerWithLabel from "@google/markerwithlabel";

window.MarkerWithLabel = MarkerWithLabel;

ReactDOM.render(<App />, document.getElementById("root"));
