<
!DOCTYPE html >
    <
    html >

    <
    head >
    <
    script src = "js/papaparse.min.js" > < /script> <
script src = "js/lodash.min.js" > < /script> <
script src = "js/echarts.min.js"
type = "text/javascript" > < /script> <
script src = "js/Utils.js"
type = "text/javascript" > < /script>

<
script src = "https://code.jquery.com/jquery-3.6.0.min.js"
integrity = "sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
crossorigin = "anonymous" > < /script> < /
head >

    <
    body >
    <
    title > GAPS < /title> <
div style = "position:relative"
class = "gantt"
id = "GanttChartDIV" > < /div> < /
body > <
    script >


    const masterSheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTw8oYQjlGERaqSIxTVy12iD5hh6ZXpSOhppwDjA4zkqk9WcDc5J5ne1lHnuRqbNjOU07fFxOFIdGQD/pub?output=csv";
Papa.parse(masterSheetURL, {

            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: 'greedy',
            complete: function(results) {
                    // Link to world geojson 
                    let uploadedDataURL = '/data/world-administrative-boundaries.geojson';
                    //Remove null countries
                    console.log(results)
                    results = _.reject(results.data, {
                        'Country': null
                    });
                    //Keep latest records for display. Oldest ones of no interest right now
                    let myKeyed = _.groupBy(results, 'Updated')
                    const updateDate = _.max(_.keys(myKeyed));
                    results = myKeyed[updateDate];
                    //console.log(results);
                    // Register Map
                    echarts.registerMap("world", worldJson, {
                        Ghana: {

                            left: -127,
                            top: 25,
                            width: 15,
                        }
                    });

                    let myKeys = _.pullAll(_.keys(results[0]), ['Country', 'ISO3', 'Updated', 'WHO_Region', 'Total_Financed_2021_2023', 'Total_GAP_2021_2023', 'Total_Needs_2021_2023']);

                    let allKeys = decoupleObject(results, myKeys);
                    console.log(allKeys);
                    //Create values for the info-boxes


                    let databyCat = _.groupBy(allKeys, 'category');
                    let allLLIN = _.values(databyCat["LLIN"]);

                    console.log(allLLIN)
                    console.log(databyCat)
                    var myChart = echarts.init(document.getElementById('GanttChartDIV'));
                    option = {
                        title: [{
                            text: "Global NSP Needs: " + sum1,
                            right: 320,
                            top: 20,
                            width: 100,
                            textStyle: {
                                color: "#000",
                                fontSize: 16,
                            },
                        }, {
                            text: "Global NSP GAPs: " + sum0,
                            right: 120,
                            top: 20,
                            width: 100,
                            textStyle: {
                                color: "#000",
                                fontSize: 16,
                            },
                        }, {
                            text: "Global NSP Financed: " + sum2,
                            right: 130,
                            top: 40,
                            width: 100,
                            textStyle: {
                                color: "#000",
                                fontSize: 16,
                            },
                        }],
                        tooltip: {
                            trigger: "item",
                        },
                        legend: {
                            orient: "vertical",
                            left: "left",
                            data: ["Needs", "GAPS", "Financed"],
                            selectedMode: "single",
                        },
                        visualMap: {
                            min: 0,
                            max: 3000000,
                            left: "center",
                            top: "bottom",
                            //text: ["高", "低"],
                            calculable: true,
                            colorLightness: [0.2, 100],
                            color: ["#ff0000", "#c05050", "#e5cf0d", "#5ab1ef"],
                            dimension: 0,
                        },
                        // toolbox: {
                        // 	show: true,
                        // 	orient: 'vertical',
                        // 	left: 'right',
                        // 	top: 'center',
                        // 	feature: {
                        // 		dataView: {
                        // 			readOnly: false,
                        // 		},
                        // 		restore: {},
                        // 		saveAsImage: {},
                        // 	},
                        // },
                        grid: {
                            right: 40,
                            top: 100,
                            bottom: 0,
                            width: "30%",
                        },
                        xAxis: [{
                            position: "top",
                            type: "value",
                            boundaryGap: false,
                            splitLine: {
                                show: false,
                            },
                            axisLine: {
                                show: false,
                            },
                            axisTick: {
                                show: false,
                            },
                        }, ],
                        yAxis: [{
                            type: "category",
                            data: titledata,
                            axisTick: {
                                alignWithLabel: true,
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {

                                    fontSize: 11,
                                },
                            },
                            data: yData,
                        }, ],
                        series: [{
                                z: 1,
                                name: "Needs",
                                type: "map",
                                map: "world",
                                left: "10",
                                right: "35%",
                                top: 1,
                                bottom: "25%",
                                zoom: 1,
                                label: {
                                    normal: {
                                        show: true,
                                    },
                                    emphasis: {
                                        show: true,
                                    },
                                },
                                //roam: true,
                                data: resultdata0,
                            }, {
                                z: 1,
                                name: "GAPS",
                                type: "map",
                                map: "world",
                                left: "10",
                                right: "35%",
                                top: 1,
                                bottom: "35%",
                                zoom: 0.75,
                                label: {
                                    normal: {
                                        show: true,
                                    },
                                    emphasis: {
                                        show: true,
                                    },
                                },
                                //roam: true,
                                data: resultdata1,
                            }, {
                                z: 1,
                                name: "Financed",
                                type: "map",
                                map: "world",
                                left: "10",
                                right: "35%",
                                top: 1,
                                bottom: "35%",
                                zoom: 0.75,
                                label: {
                                    normal: {
                                        show: true,
                                    },
                                    emphasis: {
                                        show: true,
                                    },
                                },
                                //roam: true,
                                data: resultdata2,
                            },

                            {
                                name: "Needs",
                                z: 2,
                                type: "bar",
                                label: {
                                    normal: {
                                        show: true,
                                        position: "right",
                                        fontSize: 10,
                                    },
                                    emphasis: {
                                        show: true,
                                    },
                                },
                                itemStyle: {
                                    emphasis: {
                                        color: "rgb(254,153,78)",
                                    },
                                },
                                barWidth: 5,
                                data: resultdata0,
                            }, {
                                name: "GAPS",
                                z: 2,
                                type: "bar",
                                label: {
                                    normal: {
                                        show: true,
                                        position: "right",
                                        fontSize: 10,
                                    },
                                    emphasis: {
                                        show: true,
                                    },
                                },
                                itemStyle: {
                                    emphasis: {
                                        color: "rgb(254,153,78)",
                                    },
                                },
                                barWidth: 5,
                                data: resultdata1,
                            }, {
                                name: "Financed",
                                z: 2,
                                type: "bar",
                                label: {
                                    normal: {
                                        show: true,
                                        position: "right",
                                        fontSize: 10,
                                    },
                                    emphasis: {
                                        show: true,
                                    },
                                },
                                itemStyle: {
                                    emphasis: {
                                        color: "rgb(254,153,78)",
                                    },
                                },
                                barWidth: 5,

                                data: resultdata2,
                            },

                        ],
                    };
                    myChart.setOption(option);

                    // Echarts Resize
                    window.addEventListener("resize", () => {
                        myChart.resize(); //resize 
                    });
                    myOptionMap(allLLIN, 'GanttChartDIV', uploadedDataURL);
                    //myChart.setOption(option);
                    //Create values for the info-boxes

                } <
                /script> < /
            html >