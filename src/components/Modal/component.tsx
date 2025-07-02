import React, { ReactNode } from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";

interface ModalProps {
  isOpen: boolean;
  title: string;
  callToAction: string;
  showModalFooter: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  children?: ReactNode;
  width?:number | string;
  height?:number | string;
  noClose?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  callToAction,
  showModalFooter,
  width,
  height,
  noClose
}) => (
  <>
    {isOpen && (
      <Dialog
        title={title}
        onClose={onClose}
        width={width || 500}
        height={height || 500}
        modal={true}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        themeColor="primary"
        
        contentStyle={{ marginBottom: 30 }}
      >
        {children}
        {showModalFooter && (
          <DialogActionsBar>
            {!noClose ? <Button onClick={onClose}>Cancel</Button> : null}
            <Button themeColor={"primary"} onClick={onSubmit}>
              {callToAction}
            </Button>
          </DialogActionsBar>
        )}
      </Dialog>
    )}
  </>
);

export default Modal;
