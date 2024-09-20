import React,{ createContext, PropsWithChildren, useState, Dispatch, SetStateAction } from "react";


const CalendarContext = createContext<{
  selectedStart:Date | undefined,
  selectedEnd:Date | undefined,
  setStart:Dispatch<SetStateAction<Date | undefined>>,
  setEnd:Dispatch<SetStateAction<Date | undefined>>,
  drag:boolean,
  setDrag:Dispatch<SetStateAction<boolean >>,
  holidays:Array<number>,
  setHolidays:Dispatch<Array<number >>,
  date:Date,
  setDate:Dispatch<Date>
}>({
  selectedStart:undefined,
  selectedEnd:undefined,
  setStart:()=>{},
  setEnd:()=>{},
  drag:false,
  setDrag:()=>{},
  holidays:[],
  setHolidays:()=>{},
  date:new Date(),
  setDate:()=>{}
});
 

 const CalendarProvider = (props:PropsWithChildren) => {
    const [start, setStart] = useState<Date>();
    const [end, setEnd] = useState<Date>();
    const [drag,setDrag] = useState<boolean>(false);
    const [holidays,setHolidays] = useState<Array<number>>([]);
    const [date,setDate] = useState<Date>(new Date());
    return (
      <CalendarContext.Provider value={{ 
        
        selectedStart:start,
        selectedEnd:end, 
        setStart:setStart,
        setEnd:setEnd, 
        
        drag, 
        setDrag,
        
        holidays,
        setHolidays,
        
        date,
        setDate
        
        }}>
        {props.children}     
      </CalendarContext.Provider>
    );
   };

   export { CalendarProvider, CalendarContext };