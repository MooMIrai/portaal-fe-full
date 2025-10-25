import { ExpansionPanel, ExpansionPanelActionEvent, ExpansionPanelContent } from "@progress/kendo-react-layout";
import { Reveal } from '@progress/kendo-react-animation'
import React, { PropsWithChildren, useState } from "react";

interface AccordionProps{
    title:string,
    subtitle?:string,
    defaultOpened?:boolean
}

export default function Accordion(props:PropsWithChildren<AccordionProps>){
    const [opened,setOpened] = useState<boolean>(!!props.defaultOpened);

    return <ExpansionPanel
          title={props.title}
          subtitle={props.subtitle}
          expanded={opened}
          tabIndex={0}
          onAction={(event: ExpansionPanelActionEvent) => {

            setOpened(!event.expanded);
          }}
        >
          <Reveal>
            {opened && (
              <ExpansionPanelContent>
                {props.children}
              </ExpansionPanelContent>
            )}
          </Reveal>
        </ExpansionPanel>
}