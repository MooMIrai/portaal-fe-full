import React, { useState, useEffect, useRef } from "react";
import GridTable from "common/Table";
import PersonaleSection from "./../../component/TabPersonaleHR/component";
import { accountsService, CrudGenericService } from "../../services/personaleServices";
import {
  ActivityTypeOption,
  companyAdapter,
  companyOption,
  genderAdapter,
  genderOption,
  locationOption,
  MappedSkill,
  permessiAdapter,
  roleAdapter,
  RoleOption,
  sedeAdapter,
  transformUserData,
} from "../../adapters/personaleAdapters";
import Button from "common/Button";
import NotificationProviderActions from "common/providers/NotificationProvider";
import AvatarIcon from 'common/AvatarIcon';
import Typography from 'common/Typography';
import {passwordIcon} from 'common/icons';
import styles from "./style.modules.scss";


// Column field mapping
const columnFieldMap: { [key: string]: string } = {
  company: "Person.CurrentContract.Contract.Company.name",
  lastName: "Person.lastName",
  firstName: "Person.firstName",
  ContractType: "Person.CurrentContract.Contract.ContractType.description",
  annualCost: "Person.CurrentContract.Contract.annualCost",
  dailyCost: "Person.CurrentContract.Contract.dailyCost",
};


// Filter mapping function
const mapFilterFields = (filter: any | null): any => {
  if (!filter || !filter.filters) {
    return { logic: "or", filters: [] };
  }

  const mappedFilters = filter.filters.map((f) => {
    if ("field" in f) {
      const fd = f as any;
      return { ...fd, field: columnFieldMap[fd.field as string] || fd.field };
    } else {
      const cf = f as any;
      return mapFilterFields(cf);
    }
  });
  return { ...filter, filters: mappedFilters };
};
const columns: any = [
  
  {
    key: "lastName",
    label: "Nominativo",
    type: "custom",
    sortable: true,
    render:(n)=>{
      return <td>
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 15, alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                    <AvatarIcon name={n.firstName ? `${n.firstName} ${n.lastName}` : n.email}
                        initials={n.firstName ? `${n.firstName[0]?.toUpperCase()}${n.lastName[0]?.toUpperCase()}`: n.email[0].toUpperCase()} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <Typography.h6>{n.firstName} {n.lastName}</Typography.h6>
                        <Typography.p>{n.email}</Typography.p>
                    </div>
                </div>
            </td>
    }
    
  },
  {
    key: "company",
    label: "Società",
    type: "string",
    sortable: true
  },
  {
    key: "ContractType",
    label: "Tipo di Contratto",
    type: "string",
    sortable: true
  },
  {
    key: "annualCost",
    label: "Costo Annuale",
    type: "string",
    sortable: false,
    filter: "numeric",
  },
  {
    key: "dailyCost",
    label: "Costo Giornaliero",
    type: "string",
    sortable: false,
    filter: "numeric",
  },
  {
    key:"id",
    label:" ",
    type:"custom",
    format: "noExcel",
    width:150,
    render:(n:any)=><td><Button 
      svgIcon={passwordIcon} 
      title="Imposta Password" 
      fillMode="secondary"
      themeColor="warning"
      type="button"
      onClick={()=>{
        NotificationProviderActions.openConfirm(
          `Vuoi abilitare/resettare la password per l'utente: ${n.firstName} ${n.lastName}`,
          ()=>{
            accountsService.createPassword(n.id).then(()=>{
              NotificationProviderActions.openModal({ icon: true, style: 'success' }, "Operazione avvenuta con successo");
            })
          },
          'Imposta/Reset password'
        )
      }}
    >Imposta Password</Button></td>,
    sortable:false
  }
];

const PersonalPage = () => {

  const [data, setData] = useState<any>();
  const [sede, setSede] = useState<locationOption[]>([]);
  const [isLocationDataReady, setIsLocationDataReady] = useState(false); // Nuovo stato per i dati geografici
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [companies, setCompanies] = useState<companyOption[]>([]);
  const [genders, setGenders] = useState<genderOption[]>([]);
  const [activity, setActivity] = useState<ActivityTypeOption[]>([]);
  const [skills, setSkills] = useState<MappedSkill[] | undefined>();
  const [viewCanceled, setViewCanceled] = useState<boolean>(false);
  const viewCanceledRef = useRef<boolean>(false);

  useEffect(() => {

    const fetchCountryData = async () => {

      try {
        const sedeResponse = await CrudGenericService.fetchResources("location");
        const adaptedLocation = sedeAdapter(sedeResponse);
        setSede(adaptedLocation);

        // Imposta lo stato a true dopo aver caricato tutti i dati geografici
        setIsLocationDataReady(true);
      } 
      
      catch (error) {
        console.error("Error fetching country data:", error);
      }

    };

    fetchCountryData();

  }, []);

  useEffect(() => {

    const fetchData = async () => {

      try {
        const [
          rolesResponse, companiesResponse, gendersResponse, activityResponse,skillResponse] = await Promise.all([
          CrudGenericService.fetchResources("role"),
          CrudGenericService.fetchResources("Company", 1, 30),
          CrudGenericService.fetchResources("Gender"),
          CrudGenericService.fetchResources("ActivityType"),
          CrudGenericService.getSkillArea(true)
        ]);

        const adaptedRoles = roleAdapter(rolesResponse);
        const adaptedCompany = companyAdapter(companiesResponse);
        const adaptedGender = genderAdapter(gendersResponse);
        const adaptedActivities = permessiAdapter(activityResponse);

        if (Array.isArray(skillResponse.data)) {
          const adaptedSkillsArea = skillResponse.data.map(r => ({ id: r.id, name: r.name }))
          setSkills(adaptedSkillsArea);
        }

        setActivity(adaptedActivities)
        setRoles(adaptedRoles);
        setCompanies(adaptedCompany);
        setGenders(adaptedGender);

      } 
      
      
      catch (error) {
        console.error("Error fetching data:", error);
      }

    };

    fetchData();

  }, []);


  const loadData = async (pagination: any, filter: any, sorting: any[]) => {

    if (!isLocationDataReady) {
      return {
        data: [],
        meta: { total: 0 },
      };
    }

    const include = true;
    const mappedFilter = mapFilterFields(filter);
    const mappedSorting = sorting.map((s) => ({...s, field: columnFieldMap[s.field] || s.field}));

    const resources = await CrudGenericService.getAccounts(
      pagination.currentPage,
      pagination.pageSize,
      mappedFilter,
      mappedSorting,
      include,
      viewCanceledRef.current
    );

    const transformedData = transformUserData(resources.data, sede);
    setData(transformedData);

    return {
      data: transformedData,
      meta: {
        total: resources.meta.total,
      },
    };

  };

  const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal: () => void) => {

    let promise: Promise<any> | undefined = undefined;

    if (type === "create") promise = CrudGenericService.createResource(formData);
    else if (type === "edit") promise = CrudGenericService.updateResource(id, formData);
    else if (type === "delete") promise = CrudGenericService.deleteResource(id);
    else if (type === "restore") promise = CrudGenericService.updateResource(id, {isDeleted: false});

    if (promise) {
      promise.then(() => {
        NotificationProviderActions.openModal({ icon: true, style: 'success' }, "Operazione avvenuta con successo");
        refreshTable();
        closeModal();
      })
    }

  }

  const viewCanceledInput = (
    <div className={styles.canceledUsersInput}>
      <label htmlFor="view-canceled-input">Utenti cancellati</label>
      <input
      style={{height: "20px"}}
      id="view-canceled-input"
      type="checkbox" 
      checked={viewCanceled} 
      onChange={() => {
        viewCanceledRef.current = !viewCanceledRef.current;
        setViewCanceled(curr => !curr);
      }}
      />
    </div>
  );

  // Se i dati non sono pronti, non renderizzare nulla
  if (!isLocationDataReady) return null;

  return (
    <div>
      <GridTable
        writePermissions={["WRITE_HR_EMPLOYEE"]}
        extraButtonsRight={[{component: viewCanceledInput, refreshTable: true}]}
        addedFilters={[
          {
            name: "Person.firstName",
            label: "Nome",
            type: "text"
          },
          {
            name: "Person.lastName",
            label: "Cognome",
            type: "text"
          },
          {
            name: "email",
            label: "Email",
            type: "text"
          },
          {
            name: "Person.CurrentContract.Contract.company_id",
            label: "Società",
            type: "filter-autocomplete",
            options:{
              getData: (term:string) => Promise.resolve(
                CrudGenericService.fetchResources("Company", 1, 30, false, term).then(res => {
                  if(res) return res.data.map(r => ({id: r.id, name: r.name}));
                  else return [];
                })
              ),
              getValue:(v:any)=>v?.id
            },
          },
          {
            name: "Person.CurrentContract.Contract.contractType_id",
            label: "Tipo contratto",
            type: "filter-autocomplete",
            indexPosition: 0,
            options:{
              getData: (term:string) => Promise.resolve(
                CrudGenericService.fetchResources("ContractType", 1, 30, false, term).then(res => {
                  if(res) return res.data.map(r => ({id: r.id, name: r.description}));
                  else return [];
                })
              ),
              getValue:(v:any)=>v?.id
            },
          }
        ]}
        filterable={true}
        sortable={true}
        getData={loadData}
        columns={columns}
        extraExcelColumns={[{label: "Ruoli", path: "roleList"}]}
        resizable={true}
        pageable={true}
        stageWindow={"FULLSCREEN"}
        actions={(row) => {
          const actions = ["show", "edit", "delete", "create"];
          if (row?.isDeleted) actions.push("restore");
          return actions;
        }}
        classNameWindow={styles.windowStyle}
        classNameWindowDelete={styles.windowDelete}
        formCrud={(row, type, closeModalCallback, refreshTable) => {

          return (
          
              <PersonaleSection
                row={row}
                type={type}
                roles={roles}
                companies={companies}
                genders={genders}
                skills={skills}
                activities={activity}
                closeModalCallback={closeModalCallback}
                refreshTable={refreshTable}
                onSubmit={handleFormSubmit}
              />
        )}}
      />
    </div>
  );
};

export default PersonalPage;

