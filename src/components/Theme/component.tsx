import React, { PropsWithChildren } from "react";
import "@progress/kendo-theme-default/dist/all.css";

export default function Theme(props: PropsWithChildren<any>) {
  return props.children;
}
