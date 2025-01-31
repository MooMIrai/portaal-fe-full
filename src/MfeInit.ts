export default function(){

  return {
    menuItems:[
      {
          id:12,
          text:'Notifications',
          level:0,
          route:'#',
          iconKey:'bellIcon'
      },
      {
        id:121,
        text:'inner',
        level:1,
        route:'/notifications/inner',
        parentId: 12,
      }
    ]
  }

}