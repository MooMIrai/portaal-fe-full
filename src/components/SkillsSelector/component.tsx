import React, { useEffect, useRef, useState } from "react";
import {
    MultiSelect,
    MultiSelectChangeEvent,
    MultiSelectFilterChangeEvent
} from "@progress/kendo-react-dropdowns";
import "@progress/kendo-theme-default/dist/all.css";
import client from "../../services/BEService";
import CustomWindow from "../Window/component";
import DynamicForm from "../DynamicForm/component";
import { Button } from "@progress/kendo-react-buttons";
import styles from "./styles.module.scss"
import { Label } from "@progress/kendo-react-labels";

interface Skill {
    id: number;
    name: string;
    code: string;
    description: string;
    skillCategory_id: number;
}
export interface SkillCategory {
    id: number;
    category: string;
}

interface SkillMultiSelectProps {
    initialSelectedSkills?: Skill[];
}
const SkillMultiSelect: React.FC<SkillMultiSelectProps | any> = (props) => {
    const {
        onChange,
        value,
        disabled
    } = props;
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryMap, setCategoryMap] = useState<Map<string, number>>(new Map());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newSkillName, setNewSkillName] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const multiselectRef = useRef<any>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setSelectedSkills(value);
    }, [value]);

    /*     const fetchSkills = async () => {
            setLoading(true);
            try {
                let filter=undefined;
                if(props.options){
                    filter={}
                }
                const response = await client.post("api/v1/skillArea",);
                setSkills(response.data.data);
            } catch (error) {
                console.error("Errore nel recupero delle skill:", error);
            } finally {
                setLoading(false);
            }
        }; */

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await client.get("api/v1/crud/skillCategory");
            const categoryMap = new Map<string, number>();
            const mappedCategories = response.data.data.map((r: SkillCategory) => {
                categoryMap.set(r.category, r.id);
                return r.category;
            });
            setCategories(mappedCategories);
            setCategoryMap(categoryMap);
            fetchFilteredSkills(filter);
        } catch (error) {
            console.error("Errore nel recupero delle categorie:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event: MultiSelectChangeEvent) => {
        const currentValue = event?.target?.value || [];
        setSelectedSkills(currentValue);
        if (onChange) {
            onChange({ value: currentValue });
        }
    };
    //const timeout = useRef<any>();
    const handleSearch = (event: MultiSelectFilterChangeEvent) => {
        const filterValue = event?.filter?.value || "";
        setFilter(filterValue);
        //clearTimeout(timeout.current);
    };

    const fetchFilteredSkills = async (filterValue?: string) => {
        setLoading(true);

        let body: any = undefined;

        if (filterValue && filterValue.length) {
            body = {
                filtering: {
                    logic: "and",
                    filters: [
                        {
                            field: "name",
                            operator: "contains",
                            value: filterValue
                        }
                    ]
                },
                sorting: [{field: "name", dir: "asc"}]
            }
            if (props.options) {

                const filterType = props.options;

                if (!body) {
                    body = {
                        filtering: {
                            logic: "and",
                            filters: [
                                filterType
                            ]
                        },
                        sorting: [{field: "name", dir: "asc"}]
                    }
                } else {
                    body.filtering.filters.push(filterType);
                }

            }
        } else {

            // verificare se va bene , con calogero in caso rimuovere parte copiata da sopra ...
            //  al momento parte quando non c'è nulla quindi come chimaata base, magari è errata la chiusura della parentesi sopra
            if (props.options) {

                const filterType = props.options;

                if (!body) {
                    body = {
                        filtering: {
                            logic: "and",
                            filters: [
                                filterType
                            ]
                        },
                        sorting: [{field: "name", dir: "asc"}]
                    }
                } else {
                    body.filtering.filters.push(filterType);
                }

            }
        }

        /* const body = {
            filtering: {
                logic: "or",
                filters: [
                    {
                        field: "name",
                        operator: "equals",
                        value: filterValue
                    }
                ]
            }
        }; */
        try {
            const response = await client.post("/api/v1/skillArea", body);
            let resp=response.data.data;

            if(props.options && props.options.disabledArray){
                resp = resp.map((x:any)=>{
                    let mapped = x;
                    mapped.disabled = props.options.disabledArray.some((l:number)=>l===x.id);
                    return mapped;
                })
            }
            setSkills(resp);
        } catch (error) {
            console.error("Errore nel recupero delle skill filtrate:", error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchFilteredSkills(filter);
    }, [props.options, filter])

    const createNewSkill = async () => {
        if (selectedCategory && categoryMap.has(selectedCategory)) {
            const categoryId = categoryMap.get(selectedCategory);
            try {
                const response = await client.post("api/v1/skillArea/create", {
                    code: newSkillName,
                    name: newSkillName,
                    description: `${newSkillName}`,
                    skillCategory_id: categoryId || 1,
                });
                setShowModal(false);
                const newSkill = response.data;
                const updatedSkills = [...(selectedSkills || []), newSkill];

                setSelectedSkills(updatedSkills);

                if (onChange) {
                    onChange({ value: updatedSkills });
                }
                setFilter("");
                setNewSkillName("");

                //fetchFilteredSkills(filter);
            } catch (error) {
                console.error("Errore nella creazione della skill:", error);
            }
        } else {
            console.error("Categoria non valida");
        }
    };

    const handleCategoryChange = (name: string, value: string) => {
        setSelectedCategory(value);
    };

    const handleNewSkill = () => {
        if (filter) {
            setNewSkillName(filter);
            setShowModal(true);
        }
    };

    const fields: any = [
        {
            name: "category",
            label: "Seleziona Categoria",
            type: "select",
            required: true,
            showLabel: false,
            options: categories,
            validator: (value: any) => (value ? "" : "Campo obbligatorio"),
            value: selectedCategory,
            valueOnChange: handleCategoryChange,
        }
    ];

    const listNoDataRender = (element: React.ReactElement<HTMLDivElement>) => {
        const noData = (
            <div className={styles.noDataRender}>
                <h4>
                    Nessun Risultato
                </h4>
                <div className={styles.paragraphContainer}>
                    <p>Vuoi Aggiungere una nuova skill?</p>
                    <Button className={styles.button} type="button" themeColor={"primary"} onClick={handleNewSkill}>
                        Si
                    </Button>
                </div>
            </div>
        );

        return React.cloneElement(element, { ...element.props }, noData);
    };

    return (
        <div>
            <Label>{props.label || "Skills"}</Label>

            <MultiSelect
                data={skills}
                ref={multiselectRef}
                value={selectedSkills}
                filterable={true}
                filter={filter}
                onFilterChange={handleSearch}
                //label="Skill"
                onChange={handleChange}
                listNoDataRender={listNoDataRender}
                placeholder="Seleziona o cerca skill..."
                textField="name"
                dataItemKey="id"
                loading={loading}
                style={{ height: 33.33 }}
                size={"medium"}
            />

            {showModal && (
                <CustomWindow
                    show={showModal}
                    title="Crea Nuova Skill"
                    onClose={() => setShowModal(false)}
                    showModalFooter={false}
                    onSubmit={createNewSkill}
                >
                    <DynamicForm
                        fields={fields}
                        formData={{ categoryId: categoryMap.get(selectedCategory || "") }}
                        onSubmit={createNewSkill}
                        showSubmit={true}
                        submitText="Salva"
                    />
                </CustomWindow>
            )}
        </div>
    );
};

export default SkillMultiSelect;

