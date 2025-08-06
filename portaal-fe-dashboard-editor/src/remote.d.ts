declare module "common/Theme" {
  const Theme: React.FC<{ children: React.ReactNode }>;
  export default Theme;
}

declare module "common/Routes" {
  interface RouteData {
    path: string;
    element: React.ReactNode;
    permissions?: string[];
  }
  const Routes: React.FC<{ data: RouteData[] }>;
  export default Routes;
}

declare module "common/Button" {
  export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    className?: string;
  }
  const Button: React.FC<ButtonProps>;
  export default Button;
}

declare module "common/Form" {
  export interface FormProps {
    fields: any[];
    onSubmit: (data: any) => void;
    initialValues?: any;
  }
  const Form: React.FC<FormProps>;
  export default Form;
}

declare module "common/Table" {
  const Table: React.FC<any>;
  export default Table;
}

declare module "common/Modal" {
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
  }
  const Modal: React.FC<ModalProps>;
  export default Modal;
}

declare module "common/Loader" {
  const Loader: React.FC;
  export default Loader;
}

declare module "dashboard/components/widgets/*" {
  const Component: React.FC<any>;
  export default Component;
}