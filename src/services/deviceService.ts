import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";
import fileService from 'common/services/FileService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import authService from 'common/services/AuthService';
class DeviceService extends BaseHttpService {

  getTableName() {
    return 'stock';
  }

  searchAssignedByUser = async (
    userId:number,
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: Array<any>,
    term?: string,
    include?: boolean
  ) => {
    try {
      const params:any = {
        pageNum,
        pageSize,
        include,
      };
      if (typeof term === "string" && term.trim() !== "") {
        params.term = term;
      }

      const queryParams:any = {};
      if(filtering){
        queryParams.filtering=filtering
      }
      if(sorting){
        queryParams.sorting=sorting
      }
      if(include){
        queryParams.include=true
      }
  
      const response = await client.post(
        `/api/v1/stock/getCurrentAllocations/${userId}`,
        queryParams, 
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  searchUserWithAllocation = async (
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: Array<any>,
    term?: string,
    include?: boolean
  ) => {
    try {
      const params:any = {
        pageNum,
        pageSize,
        include,
      };
      if (typeof term === "string" && term.trim() !== "") {
        params.term = term;
      }

      const queryParams:any = {};
      if(filtering){
        queryParams.filtering=filtering
      }
      if(sorting){
        queryParams.sorting=sorting
      }
      if(include){
        queryParams.include=true
      }
  
      const response = await client.post(
        `/api/v1/stock/getEmployeesWithAllocations`,
        queryParams, 
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  searchUnassigned = async (
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: Array<any>,
    term?: string,
    include?: boolean
  ) => {
    try {
      const params:any = {
        pageNum,
        pageSize,
        include,
      };
      if (typeof term === "string" && term.trim() !== "") {
        params.term = term;
      }

      const queryParams:any = {};
      if(filtering){
        queryParams.filtering=filtering
      }
      if(sorting){
        queryParams.sorting=sorting
      }
      if(include){
        queryParams.include=true
      }
  
      const response = await client.post(
        `/api/v1/stock/getUnallocated`,
        queryParams, 
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
  

  searchMock(){
    return Promise.resolve({meta:{total:15},data:[
      { model: "Modello X1", serial_number: "SN123456789", DeviceType: { name: "Smartphone" } },
      { model: "Modello Y1", serial_number: "SN987654321", DeviceType: { name: "Laptop" } },
      { model: "Modello Z1", serial_number: "SN192837465", DeviceType: { name: "Tablet" } },
      { model: "Modello X2", serial_number: "SN564738291", DeviceType: { name: "Smartwatch" } },
      { model: "Modello Y2", serial_number: "SN102938475", DeviceType: { name: "Desktop" } },
      { model: "Modello Z2", serial_number: "SN384756192", DeviceType: { name: "Smartphone" } },
      { model: "Modello X3", serial_number: "SN475849302", DeviceType: { name: "Laptop" } },
      { model: "Modello Y3", serial_number: "SN847362910", DeviceType: { name: "Tablet" } },
      { model: "Modello Z3", serial_number: "SN293847561", DeviceType: { name: "Desktop" } },
      { model: "Modello X4", serial_number: "SN657483920", DeviceType: { name: "Smartwatch" } },
      { model: "Modello Y4", serial_number: "SN192030405", DeviceType: { name: "Smartphone" } },
      { model: "Modello Z4", serial_number: "SN384920573", DeviceType: { name: "Laptop" } },
      { model: "Modello X5", serial_number: "SN575839201", DeviceType: { name: "Tablet" } },
      { model: "Modello Y5", serial_number: "SN203948576", DeviceType: { name: "Desktop" } },
      { model: "Modello Z5", serial_number: "SN485930271", DeviceType: { name: "Smartphone" } },
    ]}
    )
  }

  assignDevices(personId:number,stockIds:number[],file:any){
    return client.post('/api/v1/stock/allocate',{
      allocations:stockIds.map(s=>{
        return {
          person_id:personId,
          stock_id:s,
          allocation_date:new Date().toISOString()
        }
      }),
      Attachment:file
    })
  }

  unassignDevices(allocationIds:number[],file:any){
    return client.post('/api/v1/stock/updateAllocation',{
        "allocation_ids": allocationIds,
        "restituition_date": new Date().toISOString(),
        "Attachment": file
    })
  }

  getDeviceTypes(term: string) {
    return client.get('/api/v1/crud/deviceType?term=' + term)
  }

  getPerson(idPerson?: number) {
    if(!idPerson)
      return Promise.resolve(null)
    return client.get('/api/v1/crud/person/' + idPerson + '?include=true').then(res => res.data)
  }

  searchAccount = (text:string) =>{
    return client.get(`api/v1/accounts/findByName?search=${text}`).then(res=>res.data); 
  }


  produceAssignPdf(idPersona: number | undefined, data: Date, rows: Array<Array<string>>, signImage?: string) {

    type CustomDoc = jsPDF & {
      lastAutoTable: {
        finalY: number
      },
      autoTable:any
    }

    return this.getPerson(idPersona).then(person => {
      const doc: CustomDoc = new jsPDF() as any;

      doc.addImage('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',
        'PNG', 68, 8, 76, 45)
      doc.setFontSize(16);
      doc.text('Oggetto: Consegna materiale', 70, 55)
      doc.setFontSize(12);
      if(person){
        doc.text(`Il sottoscritto ${person.firstName} ${person.lastName}. Nato a ${person.CityBirth?person.CityBirth.name:'______________'} il ${new Date(person.dateBirth).toLocaleDateString()} in data ${data.toLocaleDateString()} riceve da Taal il sottostante materiale:`, 30, 65, { align: 'justify', maxWidth: 150 })
      }else{
        doc.text(`Il sottoscritto ___________________________. Nato a _______________ il ____________ in data ${data.toLocaleDateString()} riceve da Taal il sottostante materiale:`, 30, 65, { align: 'justify', maxWidth: 150 })
      }
      

     
      doc.autoTable({
        startY: 75,
        margin: { left: 30, right: 30 },
        head: [['Descrizione del materiale', 'Modello', 'Numero seriale']],
        body: rows,
        styles: {
          lineColor: [0, 0, 0], // Imposta il bordo nero
          lineWidth: 0.2,       // Spessore del bordo
          fillColor: false,     // Nessun riempimento
          textColor: [0, 0, 0], // Testo nero
        },
        headStyles: {
          fillColor: false,     // Nessun riempimento nell'intestazione
          textColor: [0, 0, 0], // Testo nero per l'intestazione
        },
        bodyStyles: {
          fillColor: false,     // Nessun riempimento nelle celle
          textColor: [0, 0, 0], // Testo nero per il corpo
        },
        theme: 'plain', // Rimuove lo stile predefinito
      });

      doc.text(`In caso di danno, furto, o altri motivi che rendano necessario un intervento di manutenzione o di sostituzione totale i danni sono imputabili:`, 30, doc.lastAutoTable.finalY + 10, { align: 'justify', maxWidth: 150 });
      doc.text('• al DIPENDENTE, i costi saranno anticipati dall\' azienda ma addebitati al DIPENDENTE.', 40, doc.lastAutoTable.finalY + 25, { align: 'justify', maxWidth: 110 });
      doc.text(`La riconsegna dovrà necessariamente avvenire in forma scritta attraverso la firma nell’apposito spazio, pena l’estensione della responsabilità del\r\nDIPENDENTE fino a tale data.`, 30, doc.lastAutoTable.finalY + 40, { align: 'justify', maxWidth: 150 });
      doc.text(`Per ricevuta e accettazione IL COLLABORATORE`, 60, doc.lastAutoTable.finalY + 70, { align: 'center', maxWidth: 70 });
      doc.text(`Per`, 150, doc.lastAutoTable.finalY + 70, { align: 'center', maxWidth: 70 });
      doc.line(30, doc.lastAutoTable.finalY + 90, 90, doc.lastAutoTable.finalY + 90);
      doc.line(120, doc.lastAutoTable.finalY + 90, 180, doc.lastAutoTable.finalY + 90);

      if (signImage)
        doc.addImage(signImage, 'PNG', 30, doc.lastAutoTable.finalY + 80, 60, 15);

      // Salvataggio del PDF
      //doc.save('consegna_materiale.pdf');
      const blob = doc.output("blob");
      return fileService.convertBlobToBE(blob,"Assegnazione_"+Date.now()+'.pdf');

    });



  }

  produceRestitutionPdf(idPersona: number | undefined, data: Date, rows: Array<Array<string>>, signImage?: string) {

    type CustomDoc = jsPDF & {
      lastAutoTable: {
        finalY: number
      },
      autoTable:any
    }

    return Promise.all([
      this.getPerson(idPersona),
      this.getPerson(authService.getData().person_id)
    ])
    .then(([person,approver]) => {
      const doc: CustomDoc = new jsPDF() as any;

      doc.addImage('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',
        'PNG', 68, 8, 76, 45)
      doc.setFontSize(16);
      doc.text('Oggetto: Consegna materiale', 70, 55)
      doc.setFontSize(12);
      if(person){
        doc.text(`Il sottoscritto ${person.firstName} ${person.lastName}. Nato a ${person.CityBirth?person.CityBirth.name:'______________'} il ${new Date(person.dateBirth).toLocaleDateString()} in data ${data.toLocaleDateString()} riceve da Taal il sottostante materiale:`, 30, 65, { align: 'justify', maxWidth: 150 })
      }else{
        doc.text(`Il sottoscritto ___________________________. Nato a _______________ il ____________ in data ${data.toLocaleDateString()} riceve da Taal il sottostante materiale:`, 30, 65, { align: 'justify', maxWidth: 150 })
      }
      

     
      doc.autoTable({
        startY: 75,
        margin: { left: 30, right: 30 },
        head: [['Descrizione del materiale', 'Modello', 'Numero seriale']],
        body: rows,
        styles: {
          lineColor: [0, 0, 0], // Imposta il bordo nero
          lineWidth: 0.2,       // Spessore del bordo
          fillColor: false,     // Nessun riempimento
          textColor: [0, 0, 0], // Testo nero
        },
        headStyles: {
          fillColor: false,     // Nessun riempimento nell'intestazione
          textColor: [0, 0, 0], // Testo nero per l'intestazione
        },
        bodyStyles: {
          fillColor: false,     // Nessun riempimento nelle celle
          textColor: [0, 0, 0], // Testo nero per il corpo
        },
        theme: 'plain', // Rimuove lo stile predefinito
      });

      doc.setFont('helvetica','bold')
      doc.text(`Dichiarazione del dipendente:`,30,doc.lastAutoTable.finalY + 10,{})

      doc.setFont('helvetica','normal')
      doc.text(`Il sottoscritto, ${person.firstName} ${person.lastName}, dichiara di aver restituito tutto il materiale aziendale di cui sopra, in buono stato di conservazione, salvo quanto specificato nella colonna "Condizioni".`, 30, doc.lastAutoTable.finalY + 15, { align: 'justify', maxWidth: 150 });
      
      doc.setFont('helvetica','bold')
      doc.text(`Dichiarazione del responsabile:`,30,doc.lastAutoTable.finalY + 35,{})
      doc.setFont('helvetica','normal')
      doc.text(`Il sottoscritto, ${approver.firstName} ${approver.lastName}, in qualità di Responsabile, dichiara di aver ricevuto il materiale sopra elencato dal dipendente ${person.firstName} ${person.lastName} e di averne verificato lo stato di conservazione`, 30, doc.lastAutoTable.finalY + 40, { align: 'justify', maxWidth: 150 });

      doc.text(`Per ricevuta e accettazione IL COLLABORATORE`, 60, doc.lastAutoTable.finalY + 80, { align: 'center', maxWidth: 70 });
      doc.text(`Per`, 150, doc.lastAutoTable.finalY + 80, { align: 'center', maxWidth: 70 });

      doc.line(30, doc.lastAutoTable.finalY + 100, 90, doc.lastAutoTable.finalY + 100);
      doc.line(120, doc.lastAutoTable.finalY + 100, 180, doc.lastAutoTable.finalY + 100);

      if (signImage)
        doc.addImage(signImage, 'PNG', 30, doc.lastAutoTable.finalY + 90, 60, 15);

      // Salvataggio del PDF
      //doc.save('consegna_materiale.pdf');
      const blob = doc.output("blob");
      return fileService.convertBlobToBE(blob,"Resituzione_"+Date.now()+'.pdf');

    });



  }


}

export const deviceService = new DeviceService()