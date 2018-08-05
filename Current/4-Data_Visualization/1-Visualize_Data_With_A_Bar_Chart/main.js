window.addEventListener("DOMContentLoaded", function () {

    const h = 550;
    const w = 1000;
    const padding = 60;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    xhr.send();
    xhr.onload = function () {
        var json = JSON.parse(xhr.responseText);
        createChart(json.data);
    }

    function createChart(data) {

        // console.log(data);
        const barWidth = 5;
        const barPadding = 1;

        const svg = d3.select("main")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "customMt-5 customMb-5")
            .attr("id", "bar-chart-svg-js");

        const svgTitle = svg.append('text')
            .attr('id', 'svg-title')
            .attr('x', (w / 2))
            .attr('y', padding)
            .attr('text-anchor', 'middle')
            .text('United States GDP');

        const svgYAxisTitle = svg.append('text')
            .attr('id', 'svg-Y-Axis-Title')
            .attr('x', -230)
            .attr('y', (h / 7))
            .attr('text-anchor', 'start')
            .attr('transform', 'rotate(-90)')
            .text('Gross Domestic Product');


        let dataset = data;
        dataset = dataset.sort((a, b) => {
            return a + b;
        });

        // svg.selectAll('rect')
        //     .data(dataset)
        //     .enter()
        //     .append('rect')
        //     .attr('x', (d, i) => i * 6.5)
        //     .attr('y', (d, i) => h - d)
        //     .attr('width', barWidth)
        //     .attr('height', (d, i) => d[1])
        //     .attr('fill', 'navy')

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => {
                let dataString = d[0].split('-');
                dataString = dataString[0];
                return Number(dataString);
            })])
            .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d[1])])
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