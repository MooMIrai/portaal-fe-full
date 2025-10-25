import parse from 'html-react-parser'
import React from 'react';
import { PropsWithRef } from 'react';

export default function HtmlHelper(props:PropsWithRef<{html:string}>){


    return <>{parse(props.html)}</>
}