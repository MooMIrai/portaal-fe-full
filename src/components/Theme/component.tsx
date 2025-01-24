import React, { PropsWithChildren, useEffect } from "react";
//import "@progress/kendo-theme-fluent/dist/all.css"; 
import "./theme.css";
import './custom.css'
import {
  IntlProvider,
  load,
  loadMessages,
  LocalizationProvider,
} from "@progress/kendo-react-intl";

import likelySubtags from "cldr-core/supplemental/likelySubtags.json";
import currencyData from "cldr-core/supplemental/currencyData.json";
import weekData from "cldr-core/supplemental/weekData.json";

import itNumbers from "cldr-numbers-full/main/it/numbers.json";
import itLocalCurrency from "cldr-numbers-full/main/it/currencies.json";
import itCaGregorian from "cldr-dates-full/main/it/ca-gregorian.json";
import itDateFields from "cldr-dates-full/main/it/dateFields.json";

load(
  likelySubtags,
  currencyData,
  weekData,
  itNumbers,
  itLocalCurrency,
  itCaGregorian,
  itDateFields
);

import esMessages from "./it-language.json";
import { NotificationProvider } from "../Notification/provider";
import { CalendarProvider } from "../Calendar/provider";
 
loadMessages(esMessages, "it-IT");

export default function Theme(props: PropsWithChildren<any>) {

  return (
    <LocalizationProvider language="it-IT">
      <IntlProvider locale="it">
        <NotificationProvider>
          <CalendarProvider>
          {props.children}
          </CalendarProvider>
        </NotificationProvider>
        </IntlProvider>
    </LocalizationProvider>
  );
}
