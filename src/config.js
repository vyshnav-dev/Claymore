export const getScreen = [
    {ScreenId: 1, ScreenName: 'Security', Parent: null, Group: false},
{ScreenId: 2, ScreenName: 'Master', Parent: null, Group: false},
{ScreenId: 3, ScreenName: 'Allocation', Parent: null, Group: false},
{ScreenId: 4, ScreenName: 'RiskAssesment', Parent: null, Group: false},
{ScreenId: 12, ScreenName: 'Time Record', Parent: null, Group: false},
{ScreenId: 10, ScreenName: 'Inspection', Parent: null, Group: false},
{ScreenId: 7, ScreenName: 'Acknowledgement', Parent: null, Group: false},
{ScreenId: 5, ScreenName: 'User', Parent: 1, Group: true}, 
{ScreenId: 6, ScreenName: 'Role', Parent: 1, Group: true},
{ScreenId: 11, ScreenName: 'Product', Parent: 2, Group: true},
{ScreenId: 8, ScreenName: 'Categories', Parent: 2, Group: true},
{ScreenId: 9, ScreenName: 'Description', Parent: 2, Group: true},
{ScreenId: 13, ScreenName: 'Description2', Parent: 2, Group: true}
]

export const locationType = [
    {Type:'uedefkrefrefe',Risk:1},
    {Type:'uedefkrefrefe',Risk:2},
    {Type:'uedefkrefrefe',Risk:1},
    {Type:'uedefkrefrefe',Risk:1},
    {Type:'uedefkrefrefe',Risk:2},
    {Type:'uedefkrefrefe',Risk:2},
    {Type:'uedefkrefrefe',Risk:1},
    {Type:'uedefkrefrefe',Risk:1},
    {Type:'uedefkrefrefe',Risk:1},
]

export const assessmentData = [
    {
        Name:'Location',
        Data:[
            {Type:'locations1',RiskData:0,Description:'',RiskLevel:0},
            {Type:'locations1',RiskData:0,Description:'',RiskLevel:0},
            {Type:'locations1',RiskData:0,Description:'',RiskLevel:0},
            {Type:'locations1',DataRisk:0,Description:'',RiskLevel:0},
            {Type:'locations1',DataRisk:0,Description:'',RiskLevel:0},
            {Type:'locations1',RiskData:0,Description:'',RiskLevel:0},
        ]
    },
    {
        Name:'Training and Competencies',
        Data:[
            {Type:'Training2',Risk:1,Description:'',RiskLevel:2},
            {Type:'Training2',Risk:1,Description:'',RiskLevel:1},
            {Type:'Training2',Risk:1,Description:'',RiskLevel:1},
            {Type:'Training2',Risk:1,Description:'',RiskLevel:1},
            {Type:'Training2',Risk:1,Description:'',RiskLevel:1},
            {Type:'Training2',Risk:1,Description:'',RiskLevel:1},
            {Type:'Training2',Risk:1,Description:'',RiskLevel:1},
            {Type:'Training2',Risk:1,Description:'',RiskLevel:1},
        ]
    },
    {
        Name:'PEE',
        Data:[
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
            {Type:'PPE3',Risk:1,Description:'',RiskLevel:1},
        ]
    },
]

export const documentData = [
    { caption: 'Inspector carry the checklist', Checked: 0 }, // Default "No"
    { caption: 'Inspector carry Test Method', Checked: 1 },   // Default "Yes"
    { caption: 'Inspector carry filled Risk assessment form', Checked: 0 },
];






export const summaryData = [
    {Id:11,Name:"abhi",Code:"d3344",CreatedBy:"Steffy",CreatedOn:"2024-12-24T13:25:48.01"},
    {Id:12,Name:"ab",Code:"d3344",CreatedBy:"Steffy1",CreatedOn:"2024-12-24T13:25:48.01"},
    {Id:13,Name:"a",Code:"d3344",CreatedBy:"Steffy2",CreatedOn:"2024-12-24T13:25:48.01"},
    {Id:14,Name:"abhijith",Code:"d3344",CreatedBy:"Steffy3",CreatedOn:"2024-12-24T13:25:48.01"},
    

]

export const multiData = [
    {Id:4,Name:"Technician6"},
    {Id:5,Name:"Technician7"},
    {Id:6,Name:"Technician8"},
    {Id:7,Name:"Technician9"},

]


export const InspectionData = [
    {
        Name:'Document verification',
        Data:[
            {Equipent:'Equipment manual ',s:0,Remarks:'',na:0,ns:0,se:0},
            {Equipent:'Equipment manual ',s:1,Remarks:'',na:0,ns:0,se:0},
            {Equipent:'Equipment manual ',s:0,Remarks:'',na:0,ns:0,se:0},
            {Equipent:'Equipment manual ',s:0,Remarks:'',na:0,ns:0,se:0},
            {Equipent:'Equipment manual ',s:0,Remarks:'',na:0,ns:0,se:0},
            {Equipent:'Equipment manual ',s:0,Remarks:'',na:0,ns:0,se:0},
            {Equipent:'Equipment manual ',s:0,Remarks:'',na:0,ns:0,se:0},
            
        ]
    },
    
]