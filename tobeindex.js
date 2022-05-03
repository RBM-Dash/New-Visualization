< !DOCTYPE html >
    <
    html >

    <
    head >
    <
    script src = "js/papaparse.min.js" > < /script> <
    script src = "js/lodash.min.js" > < /script> <
    link href = "css/jsgantt.css"
rel = "stylesheet"
type = "text/css" / >
    <
    script src = "js/jsgantt.js"
type = "text/javascript" > < /script>

<
/head>

<
body >
    <
    div style = "position:relative"
class = "gantt"
id = "GanttChartDIV" > < /div>

<
/body> <
script >
    var g = new JSGantt.GanttChart(document.getElementById('GanttChartDIV'), 'quarter');

function onlyUnique(value, index, self) { return self.indexOf(value) === index; }
Papa.parse("https://docs.google.com/spreadsheets/d/1XcWHgrDsILGbfgcXDEo8Dph5ypMUUOOF-iZjn-pshIQ//gviz/tq?tqx=out:csv&sheet=Master", {
    download: true,
    header: true,
    dynamicTyping: true,
    skipEmptyLines: 'greedy',
    complete: function(results) {
        //Erase records where cname is empty
        let result = _.reject(results.data, { 'cname': null });
        result = _.reject(result, { 'cname': "Country" });

        var countries = _.map(result, 'cname').filter(onlyUnique);
        countries = countries.sort();
        var temp;
        let myData = [];
        let tmp;
        let startDate;
        let cont = 1;
        let isOpen = 1;
        for (let i = 0; i < countries.length; i++) {
            temp = _.filter(result, ['cname', countries[i]]);
            let myD = [];
            let myldata = [];
            let myT = [];
            if (i > 2) { isOpen = 0 };
            //Define a group for the country
            let myPParent = cont;
            g.AddTaskItemObject({
                pID: myPParent,
                pName: countries[i],
                pStart: "",
                pEnd: "",
                pPlanStart: "",
                pPlanEnd: "",
                pClass: "gtaskblue",
                pLink: "",
                pMile: 0,
                pRes: "",
                pComp: 0,
                pGroup: 1,
                pParent: 0,
                pOpen: isOpen,
                pDepend: "",
                pCaption: "",
                pCost: 0,
                pNotes: "",
                pBarText: "",
                category: "",
                sector: ""
            });
            cont = cont + 1;
            for (let j = 0; j < temp.length; j++) {
                // Start filling the Gantt

                var currentTime = new Date();
                if (!(_.isEmpty(temp[j].StartYear))) {
                    startDate = new Date(temp[j].OSDate);
                    endDate = new Date(getFullYear(temp[j].OSDate), getMonth(temp[j].OSDate) + 2, 30);
                } else {
                    //Retrieve the Date from the quarter and year
                    if (!(_.isFinite(temp[j].StartYear))) { temp[j].StartYear = currentTime.getFullYear() };
                    if ((_.isFinite(temp[j].StartQuarter) & (temp[j].StartYear > (currentTime.getFullYear() - 1)))) {
                        endDate = new Date(temp[j].StartYear, (temp[j].StartQuarter * 3), 30);
                        startDate = new Date(temp[j].StartYear, (temp[j].StartQuarter * 3 - 2), 1);

                    }
                }
                //Fill in the Gantt structure
                //Define the class of the bar and the completation according to status
                switch (temp[j].Status) {
                    case "Completed":
                        myClass = "gtaskgreen";
                        myComp = 100;
                        break;
                    case "Ongoing":
                        myClass = "gtaskyellow";
                        myComp = 50;
                        break;
                    case "Requested":
                        myClass = "gtaskpink";
                        myComp = 0;
                        break;
                    case "Postponed":
                        myClass = "gtaskred";
                        myComp = 0;
                        break;
                    default:
                        myClass = "gtaskpurple";
                        myComp = 0;
                }

                g.AddTaskItemObject({
                    pID: cont,
                    pName: temp[j].Activity,
                    pStart: startDate,
                    pEnd: endDate,
                    pPlanStart: startDate,
                    pPlanEnd: endDate,
                    pClass: myClass,
                    pLink: "",
                    pMile: 0,
                    pRes: temp[j].Partner,
                    pComp: myComp,
                    pGroup: 0,
                    pParent: myPParent,
                    pOpen: isOpen,
                    pDepend: "",
                    pCaption: temp[j].Status,
                    pCost: 0,
                    pNotes: temp[j].Comments,
                    pBarText: "",
                    category: "",
                    sector: ""
                });
                cont = cont + 1;
            }
        }
        console.log(g)
        g.setUseFade(0);
        g.setUseSort(0);
        g.setShowDur(0);
        g.setShowComp(0);
        g.setShowEndDate(0);
        g.setShowTaskInfoDur(0);
        g.setShowTaskInfoComp(0);
        g.setShowTaskInfoEndDate(0);
        g.setShowSelector("Bottom");
        g.setAdditionalHeaders({ pCaption: { title: 'Status' } });
        g.setOptions({
            vCaptionType: 'Complete', // Set to Show Caption : None,Caption,Resource,Duration,Complete,     
            vQuarterColWidth: 36,
            vDateTaskDisplayFormat: 'month yyyy', // Shown in tool tip box
            vDayMajorDateDisplayFormat: 'mon yyyy - Week ww', // Set format to display dates in the "Major" header of the "Day" view
            vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view

            vShowTaskInfoLink: 0, // Show link in tool tip (0/1)
            vShowEndWeekDate: 0, // Show/Hide the date for the last day of the week in header for daily view (1/0)
            vUseSingleCell: 40000, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
            vFormatArr: ['Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
        });


        g.Draw();

    },

});


<
/script>

<
/html>