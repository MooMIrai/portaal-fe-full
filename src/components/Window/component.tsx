import React from "react";
import {
  DialogActionsBar,
  Window,
  WindowProps,
} from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";

interface CustomWindowProps extends WindowProps {
  show: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
  callToAction?: string;
  draggable?: boolean;
  resizable?: boolean;
  showModalFooter: boolean;
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
  initialWidth,
  showModalFooter,
  onSubmit,
  callToAction,
}: CustomWindowProps) => {
  return show ? (
    <Window
      width={width}
      height={height}
      doubleClickStageChange={false}
      modal={true}
      style={{
        height:'fit-content',
      }}
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
      {showModalFooter && (
        <DialogActionsBar>
          <Button onClick={onClose}>Cancel</Button>
          <Button themeColor={"primary"} onClick={onSubmit}>
            {callToAction}
          </Button>
        </DialogActionsBar>
      )}
    </Window>
  ) : null;
};

export default CustomWindow;
