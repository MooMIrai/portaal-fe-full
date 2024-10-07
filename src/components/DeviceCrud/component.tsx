import React, { useRef, useState } from 'react'
import Form from 'common/Form';
import { getFormDeviceFields } from './form';

type DeviceCrudProps = {
    row: any;
    type: string;
    closeModalCallback: () => void;
    refreshTable: () => void;
    onSubmit: (type: string, formData: any, refreshTable: () => void, id: any,closeModal:()=>void) => void;
  };

export default function DeviceCrud(props:DeviceCrudProps){

    const formDevice = useRef<any>();

    const [formDeviceData,setformDeviceData] = useState<any>(props.row);
    
    return <div>
    <Form
        ref={formDevice}
        fields={Object.values(getFormDeviceFields(formDeviceData,props.type))}
        formData={formDeviceData}
        onSubmit={(data: any) => setformDeviceData(data)}
        description="Dispositivo"
    />
</div>
}