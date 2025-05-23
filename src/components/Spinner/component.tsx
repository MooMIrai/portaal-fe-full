import React from "react";
import LoaderComponent from "common/Loader";

export function Spinner () {
    return (
        <div style={{
        position:"fixed",
        top:0,bottom:0,
        left:0,right:0,
        background:'rgba(255,255,255, 1)',
        zIndex:99999,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
        }}>
        <LoaderComponent size="large" type="infinite-spinner"/>
    </div>
    );
}