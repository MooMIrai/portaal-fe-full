import { ProjectBEModel, ProjectModel } from "../component/ProgettoCrud/model";

export function convertProjectBEToProject(projectBE: ProjectBEModel): ProjectModel {

    return {
      id: projectBE.id,
      protocol:projectBE.Offer?.project_code || "",
      active: projectBE.active,
      description:projectBE.Offer?.other_details,
      account_manager: (projectBE.Offer && projectBE.Offer.AccountManager)?
                        projectBE.Offer.AccountManager.Person.first_name + " "+projectBE.Offer.AccountManager.Person.last_name
                        :"N/A", 
      title: projectBE.Offer?.name || "Untitled", // Recupera il nome dell'offerta o un valore di default
      start_date: projectBE.Offer?.start_date ? new Date(projectBE.Offer.start_date) : new Date(), // Converte la data di inizio in un oggetto Date
      end_date: projectBE.Offer?.end_date ? new Date(projectBE.Offer.end_date) : new Date(), // Converte la data di fine in un oggetto Date
      amount: projectBE.Offer?.rate || projectBE.Offer?.amount || 0, // Recupera l'importo o un valore di default
    };
}
