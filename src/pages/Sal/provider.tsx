import React,{ createContext, PropsWithChildren, useState, Dispatch, SetStateAction } from "react";


type OpenedSalTable = {
    customers:number[],
    projects:number[]
  }

const SalContext = createContext<{
  draft:OpenedSalTable,
  billing:OpenedSalTable,
  addOpen:(type:'draft' | 'billing', tableType: 'customers'| 'projects',value:number) => void,
  removeOpen:(type:'draft' | 'billing', tableType: 'customers'| 'projects',value:number) => void
}>({
  draft:{
    customers:[],
    projects:[]
  },
  billing:{
    customers:[],
    projects:[]
  },
  addOpen:(type:'draft' | 'billing', tableType: 'customers'| 'projects',value:number) => {},
  removeOpen:(type:'draft' | 'billing', tableType: 'customers'| 'projects',value:number) => {}
});
 

 const SalProvider = (props:PropsWithChildren) => {
   
    const [draft,setDraft] = useState<OpenedSalTable>({
        customers:[],
        projects:[]
    });

    const [billing,setBilling] = useState<OpenedSalTable>({
        customers:[],
        projects:[]
    });

    const handleAdd = (type:'draft' | 'billing', tableType: 'customers'| 'projects',value:number) => {
       
        if(type==='draft'){
        const newData=[...draft[tableType],value]
        setDraft((prev)=>{
            return {...prev,[tableType]:newData}
        });
       }else if(type==='billing'){
        const newData=[...billing[tableType],value];
        setBilling((prev)=>{
            return {...prev,[tableType]:newData}
        });
       }
    }

    const handleRemove = (type:'draft' | 'billing', tableType: 'customers'| 'projects',value:number) => {
       
        if(type==='draft'){
        const newData=draft[tableType].filter(p=>p!=value);
        setDraft((prev)=>{
            return {...prev,[tableType]:newData}
        });
       }else if(type==='billing'){
        const newData=billing[tableType].filter(p=>p!=value);
        setBilling((prev)=>{
            return {...prev,[tableType]:newData}
        });
       }
    }

    return (
      <SalContext.Provider value={{ 
        
        addOpen:handleAdd,
        removeOpen:handleRemove,
        billing,
        draft
        
        }}>
        {props.children}     
      </SalContext.Provider>
    );
   };

   export { SalContext, SalProvider };