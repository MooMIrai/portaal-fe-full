import React, { useEffect, useRef } from "react";
import { mount } from "lookups/LookUpsIndex";
import { lookUpsRoutingPrefix } from "../routing/constants";
import { useLocation, useNavigate } from "react-router-dom";

const lookUpsBasename = `/${lookUpsRoutingPrefix}`;

export default () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen to navigation events dispatched inside lookups mfe.
  useEffect(() => {
    const lookUpsNavigationEventHandler = (event: Event) => {
      const pathname = (event as CustomEvent<string>).detail;
      const newPathname = `${lookUpsBasename}${pathname}`;
      if (newPathname === location.pathname) {
        return;
      }
      navigate(newPathname);
    };
    window.addEventListener(
      "[lookups] navigated",
      lookUpsNavigationEventHandler
    );

    return () => {
      window.removeEventListener(
        "[lookups] navigated",
        lookUpsNavigationEventHandler
      );
    };
  }, [location]);

  // Listen for core location changes and dispatch a notification.
  useEffect(() => {
    if (location.pathname.startsWith(lookUpsBasename)) {
      window.dispatchEvent(
        new CustomEvent("[core] navigated", {
          detail: location.pathname.replace(lookUpsBasename, ""),
        })
      );
    }
  }, [location]);

  const isFirstRunRef = useRef(true);
  const unmountRef = useRef(() => {});
  
  // Mount MFE
  useEffect(() => {
    if (!isFirstRunRef.current) {
      return;
    }
    unmountRef.current = mount({
      mountPoint: wrapperRef.current!,
      initialPathname: location.pathname.replace(lookUpsBasename, ""),
    });
    isFirstRunRef.current = false;
  }, [location]);

  useEffect(() => unmountRef.current, []);

  return <div ref={wrapperRef} id="lookups-mfe" />;
};
