window.addEventListener("DOMContentLoaded", function () {

    const h = 550;
    const w = 900;
    const padding = 60;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    xhr.send();
    xhr.onload = function () {
        var json = JSON.parse(xhr.responseText);
        createChart(json.data);
    }

    function createChart(data) {

        const barWidth = 10;

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

        console.log(dataset);

        const xScale = d3.scaleLinear()
            .domain([d3.min(data, (d)=>{
                let dataString = d[0].split('-');
                dataString = dataString[0];
                return Number(dataString);
            }),
                d3.max(data, (d) => {
                let dataString = d[0].split('-');
                dataString = dataString[0];
                return Number(dataString);
            })])
            .range([padding, w - padding]);

        const gdp = dataset.map((element)=>{
            return element[1];
        });

        const gdpMin = d3.min(gdp);
        const gdpMax = d3.max(gdp);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d[1])])
            .range([h - padding, ((gdpMin / gdpMax) * h) + padding]);

        const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', 'translate(0, ' + (h - padding) + ')')
            .call(xAxis);

        svg.append("g")
            .attr('transform', 'translate(' + padding + ', 0)')
            .call(yAxis);

        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', (d, i) => {
                let dataString = d[0].split('-');
                dataString = dataString[0];
                return xScale(Number(dataString))})
            .attr('y', (d, i) => {return yScale(d[1])})
            .attr('width', barWidth)
            .attr('height', (d, i) => d[1])
            .attr('fill', '#aaa')
            .attr('class', 'bar')
            .on('mouseover', ()=>{
                overlay.transition().style('opacity', 0.8)
            })
            .append('title')
            .text((d) => {
                return d[0]
            });

    }


}); //end of doc ready