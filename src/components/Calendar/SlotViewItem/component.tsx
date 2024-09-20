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

  const {setStart,setEnd,setDrag,drag,selectedStart,selectedEnd, holidays,date} = useContext(CalendarContext);


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


  const isHoliday = holidays.some((h)=>h===props.start.getDate() ) && date.getMonth()===props.start.getMonth();
  let bg ={};
  if(isHoliday){
    bg ={ background:'rgba(255,0,0,0.2)'}
  }

  const notInMounth = props.start.getMonth()!= date.getMonth();
  console.log(props)



  return <div style={{
                      flex:1,
                      ...(active?{background:'#f0f0f0'}:{}),
                      ...(notInMounth?{cursor:'not-allowed'}:{})
                    }} 
                    
                    {
                      ...(notInMounth?{}:attrs)
                    }

                    onMouseEnter={(e)=>{
                      if(notInMounth){
                        e.preventDefault()
                      }else if(drag && selectedStart){
                        
                        if(props.start>=selectedStart){
                          setEnd(props.end)
                        }
                      }

                    }} 
                    onMouseUp={()=>{
                      if(drag){
                          setDrag(false)
                      }
                      
                    }}
        >
          
          <SchedulerViewSlot {...props} style={{...props.style,...bg}}  ></SchedulerViewSlot>
    </div>;
};

export default CustomViewSlot;
