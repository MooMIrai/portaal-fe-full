import * as React from "react";
import { DrawerHandle, DrawerItemProps, DrawerProps } from "@progress/kendo-react-layout";
export interface DrawerItemType extends DrawerItemProps {
    text: string;
    route?: string;
    id: number;
    parentId?: number;
    dataExpanded?: boolean;
    size?: string;
    element: React.ReactNode;
}
interface DrawerContainerProps extends DrawerProps {
    items: Array<DrawerItemType>;
    titleString?: string;
    titleLogo?: any;
    handleClick?: () => void;
    fillMode: "link" | "solid" | "outline" | "flat" | "clear" | null | undefined;
    key?: React.Key | null;
    ref?: React.LegacyRef<DrawerHandle | null>;
}
declare const DrawerContainer: React.FC<DrawerContainerProps>;
export default DrawerContainer;
