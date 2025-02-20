

export default function(){

  return {
    menuItems:[
      {
          id:13,
          text:'Recruiting',
          level:0,
          route:'#',
          iconKey:'myspaceIcon',
          permissions:["hr_request_read","hr_candidate_read"]
      },
      {
        id:131,
        text:'Richieste',
        level:1,
        route:'/richieste',
        parentId: 13,
        permissions:["hr_request_read"]
      },
      {
        id:132,
        text:'Candidati',
        level:1,
        route:'/candidati',
        parentId: 13,
        permissions:["hr_candidate_read"]
      }
    ]
  }

}