

export default function(){

  return {
    menuItems:[
      {
          id:5,
          text:'HR',
          level:0,
          route:'/HR',
          iconKey: 'globeOutlineIcon',
       
        },
        {
          parentId:5,
          id:50,
          level:2,
          text:'Personale',
          route:'/personale',
          iconKey:"accessibilityIcon"
        },
        {
          parentId:5,
          id:52,
          level:2,
          text:'Rapportino',
          route:'/rapportino',
          iconKey:"calendarIcon"
        }
    ]
  }

}