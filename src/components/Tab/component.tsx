import * as React from 'react';
import { TabStrip, TabStripProps, TabStripTab, TabStripTabProps } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import styles from "./style.module.scss"


  interface TabComponentProps extends TabStripProps {
    tabs:TabStripTabProps [];
    button?: {
      label: string;
      classNameButton?:string;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
      onSubmit?: React.FormEventHandler<HTMLButtonElement>;
    };
  }

const TabComponent = (props:TabComponentProps) => {
  return<div className={styles.containerTab}> 
    <TabStrip selected={props.selected} onSelect={props.onSelect}>
      {props.tabs.map((tab,index)=>(
        <TabStripTab key={index} title={tab.title}>
          {tab.children}
        </TabStripTab>
      ))}
    </TabStrip>
    
    {props.button && (
      <div className={styles.parentButton }>
        <Button
        className={styles.button }
          onClick={props.button.onClick}
          onSubmit={props.button.onSubmit}
        >
          {props.button.label}
        </Button>
        </div>
      )}
    </div>
};
export default TabComponent;