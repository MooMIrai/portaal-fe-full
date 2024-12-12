

export default function(){

  return {
    menuItems:[
      {
          id:13,
          text:'Recruting',
          level:0,
          route:'/',
          
      },
      {
        id:131,
        text:'Candidati',
        level:1,
        route:'/candidati',
        parentId: 13,
      }
    ]
  }

}