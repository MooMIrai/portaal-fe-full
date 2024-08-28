import { Card, CardBody, CardHeader } from "@progress/kendo-react-layout";
import React from "react";

type CustomCardProps = {
  header: {
    element: JSX.Element;
    class: string;
  };
  body: {
    element: JSX.Element;
    class: string;
  };
  container: {
    class: string;
  };
};

export default function CustomCard(props: CustomCardProps) {
  return (
    <Card className={props.container.class}>
      {props.header && (
        <CardHeader className={props.header.class}>
          {props.header.element}
        </CardHeader>
      )}
      {props.body && (
        <CardBody className={props.body.class}>{props.body.element}</CardBody>
      )}
    </Card>
  );
}
