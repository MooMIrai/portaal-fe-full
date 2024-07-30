import { FieldConfig, FieldType } from "../models/formModel";
import { BaseAdapter } from "./baseAdapter";

/**
 * Adapter class that converts a generic object to an array of FieldConfig.
 * @extends BaseAdapter<Record<string, any>, FieldConfig[]>
 */
export class ObjToFieldTypeAdapter extends BaseAdapter<
  Record<string, any>,
  FieldConfig[]
> {
  reverseAdapt(source?: FieldConfig[] | undefined): Record<string, any> {
    throw new Error("Method not implemented.");
  }

  adapt(source?: Record<string, any>): FieldConfig[] {
    if (!source) {
      throw new Error("Source object is undefined.");
    }

    return Object.keys(source).map((key) => {
      const value = source[key];
      let type: FieldType = "text";
      let options;

      if (typeof value === "string") {
        type = "text";
      } else if (typeof value === "number") {
        type = "number";
      } else if (typeof value === "boolean") {
        type = "checkbox";
      } else if (Array.isArray(value)) {
        type = "select";
        options = value;
      } else if (value instanceof Date) {
        type = "date";
      }

      return {
        name: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        type,
        value,
        options,
      };
    });
  }
}
