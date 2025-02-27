export default function(){

  return {
    menuItems:[
      {
          id:12,
          text:'Notifications',
          level:0,
          route:'#',
          iconKey:'bellIcon',
          permissions:["READ_NOTIFICATION_INBOX","READ_NOTIFICATION_MANAGER"]
      },
      {
        id:121,
        text:'Ricevute',
        level:1,
        route:'/notifications/inbox',
        parentId: 12,
        permissions:["READ_NOTIFICATION_INBOX"]
      },
      {
        id:122,
        text:'Manager',
        level:1,
        route:'/notifications/manager',
        parentId: 12,
        permissions:["READ_NOTIFICATION_MANAGER"]
      }
    ]
  }

}