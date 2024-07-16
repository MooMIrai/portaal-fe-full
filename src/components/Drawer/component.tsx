// DrawerContainer.tsx
import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerItem,
  DrawerItemProps,
  DrawerProps,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import {
  menuIcon,
  chevronDownIcon,
  chevronRightIcon,
} from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import { Routes, Route } from "react-router-dom";
import styles from "./styles.module.scss";

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

const CustomItem = (props: DrawerItemType) => {
  const { visible, parentId, ...others } = props;
  const arrowDir = props.dataExpanded ? chevronDownIcon : chevronRightIcon;
  const isParent = props.dataExpanded !== undefined;
  const isChild = parentId !== undefined;
  return props.visible === false ? null : (
    <DrawerItem {...others} className={isChild && styles.isChildItem}>
      {props.svgIcon && <SvgIcon icon={props.svgIcon} size="small" />}
      {props.icon && <span className={props.icon}></span>}
      <span className={"k-item-text"}>{props.text}</span>
      {isParent && <SvgIcon icon={arrowDir} style={{ marginLeft: "auto" }} />}
    </DrawerItem>
  );
};

const DrawerContainer: React.FC<DrawerContainerProps> = (
  props: DrawerContainerProps
) => {
  const data = props.items.map((item) => {
    const { parentId, ...others } = item;
    if (parentId !== undefined) {
      const parentEl = props.items.find((parent) => parent.id === parentId);
      return {
        ...others,
        parentId: parentId,
        visible: parentEl && parentEl.dataExpanded,
      };
    }
    return item;
  });

  return (
    <div>
      <div className="custom-toolbar">
        {props.titleLogo && (
          <div className={styles.parentButtonHamburgerLogo}>
            <span className="title">{props.titleLogo}</span>
            <div className={styles.buttonHamburgerLogo}>
              <Button
                svgIcon={menuIcon}
                fillMode={props.fillMode ?? "flat"}
                onClick={props.handleClick}
              />
            </div>
          </div>
        )}
        {props.titleString && (
          <div className={styles.parentButtonHamburgerText}>
            <Button
              svgIcon={menuIcon}
              fillMode={props.fillMode ?? "flat"}
              onClick={props.handleClick}
            />
            <span className="title">{props.titleString}</span>
          </div>
        )}
      </div>
      <Drawer
        expanded={props.expanded}
        mode={props.mode}
        width={props.width}
        miniWidth={props.miniWidth}
        mini={props.mini}
        animation={props.animation}
        items={data}
        item={(props) => <CustomItem {...(props as DrawerItemType)} />}
        position={props.position}
        onSelect={props.onSelect}
        className={props.className}
        onOverlayClick={props.onOverlayClick}
        style={props.style}
        dir={props.dir}
        tabIndex={props.tabIndex}
        ref={props.ref}
        key={props.key}
      >
        <DrawerContent>
          <Routes>
            {props.items.map((item) => (
              <Route
                key={item.route}
                path={item.route}
                element={item.element}
              />
            ))}
          </Routes>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DrawerContainer;
