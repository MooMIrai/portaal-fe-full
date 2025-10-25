import React, { useState } from "react";
import Tab from 'common/Tab'
import { DeviceNotAssigned } from "../../components/DeviceNotAssigned/component";
import { UserWithDeviceAssigned } from "../../components/UserWithDeviceAssigned/component";

export default function DevicePage(){

  const [selectedTab,setSelectedTab] = useState<number>(0);

  const handleSelect = (e: any) => {
    setSelectedTab(e.selected);
  };


  return <Tab renderAllContent={false} selected={selectedTab} onSelect={handleSelect} tabs={[
    {
      title:'Non Assegnati',children:<DeviceNotAssigned />
    },
    {
      title:'Assegnati',children:<UserWithDeviceAssigned />
    }
]} />
}