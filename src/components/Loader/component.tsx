import { Loader, LoaderProps } from '@progress/kendo-react-indicators'
import React from 'react'

function LoaderComponent(props:LoaderProps) {
  return (
    <div><Loader {...props} ></Loader></div>
  )
}

export default LoaderComponent