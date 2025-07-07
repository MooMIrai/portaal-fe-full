import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar,
  Drawer,
  DrawerContent,
  DrawerItem,
  DrawerItemProps,
  DrawerSelectEvent,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import {
  chevronDownIcon,
  chevronRightIcon,
  logoutIcon,
  userIcon
} from "@progress/kendo-svg-icons";
import { SVGIcon, SvgIcon, Typography } from "@progress/kendo-react-common";
import styles from "./style.module.scss";
import * as svgIcons from "@progress/kendo-svg-icons";
import AuthService from "../../services/AuthService";
import withAutocomplete from "../../hoc/AutoComplete";
import { Popover } from '@progress/kendo-react-tooltip';
import { ThemeSwitcher } from "../ThemeSwitcher/component";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
import AvatarIcon from "../AvatarIcon/component";

interface SidebarPros {
  items: DrawerItemProps[];
  children: React.ReactNode;
}

interface CustomItemProps extends DrawerItemProps {
  iconKey?: string;
}

const CustomItem = (props: CustomItemProps) => {
  const { visible, parentId, iconKey, svgIcon, ...others } = props;
  const arrowDir = props.dataExpanded ? chevronDownIcon : chevronRightIcon;
  const resolvedIcon: SVGIcon | undefined = svgIcon
    ? svgIcon
    : iconKey
      ? (svgIcons as any)[iconKey]
      : undefined;

  const itemStyle = parentId ? { marginLeft: "2rem" } : {};

  return props.visible === false ? null : 
    <DrawerItem {...others} style={itemStyle}>
      {resolvedIcon && <SvgIcon icon={resolvedIcon} />}
      <BadgeContainer style={{ display: "flex" }}>
        <span className={"k-item-text"}>{props.text}</span>
        {props.badge ? <Badge themeColor={'error'}>{props.badge}</Badge> : null}
      </BadgeContainer>

      {props.dataExpanded !== undefined && (
        <SvgIcon
          icon={arrowDir}
          style={{
            marginLeft: "auto",
          }}
        />
      )}
    </DrawerItem>
  ;
};

const TenantsSelector = withAutocomplete((filter: string) =>
  AuthService.getTenants(filter)
);

const Sidebar = ({ children, items }: SidebarPros) => {
  const [badgeList, setBadgeList] = useState<Record<number, number>>({});
  const navigate = useNavigate();
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [tenants, setTenants] = useState<any[]>([]);

  // Stati per la selezione e l'espansione
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [popoverUser, setPopoverUser] = useState<boolean>(false);

  const updateItems = (list: any[]): DrawerItemProps[] => {
    return list.map((item, index) => {
      const hasChild = list.some((el) => el.parentId === item.id);

      let selectedItemIdC= selectedItemId;
      if(!selectedItemId){
        const calculatedItem = list.find(i=>i.route===location.pathname);
        if(calculatedItem)
          selectedItemIdC=calculatedItem.id;
      }
      const selected = item.id===selectedItemIdC;

      const newItem = { ...item, selected:selected  };

      // Gestire l'espansione
      if (hasChild) {
        newItem.dataExpanded = expandedItems[item.id] ?? false;
      } else {
        delete newItem.dataExpanded;
      }

      if (badgeList[item.id]) {
        newItem.badge = badgeList[item.id];
      }

      return newItem;
    });
  };

  useEffect(() => {
    AuthService.getTenants("").then((tenantsData) => {
      setTenants(tenantsData);

      const savedTenant = sessionStorage.getItem("tenant");

      if (savedTenant) {
        const foundTenant = tenantsData.find(
          (tenant) => tenant.name === savedTenant
        );
        if (foundTenant) {
          setSelectedTenant(foundTenant);
        }
      }

      if (!savedTenant && tenantsData.length > 0) {
        const defaultTenant = tenantsData[0];
        setSelectedTenant(defaultTenant);
        sessionStorage.setItem("tenant", defaultTenant.name);
      }
    });

    const setBadge = (e: any) => {
      if (e.detail) {
        setBadgeList((prev) => ({
          ...prev, 
          [e.detail.id]: e.detail.value
        }));
      }
    };
    window.addEventListener('AddBadgeMenu', setBadge);
    return () => window.removeEventListener('AddBadgeMenu', setBadge);
  }, []);

  useEffect(() => {
    if (items) {
      setList(updateItems(items));
    }
  }, [items, badgeList, expandedItems, selectedItemId]);



  const onSelect = (ev: DrawerSelectEvent) => {
    const currentItem = ev.itemTarget.props;
    const isParent = currentItem.dataExpanded !== undefined;
    const nextExpanded = !currentItem.dataExpanded;

    // Mantenere la selezione dell'elemento
    setSelectedItemId(currentItem.id);

    // Gestire l'espansione
    setExpandedItems((prev) => ({
      ...prev,
      [currentItem.id]: nextExpanded, // Cambia solo l'elemento selezionato
    }));

    const newData = list.map((item) => {
      const { selected, dataExpanded: currentExpanded, id, ...others } = item;
      const isCurrentItem = currentItem.id === id;

      return {
        selected: isCurrentItem,
        dataExpanded: isCurrentItem && isParent ? nextExpanded : currentExpanded,
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
        parentId,
        visible: parentEl?.dataExpanded,
      };
    }
    return item;
  });

  const handleTenantChange = (event: any) => {
    const newTenant = event.target.value;
    if (newTenant) {
      setSelectedTenant(newTenant);
      sessionStorage.setItem("tenant", newTenant.name);
      window.location.reload();
    }
  };

  const logout = () => {
    AuthService.logout();
    window.location.href = '/';
  };

  const anchor = useRef<any>();

  return <div className={styles.page}><AppBar themeColor="light" className={styles.navbar}>
    <AppBarSection className="title">
        <div className="k-drawer-logo"><img
          width={120}
          style={{marginLeft:30}}
          src="/image/logoNexa.png"
          alt="Logo Taal"
        />
        </div>
    </AppBarSection>
    <AppBarSpacer />
      <AppBarSection style={{paddingRight: "20px"}}>
      <Button ref={anchor} className={styles.btnAvatar} fillMode="solid" themeColor="light" onClick={() => setPopoverUser(!popoverUser)}>
            {AuthService.getFullName() && <AvatarIcon initials={AuthService.getFullName()[0].toUpperCase()} style={{ marginRight: 5 }} />}
            {AuthService.getUserName()}
            <a onClick={(e) => {
              e.stopPropagation();
              navigate("/notifications/inbox");
            }}>
              <Badge themeColor={"error"} size={"large"} style={{fontSize: "11px"}}>{badgeList["12"]}</Badge>
            </a>
          </Button>
          <Popover
            show={popoverUser}
            anchor={anchor.current && anchor.current.element}
            position={'bottom'}
            callout={true}
            collision={{
              horizontal: 'fit',
              vertical: 'fit'
            }}
            title="Azioni per l'utente"
          >
            <div className={styles.popoverContainer}>
              <Button svgIcon={userIcon} fillMode={'clear'} themeColor="primary" onClick={() => navigate('/profile')}>Profilo</Button>
              <Button svgIcon={logoutIcon} fillMode={'clear'} themeColor="error" onClick={logout}>Logout</Button>
            </div>
          </Popover>
      </AppBarSection>
  </AppBar>
  <div className={styles.drawerContainer}>
  <Drawer
        expanded={drawerExpanded}
        mode="push"
        items={data.filter(d=>{
          return !d.permissions || !d.permissions.length || d.permissions.some(AuthService.hasPermission)
        })}
        className={styles.sideBarDrawer}
        item={CustomItem}
        onSelect={onSelect}
        mini={true}
        width={260}
      >
        <DrawerContent className={styles.drawerContent}>
          <div className={styles.titleContainer}>
            <Typography.h4 themeColor="primary">{location.pathname && location.pathname != '/' ? location.pathname.replace('/', '')[0].toUpperCase() + location.pathname.replace('/', '').substring(1) : 'Homepage'}</Typography.h4>
          </div>
          <div className="page-container">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
  </div>

  
  </div>

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.toolbarContainer + " custom-toolbar"}>
        <div className={styles.parentButtonHamburgerText}>
          <span className="title">{""}</span>
        </div>
        <div className={styles.buttonToolBar}>
          <div className={styles.autoComplete}>
            {tenants.length > 1 && (
              <TenantsSelector
                value={selectedTenant}
                onChange={handleTenantChange}
              />
            )}
          </div>

          <Button ref={anchor} fillMode="solid" themeColor="light" onClick={() => setPopoverUser(!popoverUser)}>
            {AuthService.getImage() && <Avatar rounded="full" type="image" style={{ marginRight: 5 }}>
              <img src={AuthService.getImage()} alt="user avatar" />
            </Avatar>}
            {
              AuthService.getUserName()
            }
          </Button>
          <Popover
            show={popoverUser}
            anchor={anchor.current && anchor.current.element}
            position={'bottom'}
            callout={true}
            collision={{
              horizontal: 'fit',
              vertical: 'fit'
            }}
            title="Azioni per l'utente"
          >
            <div className={styles.popoverContainer}>
              <Button svgIcon={userIcon} fillMode={'clear'} themeColor="primary" onClick={() => navigate('/profile')}>Profilo</Button>
              <Button svgIcon={logoutIcon} fillMode={'clear'} themeColor="error" onClick={logout}>Logout</Button>
            </div>
          </Popover>
          <ThemeSwitcher />
        </div>
      </div>

      <Drawer
        expanded={drawerExpanded}
        mode="push"
        items={data.filter(d=>{
          return !d.permissions || !d.permissions.length || d.permissions.some(AuthService.hasPermission)
        })}
        item={CustomItem}
        onSelect={onSelect}
        mini={true}
      >
        <DrawerContent className={styles.drawerContent}>
          <div className={styles.titleContainer}>
            <Typography.h4 themeColor="primary">{location.pathname && location.pathname != '/' ? location.pathname.replace('/', '')[0].toUpperCase() + location.pathname.replace('/', '').substring(1) : 'Homepage'}</Typography.h4>
          </div>
          <div className="page-container">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Sidebar;
