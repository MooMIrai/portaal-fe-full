import React, { useContext, useEffect, useState } from "react";
import {
  SchedulerViewSlot,
  SchedulerViewSlotProps,
} from "@progress/kendo-react-scheduler";
import { CalendarContext } from "../provider";
import { useLongPress } from "@uidotdev/usehooks";
interface ViewItemProps extends SchedulerViewSlotProps {
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => JSX.Element;
}

const CustomViewSlot = (props: ViewItemProps) => {

  const {setStart,setEnd,setDrag,drag,selectedStart,selectedEnd} = useContext(CalendarContext);
  const attrs = useLongPress(()=>{
    setDrag(true);
    setStart(props.start);
    setEnd(props.end);
  },
{
  threshold:0
});

  const [active,setActive] = useState(false);

  useEffect(()=>{
    if(drag && selectedStart && (props.start>=selectedStart) && (!selectedEnd || props.end<=selectedEnd)){
      setActive(true);

    }else{
      setActive(false);

    }
  },[drag,selectedEnd])

  return <div style={{flex:1,...(active?{background:'#f0f0f0'}:{})}} {...attrs} onMouseEnter={()=>{
    
    if(drag && selectedStart){
      
      if(props.start>=selectedStart){
        setEnd(props.end)
      }
    }

  }} onMouseUp={()=>{
    if(drag)
      setDrag(false)
  }}>
          <SchedulerViewSlot {...props}  ></SchedulerViewSlot>
    </div>;
};

export default CustomViewSlot;
