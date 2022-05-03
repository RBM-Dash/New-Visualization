myChart.showLoading();
    myChart.hideLoading();
    
 var   data =  {"nodes":[
{"name":"Domestic"},
{"name":"Global Fund"},
{"name":"USAID"},
{"name":"Other"},
{"name":"Program (DS-TB) Costs"},
{"name":"Program (DR-TB) Costs"},
{"name":"Drugs DS-TB"},
{"name":"Drugs DR-TB"},
{"name":"Labs, Equipments, Supplies"},
{"name":"Operational Research/Surveys"},
{"name":"TB/HIV Activities"},
{"name":"Patient Support"},
{"name":"NTP Staff"},
{"name":"Other Expenses"},
{"name":"Total"},



],
"links":[
{"source": "Total",  "target": "Program (DS-TB) Costs",  "value": 6027140},
{"source": "Total",  "target": "Program (DR-TB) Costs",  "value": 423581},
{"source": "Domestic", "target": "Total",  "value": 551664},
{"source": "Global Fund", "target": "Total",  "value": 3946378},
{"source": "USAID", "target": "Total",  "value":4075745},
{"source": "Other", "target": "Total",  "value": 3826357},
{"source": "Total", "target": "NTP Staff",  "value": 706095},
{"source": "Total",  "target": "TB/HIV Activities",  "value": 0},
{"source": "Total",  "target": "Drugs DS-TB",  "value": 2828527},
{"source": "Total",  "target": "Drugs DR-TB",  "value": 453231},
{"source": "Total",  "target": "Labs, Equipments, Supplies",  "value": 1471438},
{"source": "Total",  "target": "Operational Research/Surveys",  "value": 60000},
{"source": "Total",  "target": "Patient Support",  "value": 430132},
{"source": "Total",  "target": "Other Expenses",  "value": 0},



]};
var TotalReceived = 12400144;

    myChart.setOption(option = {
        title: {
            text: 'USD $'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: function (params) {
               console.log(params);
               var myPercent = 100*(params.data.value/TotalReceived);
               var myReturn = params.data.source + ' to ' + params.data.target + ' : ' + 
                params.data.value.toLocaleString(undefined, {maximumFractionDigits: 0}) +
                ' (' + myPercent.toLocaleString(undefined, {maximumFractionDigits: 0}) +
                '%)';
                return myReturn;
            },
            
        },
        series: [
            {
                nodeGap:8,
                nodeWidth: 50,
                type: 'sankey',
                data: data.nodes,
                links: data.links,
                focusNodeAdjacency: 'allEdges',
                
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            }
        ]
    });