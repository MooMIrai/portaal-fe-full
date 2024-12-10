export default function(){

  return {
    menuItems:[
      {
          id:12,
          text:'Notifications',
          level:0,
          route:'/notification',
          
      },
      {
        id:121,
        text:'inner',
        level:1,
        route:'/notification/inner',
        parentId: 12,
      }
    ]
  }

}