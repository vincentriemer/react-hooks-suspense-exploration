import "./Spinner.css";
import React from "react";

export const Spinner = props => (
  <div
    role="alert"
    aria-live="assertive"
    className="la-ball-scale-multiple la-dark la-2x"
  >
    <div />
    <div />
    <div />
    <p className="spinner-copy">Loading...</p>
  </div>
);
