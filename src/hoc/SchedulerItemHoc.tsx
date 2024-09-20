import { Error, Label } from '@progress/kendo-react-labels';
import { SchedulerItem } from '@progress/kendo-react-scheduler';
import React, { useEffect } from 'react';

const withSchedulerItem= (WrappedComponent:any) => {
  const WithSchedulerItem = (props:any) => {
  
    return <SchedulerItem
    {...props}
    style={{
      ...props.style,
      marginTop:5
      //backgroundColor: propsi.isAllDay ? "pink" : "blue",
    }}
  >
    <WrappedComponent {...props.dataItem}/>
  </SchedulerItem>
  };

  
  return WithSchedulerItem;
};

export default withSchedulerItem;