import { BITMAP_BACKGROUNDCOLOR, BITMAP_IMAGEFORMAT, BITMAP_INKCOLOR, BITMAP_INKWIDTH, BITMAP_PADDING_X, BITMAP_PADDING_Y, LICENCEKEY, SERVICEPORT, TIMEOUT } from './wacom.constants'
import { WacomGSS_SignatureSDK } from './wgssSigCaptX'

export function checkSdk(){
    return new Promise((ok,ko)=>{
        //@ts-ignore
        let sdk= new WacomGSS_SignatureSDK(()=>{
            setTimeout(()=>{
                if(sdk.running) ok(sdk)
                else ko('Signature SDK Service not detected.')
            },TIMEOUT);
        },SERVICEPORT);
    })
}

export function checkCtl(sdk:any){
    return new Promise((ok,ko)=>{
        let sigCtl= new sdk.SigCtl((sigCtlV:any, status:any)=>{
            if(sdk.ResponseStatus.OK == status) ok(sigCtl);
            else ko("SigCtl constructor error: " + status)
        })
    });
}

export function putLicense(sdk:any,ctl:any){
    return new Promise<void>((ok,ko)=>{
        ctl.PutLicence(LICENCEKEY,(sigCtlV:any, status:any) =>{
          if (sdk.ResponseStatus.OK == status) 
          {
            ok()
          }
          else 
          {
           ko("SigCtl constructor error: " + status);
          }
        });
    });
}

export function dynamicCapture(sdk:any,ctl:any){
    return new Promise((ok,ko)=>{
        let dynCapt = new sdk.DynamicCapture((dynCaptV:any, status:any)=>{
            if(sdk.ResponseStatus.OK == status){
                ctl.GetSignature((sigCtlV:any, signObj:any, status:any)=>{
                    if(sdk.ResponseStatus.OK == status){
                        ok({dynCapt,signObj})
                    }else{
                        ko("SigCapt GetSignature error: " + status);
                    }
                });
            }else{
                ko("DynCapt constructor error: " + status)
            }
        });
    });
}

export function dynamicCaptureFileVersion(sdk:any,dynCapt:any){
    return new Promise((ok,ko)=>{
        dynCapt.GetProperty("Component_FileVersion", (dynCaptV:any, property:any, status:any)=>{
            if(sdk.ResponseStatus.OK == status){
                ok(property)
            }else{
                ko("DynCapt GetProperty error: " + status);
            }
        });
    })
}

export function capture(sdk:any,ctl:any,dynCapt:any,signData:Record<string,string>,finalWidth:any,finalHeight:any){
    let hash:any;
    return createHash(sdk)
            .then(hashp=>{
                hash=hashp;
                return clearHash(sdk,hash);
            })
            .then(()=>putHashType(sdk,hash,sdk.HashType.HashMD5))
            .then(()=>putDataToHash(sdk,hash,{fname:signData.fname,lname:signData.lname}))
            .then(()=>{
                const fullName=signData.fname + " " + signData.lname;
                const motivation=signData.motivation || "Document Approval";
               return scan(sdk,ctl,dynCapt,fullName,motivation,hash)
            })
            .then((signObj)=>render(sdk,signObj,finalWidth,finalHeight));
}

function scan(sdk:any,ctl:any,dynCapt:any,fullName:any, motivation:any, hash:any){
    return new Promise((ok,ko)=>{
        dynCapt.Capture(ctl, fullName, motivation, hash, null,(dynCaptV:any, SigObjV:any, status:any)=>{
            if(sdk.ResponseStatus.INVALID_SESSION == status){
                ko('Error: invalid session. Restarting the session.')
            }else{
                if(status==sdk.DynamicCaptureResult.DynCaptOK){
                    ok(SigObjV);
                }else if(status==sdk.DynamicCaptureResult.DynCaptCancel){
                    ko('USER CANCEL SCAN')
                }else{
                    ko("Capture Error " + status);
                }
            }
        });
    })
   
}

function render(sdk:any,sigObj:any,finalWidth:any,finalHeight:any){
    return new Promise((ok,ko)=>{
        //toBase64
        const outputFlags = sdk.RBFlags.RenderOutputBase64 | sdk.RBFlags.RenderColor32BPP | sdk.RBFlags.RenderBackgroundTransparent;
        //toImage
        //const outputFlags = sdk.RBFlags.RenderOutputPicture | sdk.RBFlags.RenderColor32BPP | sdk.RBFlags.RenderBackgroundTransparent;
        sigObj.RenderBitmap(BITMAP_IMAGEFORMAT, finalWidth, finalHeight, BITMAP_INKWIDTH, BITMAP_INKCOLOR, BITMAP_BACKGROUNDCOLOR, outputFlags, BITMAP_PADDING_X, BITMAP_PADDING_Y, (sigObjV:any, bmpObj:any, status:any)=>{
            if(sdk.ResponseStatus.OK == status){
                ok(bmpObj)
            }else{
                ko('Error rendering: '+ status);
            }
        });
    });
}



function createHash(sdk:any){
    return new Promise((ok,ko)=>{
        let hash= new sdk.Hash((hashV:any,status:any)=>{
            if(sdk.ResponseStatus.OK == status) ok(hash)
            else {
                if(sdk.ResponseStatus.INVALID_SESSION == status) ko("Error: invalid session. Restarting the session.");
                else ko("Hash Constructor error: " + status);
            }
        })
    });
}

function clearHash(sdk:any,hash:any){
    return new Promise<void>((ok,ko)=>{
        hash.Clear((hashV:any,status:any)=>{
            if(sdk.ResponseStatus.OK == status) 
            {
                ok()
            } 
            else 
            {
                ko("Hash Clear error: " + status);
            }
        });
    })
}

function putHashType(sdk:any,hash:any,typeH:any){
    return new Promise<void>((ok,ko)=>{
        hash.PutType(typeH,(hashV:any,status:any)=>{
            if(sdk.ResponseStatus.OK == status) 
            {
                ok()
            } 
            else 
            {
                ko("Hash PutType error: " + status);
            }
        });
    })
}

function putDataToHash(sdk:any,hash:any,data:Record<string,string>){

    const promises:any[]=[];
    Object.keys(data).forEach(key=>{
        promises.push(putValueToHash(sdk,hash,data[key],key))
    });
    return Promise.all(promises);
 
}

function putValueToHash(sdk:any,hash:any,val:any,key:any){
    return new Promise<void>((ok,ko)=>{
        const dtV = new sdk.Variant();
        dtV.Set(val);
        hash.Add(dtV, ()=>{
            if(sdk.ResponseStatus.OK == status) ok()
            else ko("Hash Add ("+ key +") error: " + status)
        });
    })
}