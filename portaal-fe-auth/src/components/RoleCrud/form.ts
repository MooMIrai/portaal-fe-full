export const RoleForm=[
    {
        name: "role",
        label: "Nome",
        type: "text",
        required:true,
        validator: (value: any) => value ? "" : "Il campo Nome è obbligatorio",
    },
    {
        name: "description",
        label: "Descrizione",
        type: "text",
        required:true,
        validator: (value: any) => value ? "" : "Il campo Descrizione è obbligatorio",
    }
]