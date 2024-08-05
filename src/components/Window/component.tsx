import React from "react";
import { Window, WindowProps } from "@progress/kendo-react-dialogs";

interface CustomWindowProps extends WindowProps {
  show: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
  callToAction: string;
  draggable?:boolean;
  resizable?:boolean
}

const CustomWindow = ({
  show,
  title,
  onClose,
  children,
  width,
  height,
  draggable,
  resizable,
  minHeight,
  minWidth,
  initialHeight,
  initialWidth

}: CustomWindowProps) => {
  return show ? (
    <Window
      width={width}
      height={height}
      doubleClickStageChange={false}
      modal={true}
      minHeight={minHeight}
      minWidth={minWidth}
      title={title}
      initialHeight={initialHeight}
      initialWidth={initialWidth}
      onClose={onClose}
      draggable={draggable}
      minimizeButton={() => <div></div>}
      maximizeButton={() => <div></div>}
      resizable={resizable}
    >
      {children}
    </Window>
  ) : null;
};

export default CustomWindow;
