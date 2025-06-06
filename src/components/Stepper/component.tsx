import { Stepper } from "@progress/kendo-react-layout";
import { checkCircleIcon, xCircleIcon } from "@progress/kendo-svg-icons";
import React from "react";
import "./style.css";

export default function CustomStepper(props:any){

    return <Stepper errorSVGIcon={xCircleIcon} successSVGIcon={checkCircleIcon} items={props.items} value={props.value} 
    onChange={props.onChange} orientation={props.orientation} className="recruitingStepper" style={{paddingTop: "10px"}}></Stepper>

}