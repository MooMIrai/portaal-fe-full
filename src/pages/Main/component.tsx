import React from "react";
import { useParams } from "react-router-dom";

export function MainPage(){

    const params = useParams();

    return <div>
            <div>NOTIFICATION</div>
            <div>Data: <span id="span_notification"></span>{JSON.stringify(params)}</div>
        </div>
}