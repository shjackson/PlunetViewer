export const newMockStatisticsData = [
    { id: 1,
      title: "Active Users",
      value: 1000
    },
    { id: 2,
      title: "Monthly Revenue",
      value: 200000
    },
  ];

export const mockStatisticsData = () => {
    return new Promise( (resolve) => {
      setTimeout( () => {
        resolve(newMockStatisticsData)
      }, 500)
    })  
  }

export const newMockPieData = [
  {
      "billing": "3720.32",
      "businessUnit": "tbolab"
  },
  {
      "billing": "0",
      "businessUnit": "tbolive"
  },
  {
      "billing": "2354200.82",
      "businessUnit": "tboloc"
  },
  {
      "billing": "7703.24",
      "businessUnit": "tbomedia"
  },
  {
      "billing": "3381.85",
      "businessUnit": "tboplay"
  },
  {
      "billing": "3135782.61",
      "businessUnit": "tbotalent"
  },
  {
      "billing": "161337.53",
      "businessUnit": null
  }
];

export const mockPieData = () => {
  return new Promise( (resolve) => {
    setTimeout( () => {
      resolve(newMockPieData)
    }, 500)
  })  
}
/*
 Fuente que sea san serif
 que se vean los pocentajes
 porcentajes de variacion 
 */