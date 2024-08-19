export default function(){

  return {
    menuItems:[
      {
          id:5,
          text:'HR',
          level:0,
          route:'/HR'
        },
        {
          parentId:5,
          id:50,
          level:2,
          text:'Personale',
          route:'/personale'
        },
        {
          parentId:5,
          id:51,
          level:2,
          text:'Clienti',
          route:'/clienti'
        },
        {
          parentId:5,
          id:52,
          level:2,
          text:'Rapportino',
          route:'/rapportino'
        }
    ]
  }

}