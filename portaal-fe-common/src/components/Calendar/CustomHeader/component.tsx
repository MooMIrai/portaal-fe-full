import {
  SchedulerHeader,
  SchedulerHeaderProps,
} from "@progress/kendo-react-scheduler";
import React, { useEffect, useState } from "react";
import CustomButton from "../../Button/component";
import { Switch } from "@progress/kendo-react-inputs";

interface CustomHeaderProps extends SchedulerHeaderProps {
  onMultipleSelectEnabled?: () => void;
  onMultipleSelectDisabled?: (cancelled: boolean) => void;
  multipleSelectButtonDisabled?: boolean;
  toggle: boolean;
  setToggle: (val: boolean) => void;
}

export default function CustomHeader(props: CustomHeaderProps) {

  const handleChange = (e: any) => {
    props.setToggle(e.target.value);
    if (e.target.value && props.onMultipleSelectEnabled) {
      props.onMultipleSelectEnabled();
    } else if (!e.target.value) {
      handleEnd(true);
    }
  }

  const handleEnd = (cancelled: boolean) => {
    if (props.onMultipleSelectDisabled) {
      props.onMultipleSelectDisabled(cancelled);
    }
  }

  return <>
    <div style={{ display: 'flex', columnGap: '1rem', padding: '0.5rem', alignItems: 'center', minHeight: '38px', backgroundColor: 'var(--kendo-color-surface, #f8f9fa)' }}>
      <span>Selezione multipla</span>
      <Switch checked={props.toggle} onChange={handleChange} />
      {props.toggle ? <CustomButton
        themeColor={"primary"}
        onClick={() => handleEnd(false)}
        disabled={props.multipleSelectButtonDisabled}
      >Finalizza</CustomButton> : null}
    </div>
    <SchedulerHeader {...props} />
  </>
}
