declare module "common/*";

declare module "common/services/BEService";


declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }