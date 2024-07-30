import React from "react";
import { Window, WindowProps } from "@progress/kendo-react-dialogs";

interface CustomWindowProps extends WindowProps {
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
  width,
  height,
}: CustomWindowProps) => {
  return show ? (
    <Window
      width={width}
      height={height}
      doubleClickStageChange={false}
      modal={true}
      title={title}
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
