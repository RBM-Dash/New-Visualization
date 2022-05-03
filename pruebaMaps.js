< !DOCTYPE html >
    <
    html >

    <
    head >
    <
    script src = "js/papaparse.min.js" > < /script> <
script src = "js/lodash.min.js" > < /script> <
script src = "js/echarts.min.js"
type = "text/javascript" > < /script> < /
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
    function onlyUnique(value, index, self) {

        self.indexOf(value) === index;
    }

function decoupleObject(Objeto, toSplit) {
    // Loop over an object to split a given list of keys (toSplit) with complex names into several properties and adds them as new key/values pairs
    let Accumulator = [];
    let tocorrectKeys = [];
    let temp = [];
    let splittedM = [];
    tocorrectKeys = _.intersection(_.keys(Objeto[0]), toSplit);

    for (let i = 0; i < Objeto.length; i++) {
        for (let j = 0; j < tocorrectKeys.length; j++) {
            temp = _.pick(Objeto[i], ['Country', 'ISO3', 'WHO_Region', tocorrectKeys[j]]);
            splittedM = _.split(tocorrectKeys[j], '_', 6);
            temp.category = splittedM[0];
            temp.Year = parseFloat(splittedM[2]);
            temp[splittedM[1]] = (temp[tocorrectKeys[j]]);
            Accumulator = _.concat(Accumulator, temp);


        }

    }
    return Accumulator;
}

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
            fetch(uploadedDataURL)
                .then(function(response) {
                    //  JSON
                    return response.json();
                })
                .then(function(mapJson) {
                    echarts.registerMap('world', mapJson);
                });

            let myKeys = _.pullAll(_.keys(results[0]), ['Country', 'ISO3', 'Updated', 'WHO_Region', 'Total_Financed_2021_2023', 'Total_GAP_2021_2023', 'Total_Needs_2021_2023']);
            let allKeys = decoupleObject(results, myKeys);
            console.log(allKeys)
                //Create values for the info-boxes
            let databyCat = _.groupBy(allKeys, 'category');
            console.log(databyCat)
            var option = {
                dataset: allKeys
                visualMap: {
                    show: true,
                    map: world,
                    dimension: 2, // means the 3rd column
                    min: 2, // lower bound
                    max: 15000, // higher bound

                },
                xAxis: {},
                yAxis: {},
                series: { type: 'geo' }
            };

        }
    }) <
    /script>

<
/html>