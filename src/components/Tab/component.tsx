import React, { useState } from 'react';
import { TabStrip, TabStripProps, TabStripTab, TabStripTabProps } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import styles from "./style.module.scss"
import { saveIcon } from '@progress/kendo-svg-icons';
import { FormRefContext } from './form.ref.provider';


interface TabComponentProps extends TabStripProps {
  tabs: TabStripTabProps[];
  button?: {
    label: string;
    classNameButton?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onSubmit?: React.FormEventHandler<HTMLButtonElement>;
  };
}

const TabComponent = (props: TabComponentProps) => {

  const [touched, setTouched] = useState<boolean>();
  const setDisabled = (value: boolean | undefined) => !touched ? setTouched(value): setTouched(true);
  
  return (
    <FormRefContext.Provider value={{setDisabled}}>
      <div className={styles.containerTab}>
        <TabStrip  selected={props.selected} onSelect={props.onSelect} renderAllContent={props.renderAllContent!==undefined?props.renderAllContent: true} animation={false} >
          {props.tabs.map((tab) => (
            <TabStripTab key={"tab_el" + tab.title} title={tab.title}>
              {tab.children}
            </TabStripTab>
          ))}
        </TabStrip>

        {props.button && (
          <div className={styles.parentButton}>
            <Button
              className={styles.button}
              onClick={props.button.onClick}
              onSubmit={props.button.onSubmit}
              disabled={!touched}
              themeColor={"primary"}
              size={"medium"}
              svgIcon={saveIcon}
            >
              {props.button.label}
            </Button>
          </div>
        )}
      </div>
    </FormRefContext.Provider>
  );
};
export default TabComponent;