import React from 'react';
import { checkSdk, checkCtl, putLicense, dynamicCapture, capture as wacomCapture  } from '../../services/wacom/wacom.utils'
import Button from '../Button/component'

interface SignDocumentScannerProps { 
    name:string,
    surname:string,
    description:string,
    width?:number,
    height?:number,
    onSign:(image:any)=>void,
    onError:(err:any)=>void
    }

const SignDocumentScanner = (props:SignDocumentScannerProps) => {
  const [loading, setLoading] = React.useState(true);
  const [valid, setValid] = React.useState(false);
  const [sdk, setSdk] = React.useState(null);
  const [ctl, setCtl] = React.useState(null);
  const [dynCapt, setDynCapt] = React.useState(null);

  React.useEffect(() => {
    let sdkS:any;
    let ctlS:any;
    checkSdk()
      .then((sdka:any) => {
        sdkS=sdka;
        return checkCtl(sdkS);
      })
      .then((ctla:any) => {
        ctlS=ctla;
        return putLicense(sdkS, ctlS);
      })
      .then(() => {
        setCtl(ctlS);
        setSdk(sdkS);
        setValid(true);
      })
      .catch(err => {
        setValid(false);
        props.onError(err);
      })
      .finally(() => {
        setLoading(false);
      });

    /*const timeout = setTimeout(() => {
      if (loading && !valid) {
        setLoading(false);
        props.onError('NOT_SUPPORTED');
      }
    }, 5000);*/

    //return () => clearTimeout(timeout); // Cleanup on unmount
  }, [props.onError]);

  const capture = () => {
    if (valid) {
      dynamicCapture(sdk, ctl)
        .then((ret:any) => {
          setDynCapt(ret.dynCapt);
          return wacomCapture(sdk, ctl, ret.dynCapt, { fname: props.name, lname: props.surname, motivation: props.description }, props.width || 500, props.height || 200);
        })
        .then(sign => {
          props.onSign(sign);
        })
        .catch(err => {
          props.onError(err);
        });
    }
  };

  return (
    <>
      {!loading ? (
        <Button themeColor={"primary"} disabled={!valid} onClick={capture} type="button">
          {valid ? <span>Firma</span> : <span>Firma digitale non supportata</span>}
        </Button>
      ) : (
        <Button themeColor={"primary"} disabled  type="button">
          Loading...
        </Button>
      )}
    </>
  );
};

export default SignDocumentScanner;
