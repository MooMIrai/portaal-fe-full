

export default function(){

  return {
    menuItems:[
      {
          id:13,
          text:'Recruiting',
          level:0,
          route:'/',
          iconKey:'tellAFriendIcon'
          
      },
      {
        id:131,
        text:'Richieste',
        level:1,
        route:'/richieste',
        parentId: 13,
      },
      {
        id:132,
        text:'Candidati',
        level:1,
        route:'/candidati',
        parentId: 13,
      }
    ]
  }

}