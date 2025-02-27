

export default function(){

  return {
    menuItems:[
      {
        id: 99,
        text: "Approvigionamenti",
        level: 0,
        route: "/device",
        iconKey: "tablePropertiesIcon",
        permissions:["READ_STOCK"]
      }
    ]
  }

}