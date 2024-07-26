import React from "react";
import { Window } from "@progress/kendo-react-dialogs";

interface CustomWindowProps {
  show: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomWindow = ({
  show,
  title,
  onClose,
  children,
}: CustomWindowProps) => {
  return show ? (
    <Window
      doubleClickStageChange={false}
      modal={true}
      title={title}
      initialHeight={350}
      onClose={onClose}
      draggable={false}
      minimizeButton={() => <div></div>}
      maximizeButton={() => <div></div>}
      resizable={false}
    >
      {children}
    </Window>
  ) : null;
};

export default CustomWindow;
