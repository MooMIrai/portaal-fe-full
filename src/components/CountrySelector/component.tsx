import React, { useEffect, useRef, useState } from "react";
import { ComboBoxFilterChangeEvent, MultiColumnComboBox } from "@progress/kendo-react-dropdowns";
import client from '../../services/BEService';
import { Label } from "@progress/kendo-react-labels";
import { Button } from "@progress/kendo-react-buttons";

import styles from './style.module.scss';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length:number) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const countryColumns = [
    { field: "code", header: "Codice", width: "200px" },
    { field: "name", header: "Nome", width: "200px" },
]

const provinceColumns = [
    { field: "city_abbreviation", header: "Codice", width: "200px" },
    { field: "name", header: "Nome", width: "600px" },
]



  interface ListModel {
    country:Array<{id:number,code:string,name:string}>,
    province:Array<{
        id: number,
        city_abbreviation: string,
        province_id: number,
        code: string,
        name: string
      }>,
    city:Array<{
        id: number,
        city_abbreviation: string,
        province_id: number,
        code: string,
        name: string
      }>
  }
export default function CountrySelector(props:any){
    const {
        // The meta props of the Field.
        validationMessage,
        touched,
        visited,
        modified,
        valid,
        // The input props of the Field.
        value,
        onChange,
        onFocus,
        onBlur,
        // The custom props that you passed to the Field.
        ...others
      } = props;

    const [list,setList] = useState<ListModel>({country:[],city:[],province:[]});
    const [loading,setLoading] = useState<{country:boolean,province:boolean,city:boolean}>({
            city:false,
            country:false,
            province:false
    });
  
    const [valueTotal,setValueTotal] = useState<{country?:number,province?:number,city?:number}>();
    const [valueToShow,setValueToShow] = useState<{country?:any,province?:any,city?:any}>();
    const [digitCity,setDigitCity] = useState<any>();
    const [modal, setModal] = useState(false);


    const handleChangeValue = (key:string,value:number|undefined,toshow:any|null)=>{
        if(key==='city' && value===0){
            setDigitCity(toshow);
            setModal(true);
        }else{
            setValueTotal((prevState)=>{
                return {
                    ...prevState,
                    [key]:value
                }
            });
            setValueToShow((prevState)=>{
                return {
                    ...prevState,
                    [key]:toshow
                }
            });
        }
        
    }

    useEffect(()=>{
        if(onChange)
            onChange(valueTotal);
    },[valueTotal])

    const timeout = useRef<any>();

    const onSearch = (event: ComboBoxFilterChangeEvent,type:string) => {
        
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        setList(prev=>({...prev,[type]:[]}))
        
        timeout.current=setTimeout(()=>{
            let toAddElement=false;
            let url = '/api/v1/crud/';
            let body=undefined;
            if(type==='city'){
                url+=type+'?term='+event.filter.value+'&pageNum=1&pageSize=20';
                setDigitCity(event.filter.value);
                if(valueTotal?.province){
                    body={
                        "filtering": {
                          "logic": "and",
                          "filters": [
                            {
                              "field": "province_id",
                              "operator": "equals",
                              "value":valueTotal.province
                            }
                          ]
                        }
                      }
                }else if(valueToShow && valueToShow.country && valueToShow.country.code!=='IT'){
                    body={
                        "filtering": {
                          "logic": "and",
                          "filters": [
                            {
                              "field": "city_abbreviation",
                              "operator": "equals",
                              "value":"ESTERO_" + valueToShow.country.code
                            }
                          ]
                        }
                      };
                      toAddElement=true;
                }
            }else if(type==='province'){
                url+='city?term='+event.filter.value+'&pageNum=1&pageSize=20';
                body={
                    "filtering": {
                      "logic": "and",
                      "filters": [
                        {
                          "field": "province_id",
                          "operator": "isnull",
                          "value": null
                        }
                      ]
                    }
                  }
            }else{
                url+=type+'?term='+event.filter.value;
            }
            client.post(url,body).then(res=>{
                let resultData=res.data.data;
                if(toAddElement && !resultData.length){
                    resultData=[{
                        id:0,
                        city_abbreviation:'ESTERO_'+valueToShow?.country.code,
                        code:'ESTERO_'+valueToShow?.country.code,
                        city_name:event.filter.value,
                        name:'Aggiungere nuova città estera? '+event.filter.value 
                    }]
                }
                setList((prev)=>({...prev,[type]:resultData}));
            }).finally(()=>{
                setLoading((prev)=>({...prev,[type]:false}))
            })
        },1000);
        
        setLoading((prev)=>({...prev,[type]:true}));
       
    }

    const abortInsert = ()=>{
        setDigitCity(undefined);
        setModal(false);
        handleChangeValue('city',undefined,null);
    }

    const addNewCity = ()=>{
        client.post('/api/v1/crud/city/create',{
            "city_abbreviation":digitCity.city_abbreviation,
            "province_id": null,
            "code": generateString(9),
            "name":  digitCity.city_name
        }).then(res=>{

            handleChangeValue('city',res.data.id,res.data);
            setDigitCity(undefined);
            setModal(false);
        })
    }

    return <fieldset className={styles.container}>
        <legend><Label>{others.label}</Label></legend>
        
        <div className="k-form-field" onFocus={onFocus} onBlur={onBlur}>
            <Label>Stato</Label>
            <MultiColumnComboBox
                adaptive={true}
                loading={loading.country}
                listNoDataRender={loading.country?
                    ()=>{
                        return <p>Ricerca in corso...</p>
                    }
                    :undefined}
                onFilterChange={(event)=>onSearch(event,'country')}
                data={list.country}
                value={valueToShow?.country}
                columns={countryColumns}
                textField={"name"}
                filterable={true}
                onChange={(event)=>{
                    if(event.value){
                        handleChangeValue('country',event.value.id,event.value);
                        
                    }else{
                        handleChangeValue('country',undefined,event.value);
                    }

                    handleChangeValue('province',undefined,null);
                    handleChangeValue('city',undefined,null);
                }}
                placeholder="Digita per iniziare la ricerca"
            />
        </div>
        <div className="k-form-field" onFocus={onFocus} onBlur={onBlur}>
            <Label>Provincia</Label>
            <MultiColumnComboBox
            adaptive={true}
                    loading={loading.province}
                    listNoDataRender={loading.province?
                        ()=>{
                            return <p>Ricerca in corso...</p>
                        }
                        :undefined}
                    onFilterChange={(event)=>onSearch(event,'province')}
                    data={list.province}
                    columns={provinceColumns}
                    textField={"name"}
                    value={valueToShow?.province}
                    filterable={true}
                    disabled={!valueTotal?.country || valueToShow?.country.code!=='IT'}
                    onChange={(event)=>{
                        if(event.value)
                            handleChangeValue('province',event.value.id,event.value)
                        else
                            handleChangeValue('province',undefined,event.value);
    
                        handleChangeValue('city',undefined,null);
                    }}
                    placeholder="Digita per iniziare la ricerca"
                />
            </div>
        <div className="k-form-field" onFocus={onFocus} onBlur={onBlur}>
            <Label>Città</Label>
            <MultiColumnComboBox
                loading={loading.city}
                onFilterChange={(event)=>onSearch(event,'city')}
                data={list.city}
                columns={provinceColumns}
                textField={"name"}
                filterable={true}
                disabled={!valueTotal?.country || (!valueTotal?.province  && valueToShow?.country.code==='IT' )}
                value={valueToShow?.city}
                adaptive={true}

                listNoDataRender={
                    (el)=>{
                        if(loading.city){
                            return <p>Ricerca in corso...</p>
                        }
                        /*if(valueToShow && valueToShow.country &&  valueToShow.country.code!=='IT' ){
                            //aggiungere un nuovo valore
                            return <Button style={{marginLeft:'auto',marginRight:'auto'}} themeColor={"primary"} onClick={()=>setModal(true)} >Aggiungi nuova città estera</Button>
                        }*/
                        
                        return el;
                    }}
                onChange={(event)=>{
                    if(event.value)
                        handleChangeValue('city',event.value.id,event.value)
                    else
                        handleChangeValue('city',undefined,event.value);
                }}
                placeholder="Digita per iniziare la ricerca"
            />
        </div>
        
        {modal && (
        <Dialog title={"Aggiungi nuova Città"} onClose={abortInsert} width={350}>
            <p>
                Sei sicuro di aggiungere la città <code style={{color:'red'}}>{digitCity.city_name}</code> allo stato <code style={{color:'red'}}>{valueToShow?.country.name}</code>?
            </p>
            <p>Se confermi verrà aggiunta una nuova città e verrà selezionata nel campo richiesto. Vuoi Procedere?</p>
          <DialogActionsBar layout={"stretched"}>
            <Button type="button" themeColor={"primary"} onClick={abortInsert}>
              No
            </Button>
            <Button type="button" onClick={addNewCity}>
              Si
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </fieldset>
}