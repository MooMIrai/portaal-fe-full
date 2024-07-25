import { DrawerItemType } from "../components/Drawer/component";
export interface IDrawerEvent {
    list: DrawerItemType[];
    isOpen: string;
}
export declare enum DRAWER_EVENT_TYPE {
    ADD_ITEMS = "ADD_ITEMS"
}
export declare const DrawerEventService: {
    fire: (event: DRAWER_EVENT_TYPE, body?: CustomEventInit<IDrawerEvent>) => void;
    subscribe: (event: DRAWER_EVENT_TYPE, listener: EventListener) => void;
    unsubscribe: (event: DRAWER_EVENT_TYPE, listener: EventListener) => void;
};
