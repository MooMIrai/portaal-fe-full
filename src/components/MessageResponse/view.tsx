import React from "react";
import styles from "./view.module.scss";

interface NotificationParameter {
  id: string;
  NotificationId: string;
  label: string;
  name: string;
  type: NotificationParameterType;
  mandatory: boolean;
  values?: any;
}

type NotificationParameterType =
  | "STRING"
  | "NUMBER"
  | "DATE"
  | "DATETIME"
  | "BOOLEAN"
  | "STATIC_LIST"
  | "DYNAMIC_LIST"
  | "DECIMAL";

interface Props {
  parameters: NotificationParameter[];
  valuesMap: Record<string, any>;
}

export const MessageResponseView: React.FC<Props> = ({ parameters, valuesMap }) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {parameters.map((param) => (
          <div key={param.id} className={styles.item}>
            <div className={styles["label-container"]}>
              <span className={styles.label}>{param.name.toUpperCase()}</span>
            </div>
            <span className={styles.value}>{renderValue(param, valuesMap[param.name])}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderValue = (param: NotificationParameter, value: any) => {
    debugger;
  if (value === undefined || value === null) return "N/A";

  switch (param.type) {
    case "BOOLEAN":
      return value ? "✅ Sì" : "❌ No";
    case "DATE":
    case "DATETIME":
      return new Date(value).toLocaleString();
    case "STATIC_LIST":
    case "DYNAMIC_LIST":
      return value.toString();
    case "DECIMAL":
      return parseFloat(value).toFixed(2);
    default:
      return value.toString();
  }
};

