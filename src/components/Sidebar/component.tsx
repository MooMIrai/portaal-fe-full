import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerItem,
  DrawerItemProps,
  DrawerSelectEvent,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import {
  menuIcon,
  chevronDownIcon,
  chevronRightIcon,
} from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import styles from "./style.module.scss";

interface SidebarPros {
  items: DrawerItemProps[];
  children: React.ReactNode;
}

const CustomItem = (props: DrawerItemProps) => {
  const { visible, ...others } = props;
  const arrowDir = props.dataExpanded ? chevronDownIcon : chevronRightIcon;
  return props.visible === false ? null : (
    <DrawerItem {...others}>
      <SvgIcon icon={props.svgIcon} />
      <span className={"k-item-text"}>{props.text}</span>
      {props.dataExpanded !== undefined && (
        <SvgIcon
          icon={arrowDir}
          style={{
            marginLeft: "auto",
          }}
        />
      )}
    </DrawerItem>
  );
};

const Sidebar = ({ children, items }: SidebarPros) => {
  const navigate = useNavigate();
  const [drawerExpanded, setDrawerExpanded] = React.useState(true);
  const [list, setList] = useState<any[]>([]);

  const updateItems = (list: any[]): DrawerItemProps[] => {
    return list.map((item, index) => {
      const hasChild = list.some((el) => el.parentId === item.id);
      const newItem = { ...item, selected: index === 0 };

      if (hasChild) {
        newItem.dataExpanded = false;
      } else {
        delete newItem.dataExpanded;
      }

      return newItem;
    });
  };

  useEffect(() => {
    if (items) {
      setList(updateItems(items));
    }
  }, [items]);

  const handleClick = () => {
    setDrawerExpanded(!drawerExpanded);
  };

  const onSelect = (ev: DrawerSelectEvent) => {
    const currentItem = ev.itemTarget.props;
    const isParent = currentItem.dataExpanded !== undefined;
    const nextExpanded = !currentItem.dataExpanded;
    const newData = list.map((item) => {
      const { selected, dataExpanded: currentExpanded, id, ...others } = item;
      const isCurrentItem = currentItem.id === id;
      return {
        selected: isCurrentItem,
        dataExpanded:
          isCurrentItem && isParent ? nextExpanded : currentExpanded,
        id,
        ...others,
      };
    });
    navigate(ev.itemTarget.props.route);
    setList(newData);
  };

  const data = list.map((item: any) => {
    const { parentId, ...others } = item;
    if (parentId !== undefined) {
      const parentEl = list.find((parent) => {
        return parent.id === parentId;
      });
      return {
        ...others,
        visible: parentEl?.dataExpanded,
      };
    }
    return item;
  });

  return (
    <div className={styles.sidebarContainer}>
      <div className="custom-toolbar">
        <div className={styles.parentButtonHamburgerText}>
          <img
            width={150}
            height={30}
            src="/image/logoTaal.png"
            alt="Logo Taal"
          />
          <Button svgIcon={menuIcon} fillMode={"flat"} onClick={handleClick} />
          <span className="title">{""}</span>
        </div>
      </div>
      <Drawer
        expanded={drawerExpanded}
        mode="push"
        items={data}
        item={CustomItem}
        onSelect={onSelect}
        mini={true}
      >
        <DrawerContent>{children}</DrawerContent>
      </Drawer>
    </div>
  );
};

export default Sidebar;
