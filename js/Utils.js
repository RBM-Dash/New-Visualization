const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
];
const  zoomFactor = 0.85;

function nFormatter(num, digits) {
    // Convert numbers into a million (M), thousands (K), representation
    // Fails if one pass arg as string, if cleansed with parseFloat works well
    // One might use Math.abs(num) as well
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

function createDiscretePieces(values, colorMap) {
    // Create the pieces for the visualMap from Chroma deciles and minima and maxima of the data
    var myranget = chroma.limits(values, 'q', 100);
    var NN = _.compact(myranget).filter(function(x) {
        return x >= 0
    });
    var myrange = chroma.limits(NN, 'l', 13);
    let temp = {};
    var myPieces = [{ value: -999999999999999, label: 'Not Applicable', color: '#aaa1a1' }];
    for (let i = 0; i < myPieces.length; i++) {
        temp.min = Math.round(myrange[i]);
        temp.mmax = Math.round(myrange[i] + 1);
        temp.color = colorMap[i];
        myPieces.push(temp);
    }

    return myPieces;
}

function byYearOption(Objeto, Year) {
    // Loop over an object to split a given list of keys (toSplit) with complex names into several properties and adds them as new key/values pairs
    let Accumulator = [];
    let temp = [];
    let tempi = {};
        for (let i = 0; i < Objeto.length; i++) {
            tempi = _.pick(Objeto[i], ['Country', 'A3', 'WHO_Region','Latitude','Longitude']);
            temp = _.pickBy(Objeto[i], function(o,k) { return _.endsWith(k,String(Year))});
            //Rename keys to remove year
            temp = _.merge(tempi,_.mapKeys(temp, function(value, key) {return key.replace(/[^a-z]/gi, '');}));
            //console.log(temp)
            Accumulator = _.concat(Accumulator, temp);
        }
    return Accumulator;
}

function datatoMap(Objeto, whichVar) {
    // Loop over an object to split a given list of keys (toSplit) with complex names into several properties and adds them as new key/values pairs
    let Accumulator = [];
    let temp = [];
    let tempi = {};
        for (let i = 0; i < Objeto.length; i++) {
            tempi.name = _.pick(Objeto[i], ['A3']);
            tempi.value = _.pick(Objeto[i], whichVar);
            console.log(tempi)
            Accumulator = _.concat(Accumulator, tempi);
        }
    return Accumulator;
}
// Start defining here basic options for the different charts, i.e., geo, line, bar, etc
// A few colormaps first
const myRedScale = ['#ffffe0', '#ffe9b7', '#ffd196', '#ffb67f', '#ff9b6f', '#f98065', '#ee665d', '#e14d54', '#cf3548', '#bb1e37', '#a40921', '#8b0000', '#580000', '#2D0000'];
//const myBlueScale = ['#ffffe0', '#ffe9b7', '#ffd196', '#ffb67f', '#ff9b6f', '#f98065', '#ee665d', '#e14d54', '#cf3548', '#bb1e37', '#a40921', '#8b0000', '#580000', '#2D0000'];


// Define basic option for MAPS
var bOption = {
    backgroundColor: "#061740",
    
    title: [ {
        id: 'statistic',
        right: 120,
        top: 40,
        width: 100,
        textStyle: {
            color: 'white',
            fontSize: 16
        }
    }],
    
    geo: {
        map: 'world',
        left: '10',
        right: '35%',
        zoom: zoomFactor,
        label: {
            emphasis: {
                show: false
            }
        },
        boundingCoords: [
// [lng, lat] of left-top corner
[
  -120.234375,
  38.272688535980976
],
// [lng, lat] of right-bottom corner
[ 164.1796875,
  -44.087585028245165]
        ],
        roam: true,
        itemStyle: {
            normal: {
                areaColor: 'white',
                borderColor: 'grey'
            },
            emphasis: {
                areaColor: 'lightgrey'
            }
        }
    },
    toolbox: {
       iconStyle: { normal: {borderColor: 'gray'}, emphasis: {borderColor: 'white'}},
       feature: {saveAsImage: {excludeComponents: ['toolbox']}}
    },
    brush: {
        geoIndex: 0,
        outOfBrush: {color: 'transparent'}, 
        seriesIndex: [0,1],
        //throttleType: 'debounce',
        //throttleDelay: 300
    },
    legend: {
        top: '8%',
        orient: 'horizontal',
        left: 'left',
        width: '100%',
        itemGap: 6,
        itemWidth: 15,
        itemHeight: 10,
        data: ['NSP', 'RDT', 'ACT', 'LLIN','SMC','IPTp','IRS'],
        selected: {
            'NSP': true,
            'RDT': false,
            'ACT': false,
            'LLIN': false,
            'SMC': false,
            'IPTp': false,
            'IRS': false,
        },

    },
    tooltip: {
        trigger: 'item',
        confine: true,
        formatter: function(params) {
            console.log(params);
            

            //Here you have to use the name to get all parameters from the general data
            var res = '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 14px;padding-bottom: 7px;margin-bottom: 7px">' +
                params.name + '   <br/>' + '</div>';
                

            return res;

        }
    },
    visualMap: {
        type: 'continuous',
        itemGap: 2,
        min: min,
        max: max,
        seriesIndex: [0,1],
        calculable: true,
        zlevel: 4,
        textStyle: {color: 'white'},
        inRange: {color: ['lightblue', '#0262FF','blue']},
       
        outOfRange: { color: '#e8eaed',
        },
        formatter: function(value1, value2) {
            if (value2 !== undefined) {
                return nFormatter(value1, 2) + ' - ' + nFormatter(value2, 2)
            } else {
                return ' <= ' + nFormatter(value1, 2)
            }
        },
       


    },
    grid: {
        right: 40,
        top: 100,
        bottom: 40,
        width: '30%'
    },
    xAxis: {
        type: 'value',
        scale: true,
        position: 'top',
        boundaryGap: false,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            margin: 2,
            textStyle: {
                color: '#aaa'
            },
            formatter: function(value, index) {
                const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
                var item = lookup.slice().reverse().find(function(item) {
                    return value >= item.value;
                });
                return item ? (value / item.value).toFixed(3).replace(rx, "$1") + item.symbol : "0";
            },

        }
    },
    yAxis: {
        type: 'category',
        name: 'TOP 20',
        nameGap: 16,
        axisLine: {
            show: false,
            lineStyle: {
                color: '#ddd'
            }
        },
        axisTick: {
            show: false,
            lineStyle: {
                color: '#ddd'
            }
        },
        axisLabel: {
            interval: 0,
            textStyle: {
                color: '#ddd'
            }
        },
        data: []
    },
    series: [ {
        name: 'myScatter',
        type: 'scatter',
        coordinateSystem: 'geo',
        boundingCoords: [
            // [lng, lat] of left-top corner
            [-120.234375,38.272688535980976],
            // [lng, lat] of right-bottom corner
            [ 164.1796875,-44.087585028245165]
        ],
        geoIndex: 0,
        //zoom: zoomFactor,
        symbolSize: 1,
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            },
            emphasis: {
                show: true
            }
        },
        itemStyle: {
            normal: {
                color: 'transparent'
            }
        },
        encode: {
            lng: 'Longitude',
            lat: 'Latitude',
        }
    },{
        id: 'NSP',
        name: 'NSP',
        type: 'map',
        mapType: "world",
        geoIndex: 0,
        coordinateSystem: 'geo',
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        nameProperty: 'A3',
        encode: {
            name: 'A3',
            value: 'Total GAP'
        }
    },{
        id: 'RDT',
        name: 'RDT',
        type: 'map',
        mapType: "world",
        geoIndex: 0,
        coordinateSystem: 'geo',
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        nameProperty: 'A3',
        encode: {

            name: 'A3',
            value: 'RDTGAPS'
        }
    },{
        id: 'ACT',
        name: 'ACT',
        type: 'map',
        mapType: "world",
        geoIndex: 0,
        coordinateSystem: 'geo',
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        nameProperty: 'A3',
        encode: {

            name: 'A3',
            value: 'ACTGAPS'
        }
    },{
        id: 'LLIN',
        name: 'LLIN',
        type: 'map',
        mapType: "world",
        geoIndex: 0,
        coordinateSystem: 'geo',
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        nameProperty: 'A3',
        encode: {

            name: 'A3',
            value: 'LLINGAPS'
        }
    },{
        id: 'SMC',
        name: 'SMC',
        type: 'map',
        mapType: "world",
        geoIndex: 0,
        coordinateSystem: 'geo',
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        nameProperty: 'A3',
        encode: {

            name: 'A3',
            value: 'SMCGAPS'
        }
    }, {
        id: 'IPTp',
        name: 'IPTp',
        type: 'map',
        mapType: "world",
        geoIndex: 0,
        coordinateSystem: 'geo',
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        nameProperty: 'A3',
        encode: {

            name: 'A3',
            value: 'IPTPGAPS'
        }
    },,{
        id: 'IRS',
        name: 'IRS',
        type: 'map',
        mapType: "world",
        geoIndex: 0,
        coordinateSystem: 'geo',
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: false
            }
        },
        nameProperty: 'A3',
        encode: {

            name: 'A3',
            value: 'IRSGAPS'
        }
    },{
        id: 'bar',
        zlevel: 2,
        type: 'bar',
        symbol: 'none',
        itemStyle: {
            normal: {
                color: '#0262FF'
            }
        },
        data: []
    }]
}


