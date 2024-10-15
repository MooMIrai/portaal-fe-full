// CheckboxContext.js
import React, { createContext, useContext, useState } from 'react';

// Crea il contesto per le checkbox
const DeviceAssignedContext = createContext<{
    checkboxes:Record<number,any[]>,
    toggleCheckbox : (id:number,data:any[]) => void,
    clearCheckboxs : () => void
}>({
    checkboxes:{},
    toggleCheckbox:()=>{},
    clearCheckboxs:()=>{}
});

// Crea un provider per gestire lo stato delle checkbox
export const DeviceAssignedProvider = ({ children }) => {
    const [checkboxes, setCheckboxes] = useState<Record<number,any[]>>({});

    const toggleCheckbox = (id:number,data:any[]) => {
        setCheckboxes({[id]:data})
    };

    const clearCheckboxs = () => {
        setCheckboxes({});
    };

    return (
        <DeviceAssignedContext.Provider value={{ checkboxes, toggleCheckbox ,clearCheckboxs}}>
            {children}
        </DeviceAssignedContext.Provider>
    );
};

// Crea un hook per utilizzare il contesto delle checkbox
export const useDeviceAssignedContext = () => {
    return useContext(DeviceAssignedContext);
};
