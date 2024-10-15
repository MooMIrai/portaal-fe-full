import React, { useEffect, useState } from "react";
import { useDeviceAssignedContext } from "../UserWithDeviceAssigned/context";

export function CellCheckbox(props:{idGroup:number,row:any}){ 

    const { checkboxes,toggleCheckbox, clearCheckboxs } = useDeviceAssignedContext();
    const [isSelected,setIsSelected] = useState<boolean>(false);

    useEffect(()=>{
       
        setIsSelected(checkboxes[props.idGroup] && checkboxes[props.idGroup].some(s=>s.Stock.serial_number===props.row.Stock.serial_number))
    },[checkboxes])

    return <td >
        <input title="Seleziona riga" type="checkbox" style={{width:15,height:15}} 
            checked={isSelected} 
            onChange={()=>{
            if(isSelected){
                const records = checkboxes[props.idGroup].filter(s=>s.Stock.serial_number!==props.row.Stock.serial_number);
                if(!records.length)
                    clearCheckboxs();
                else
                    toggleCheckbox(props.idGroup,records);
            }else{
                toggleCheckbox(props.idGroup,[...(checkboxes[props.idGroup] || []),props.row]);
            }
            }} />
        </td>

}