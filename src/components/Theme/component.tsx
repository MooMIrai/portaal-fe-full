import React, { PropsWithChildren } from "react";
import "@progress/kendo-theme-bootstrap/dist/all.css";
import "./theme.css"

export default function Theme(props: PropsWithChildren<any>) {
  return props.children;
}
