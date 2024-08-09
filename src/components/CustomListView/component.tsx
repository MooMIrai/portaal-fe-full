import React from "react";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";
import { PageChangeEvent, Pager, PagerProps } from "@progress/kendo-react-data-tools";
import styles from "./style.module.scss";

interface ListViewProps {
  data: any[] | undefined;
  itemRender: React.ComponentType<{ dataItem: any; index?: number }> | undefined;
  headerRender: React.ReactNode;
  footerRender: React.ReactNode;
  style: React.CSSProperties;
  paginate: PagerProps | undefined;
  containerClassName: string | undefined;
}

export default function CustomListView(props: ListViewProps) {

  const [page, setPage] = React.useState({
    skip: props.paginate?.skip || 0,
    take: props.paginate?.take || 10,
  });

  const handlePageChange = (e: PageChangeEvent) => {
    setPage({
      skip: e.skip,
      take: e.take,
    });
    if (props.paginate?.onPageChange) props.paginate.onPageChange(e);
  };

  const Header = () => {
    if (!props.headerRender) return null;

    return (
      <ListViewHeader
        style={{ color: "rgb(160, 160, 160)", fontSize: 14 }}
        className="pl-3 pb-2 pt-2"
      >
        {props.headerRender}
      </ListViewHeader>
    );
  };

  const Footer = () => {
    if (!props.footerRender) return null;

    return <ListViewFooter
      style={{ color: "rgb(160, 160, 160)", fontSize: 14 }}
      className="pl-3 pb-2 pt-2"
    >
      {props.footerRender}
    </ListViewFooter>
  }

  return <div className={styles.container + (props.containerClassName ? " " + props.containerClassName : "")}>
    <ListView
      data={props.data}
      item={props.itemRender}
      style={props.style}
      header={Header}
      footer={Footer}
    />
    {props.paginate ? <Pager
      {...props.paginate}
      skip={page.skip}
      take={page.take}
      className="k-listview-pager"
      onPageChange={handlePageChange}
      total={props.data?.length || 0}
    /> : null}
  </div>
}