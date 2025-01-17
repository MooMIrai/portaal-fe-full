import { Timeline, TimelineProps, sortEventList } from '@progress/kendo-react-layout';
import React from 'react';


export default function TimelineCustom(props:TimelineProps){

    return <Timeline {...props} events={sortEventList(props.events)} />

}