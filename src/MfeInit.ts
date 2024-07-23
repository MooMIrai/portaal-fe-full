export default function(){

  return {
    menuItems:[
      {
          id:11,
          text:'Lookups',
          level:0,
          route:'/'
        },
        {
          parentId:11,
          id:12,
          level:2,
          text:'nonMain',
          route:'/nonmain'
        }
    ]
  }

}