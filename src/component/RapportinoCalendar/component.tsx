import React from "react";
import Calendar from "common/Calendar";
import RapportinoCrud from "../RapportinoCrud/component";

export default function RapportinoCalendar() {
  return (
    <Calendar
      defaultModalTitle={"Rapportino"}
      defaultView="month"
      handleDataChange={() => {}}
      defaultDate={new Date()}
      data={[]}
      contentModal={(slot, closeModalCallback) => {
        return <RapportinoCrud item={slot} onClose={closeModalCallback} />;
      }}
    />
  );
}
