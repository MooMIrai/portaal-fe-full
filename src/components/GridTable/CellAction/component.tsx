import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { GridCellProps } from "@progress/kendo-react-grid";
import styles from "./style.module.scss";
import { SVGIcon } from "@progress/kendo-svg-icons";

interface CellActionProps extends GridCellProps {
  field: string;
  openCellModal: (
    dataItem: any,
    field: string,
    content: ((dataItem: any) => JSX.Element) | null,
    title: string // Aggiunto
  ) => void;
  icon: SVGIcon;
  cellModalContent?: (dataItem: any) => JSX.Element;
  columnLabel: string; // Aggiunto
}

const CellAction = (props: CellActionProps) => {
  const {
    dataItem,
    field,
    openCellModal,
    icon,
    cellModalContent,
    columnLabel,
  } = props;

  const handleClick = () => {
    openCellModal(dataItem, field, cellModalContent || null, columnLabel);
  };

  return (
    <td>
      <div className={styles.cellContainer}>
        <span>{dataItem[field]}</span>
        <Button onClick={handleClick} svgIcon={icon}></Button>
      </div>
    </td>
  );
};

export default CellAction;
