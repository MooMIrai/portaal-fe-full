import React,{ createContext, PropsWithChildren, useState, Dispatch, SetStateAction } from "react";


const CalendarContext = createContext<{
  selectedStart:Date | undefined,
  selectedEnd:Date | undefined,
  setStart:Dispatch<SetStateAction<Date | undefined>>,
  setEnd:Dispatch<SetStateAction<Date | undefined>>,
  drag:boolean,
  setDrag:Dispatch<SetStateAction<boolean >>
}>({
  selectedStart:undefined,
  selectedEnd:undefined,
  setStart:()=>{},
  setEnd:()=>{},
  drag:false,
  setDrag:()=>{}
});
 

 const CalendarProvider = (props:PropsWithChildren) => {
    const [start, setStart] = useState<Date>();
    const [end, setEnd] = useState<Date>();
    const [drag,setDrag] = useState<boolean>(false);
   
    return (
      <CalendarContext.Provider value={{ selectedStart:start,selectedEnd:end, setStart:setStart,setEnd:setEnd, drag, setDrag }}>
        {props.children}     
      </CalendarContext.Provider>
    );
   };

   export { CalendarProvider, CalendarContext };