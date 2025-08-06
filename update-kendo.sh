#!/bin/bash

echo "Updating Kendo React packages to version 8.2.0 in Common module..."

cd portaal-fe-common

# Update all Kendo React packages to 8.2.0
yarn add \
@progress/kendo-react-animation@8.2.0 \
@progress/kendo-react-buttons@8.2.0 \
@progress/kendo-react-charts@8.2.0 \
@progress/kendo-react-common@8.2.0 \
@progress/kendo-react-data-tools@8.2.0 \
@progress/kendo-react-dateinputs@8.2.0 \
@progress/kendo-react-dialogs@8.2.0 \
@progress/kendo-react-dropdowns@8.2.0 \
@progress/kendo-react-editor@8.2.0 \
@progress/kendo-react-excel-export@8.2.0 \
@progress/kendo-react-form@8.2.0 \
@progress/kendo-react-gantt@8.2.0 \
@progress/kendo-react-gauges@8.2.0 \
@progress/kendo-react-grid@8.2.0 \
@progress/kendo-react-indicators@8.2.0 \
@progress/kendo-react-inputs@8.2.0 \
@progress/kendo-react-intl@8.2.0 \
@progress/kendo-react-labels@8.2.0 \
@progress/kendo-react-layout@8.2.0 \
@progress/kendo-react-listbox@8.2.0 \
@progress/kendo-react-listview@8.2.0 \
@progress/kendo-react-map@8.2.0 \
@progress/kendo-react-notification@8.2.0 \
@progress/kendo-react-orgchart@8.2.0 \
@progress/kendo-react-pdf@8.2.0 \
@progress/kendo-react-pdf-viewer@8.2.0 \
@progress/kendo-react-pivotgrid@8.2.0 \
@progress/kendo-react-popup@8.2.0 \
@progress/kendo-react-progressbars@8.2.0 \
@progress/kendo-react-ripple@8.2.0 \
@progress/kendo-react-scheduler@8.2.0 \
@progress/kendo-react-scrollview@8.2.0 \
@progress/kendo-react-sortable@8.2.0 \
@progress/kendo-react-spreadsheet@8.2.0 \
@progress/kendo-react-taskboard@8.2.0 \
@progress/kendo-react-tooltip@8.2.0 \
@progress/kendo-react-treelist@8.2.0 \
@progress/kendo-react-treeview@8.2.0 \
@progress/kendo-react-upload@8.2.0

echo "Kendo packages updated to 8.2.0"