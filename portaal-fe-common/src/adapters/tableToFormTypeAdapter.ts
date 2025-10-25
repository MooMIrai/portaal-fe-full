import { FORM_TYPE } from "../models/formModel";
import { TABLE_ACTION_TYPE } from "../models/tableModel";
import { BaseAdapter } from "./baseAdapter";

/**
 * Adapter class that converts a value of type TABLE_ACTION_TYPE to a value of type FORM_TYPE.
 * @extends BaseAdapter<TABLE_ACTION_TYPE, FORM_TYPE>
 */
export class TableToFormTypeAdapter extends BaseAdapter<
  TABLE_ACTION_TYPE,
  FORM_TYPE
> {
  reverseAdapt(source?: FORM_TYPE | undefined): TABLE_ACTION_TYPE {
    throw new Error("Method not implemented.");
  }

  adapt(source?: TABLE_ACTION_TYPE): FORM_TYPE {
    switch (source) {
      case TABLE_ACTION_TYPE.create:
        return FORM_TYPE.create;
      case TABLE_ACTION_TYPE.delete:
        return FORM_TYPE.delete;
      case TABLE_ACTION_TYPE.edit:
        return FORM_TYPE.edit;
      case TABLE_ACTION_TYPE.custom:
        return FORM_TYPE.custom;
      case TABLE_ACTION_TYPE.restore:
        return FORM_TYPE.restore;
      default:
        return FORM_TYPE.view;
    }
  }
}
