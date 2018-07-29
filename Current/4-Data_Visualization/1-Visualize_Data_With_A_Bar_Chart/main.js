window.addEventListener("DOMContentLoaded", function () {

    const h = 550;
    const w = 900;
    const padding = 60;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    xhr.send();
    xhr.onload = function () {
        var json = JSON.parse(xhr.responseText);
        console.log(json.data);
        createChart(json.data);
    }

    function createChart(data) {

        const svg = d3.select("main")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "customMt-5 customMb-5")
        .attr("id", "bar-chart-svg-js");

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d)=> {
                let dataString = d[0].split('-');
                dataString = dataString[0];
                return Number(dataString);
            })])
            .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
                        .domain([0, d3.max(data, (d)=> d[1])])
                        .range([h - padding, padding]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', 'translate(0, ' + (h - padding) + ')')
            .call(xAxis);

        svg.append("g")
            .attr('transform', 'translate(' + padding + ', 0)')
            .call(yAxis);

    }


}); //end of doc ready