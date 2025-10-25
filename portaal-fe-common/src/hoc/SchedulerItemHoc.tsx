import { SchedulerItem } from '@progress/kendo-react-scheduler';
import React from 'react';

const withSchedulerItem= (WrappedComponent:any) => {
  const WithSchedulerItem = (props:any) => {
    return <SchedulerItem
    {...props}
    style={{
      ...props.style,
      pointerEvents: "none"
      //backgroundColor: propsi.isAllDay ? "pink" : "blue",
    }}
  >
    <WrappedComponent {...props.dataItem}/>
  </SchedulerItem>
  };

  
  return WithSchedulerItem;
};

export default withSchedulerItem;