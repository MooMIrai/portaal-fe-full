import React, { useState, useEffect, useRef } from "react";
import {
    DropDownList,
    MultiSelect,
    MultiSelectChangeEvent,
    MultiSelectFilterChangeEvent
} from "@progress/kendo-react-dropdowns";
import "@progress/kendo-theme-default/dist/all.css";
import client from "../../services/BEService";
import { NotificationProvider } from "../Notification/provider";


interface Skill {
    id: number;
    name: string;
    code: string;
    description: string;
    skillCategory_id: number;
}
interface SkillCategory {
    id: number;
    category: string;
}
interface SkillMultiSelectProps {
    initialSelectedSkills?: Skill[];
}

const SkillMultiSelect: React.FC<SkillMultiSelectProps> = ({
    initialSelectedSkills = []
}) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
        initialSelectedSkills
    );
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [categories, setCategories] = useState<SkillCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const response = await client.post("api/v1/skillArea");
            setSkills(response.data.data);
        } catch (error) {
            console.error("Errore nel recupero delle skill:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchCategories = async () => {
        try {
            const response = await client.get("api/v1/crud/skillCategory");
            console.log(response)
            setCategories(response.data.data);
        } catch (error) {
            console.error("Errore nel recupero delle categorie:", error);
        }
    };
    // Funzione per recuperare skill filtrate dal server


    const fetchFilteredSkills = async (filterValue: string) => {
        setLoading(true);

        const body = {
            filtering: {
                logic: "or",
                filters: [
                    {
                        field: "name",
                        operator: "contains",
                        value: filterValue
                    }
                ]
            }

        };

        try {
            const response = await client.post("/api/v1/skillArea", body);
            setSkills(response.data.data);
        } catch (error) {
            console.error("Errore nel recupero delle skill filtrate:", error);
        } finally {
            setLoading(false);
        }
    };
    const createNewSkill = async (newSkill: string) => {
        /*      if (!selectedCategory) {
                 alert("Seleziona una categoria prima di creare una skill");
                 return null;
             } */
        try {
            const response = await client.post("api/v1/skillArea/create", {
                code: newSkill,
                name: newSkill,
                description: `${newSkill}`,
                skillCategory_id: selectedCategory?.id || 1,
            });
            const createdSkill: Skill = response.data.data;
            return createdSkill;
        } catch (error) {
            console.error("Errore nella creazione della skill:", error);
            return null;
        }
    };

    useEffect(() => {
        fetchSkills();
        fetchCategories();
    }, []);


    const handleSelectChange = async (event: MultiSelectChangeEvent) => {
        const currentValue = event.target.value;
        const lastInputValue = currentValue[currentValue.length - 1];

        const existingSkill = skills.find(
            (skill) => skill.name.toLowerCase() === lastInputValue.name.toLowerCase()
        );

        if (!existingSkill && lastInputValue.name !== "") {
            const newSkill = await createNewSkill(lastInputValue.name);
            if (newSkill) {
                setSkills((prevSkills) => [...prevSkills, newSkill]);
                setSelectedSkills((prevSelected) => [...prevSelected, newSkill]);
            }
        } else {
            setSelectedSkills(currentValue);
        }
    };
    const timeout = useRef<any>();

    const handleSearch = (event: MultiSelectFilterChangeEvent) => {

        const filterValue = event.filter?.value || "";
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            fetchFilteredSkills(filterValue);
        }, 1000);
        ;

    };

    const handleCategorySelect = (event: any) => {
        setSelectedCategory(event.target.value);
    };

    const valueRender = (element: any, value: SkillCategory) => {
        return (
            <span>{value ? value.category : "Seleziona Una Categoria Skill"}</span>
        );
    };
    return (
        <div>
            <div>
                <DropDownList
                    data={categories}
                    value={selectedCategory}
                    onChange={handleCategorySelect}
                    textField="category"
                    dataItemKey="id"

                    valueRender={valueRender}

                />
            </div>

            <MultiSelect
                data={skills}
                value={selectedSkills}
                filterable={true}
                onChange={handleSelectChange}
                onFilterChange={handleSearch}
                placeholder="Seleziona o cerca skill..."
                textField="name"
                dataItemKey="id"
                allowCustom={true}
                loading={loading}
            />
        </div>
    );
};

export default SkillMultiSelect;
