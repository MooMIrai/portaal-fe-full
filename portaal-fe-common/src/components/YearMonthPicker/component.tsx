import React, { PropsWithRef, useCallback } from "react"
import { Calendar, CalendarCell, CalendarCellProps, CalendarProps, DateInput, DatePicker } from "@progress/kendo-react-dateinputs"

type DateInputProps ={
    value:Date;
    onChange:(v:any) => void,
    disabled?:boolean,
    options:{
        disabled:Array<{year:number,month:number}>
    }
}


export default function(props:PropsWithRef<DateInputProps>){

    const CalendarOnlyYear = (propsC: CalendarProps<any>) => {
        return <Calendar {...propsC} topView="decade" bottomView="year" cell={CustomCell} />
    }
      
    const CustomCell = useCallback((propsD: CalendarCellProps) => {
       
        const isDisabled =  props.options && props.options.disabled 
                            && props.options.disabled.some(el=>el.year===propsD.value.getFullYear() && el.month===propsD.value.getMonth());
        
        return <CalendarCell {...propsD} isDisabled={isDisabled} isToday={false} />;
    },[props.options]);

    

    return <DatePicker 
            format="MMMM yyyy"
            dateInput={(propsD)=><DateInput {...propsD} disabled />}
            value={props.value} 
            calendar={CalendarOnlyYear}
            disabled={props.disabled}
            onChange={(e)=>{
                props.onChange({value:e.value});
            }}  

        />
   
}
