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
          id:5,
          level:2,
          text:'Personale',
          route:'/personale'
        }
    ]
  }

}