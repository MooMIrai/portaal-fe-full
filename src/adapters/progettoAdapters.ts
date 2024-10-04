import { ProjectBEModel, ProjectModel } from "../component/ProgettoCrud/model";

export function convertProjectBEToProject(
  projectBE: ProjectBEModel
): ProjectModel {
  const offer = projectBE.Offer;
  return {
    id: offer.id,
    account_manager:
      offer.AccountManager.Person.firstName +
      " " +
      offer.AccountManager.Person.lastName,
    title: offer.name,
    start_date: new Date(projectBE.start_date),
    end_date: new Date(projectBE.end_date),
    amount: offer.amount,
  };
}
