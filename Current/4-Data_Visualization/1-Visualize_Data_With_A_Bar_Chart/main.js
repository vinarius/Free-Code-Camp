window.addEventListener("DOMContentLoaded", function () {

    let h,
        w;
    const padding = 60,
        margin = {
            top: 23,
            right: 0,
            bottom: 0,
            left: 8
        },
        targetDiv = document.getElementById('barChart');

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    xhr.send();
    xhr.onload = function () {
        var json = JSON.parse(xhr.responseText);
        createChart(json.data);
    }

    function setDimensions(dom) {
        h = d3.select(dom).node().clientHeight;
        w = d3.select(dom).node().clientWidth;
    }

    function createChart(data) {
        setDimensions(targetDiv);
        const barWidth = 10;

        const svg = d3.select("#barChart")
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
            .domain([d3.min(data, (d) => {
                    let dataString = d[0].split('-');
                    return Number(dataString[0]);
                }),
                d3.max(data, (d) => {
                    let dataString = d[0].split('-');
                    return Number(dataString[0]);
                })
            ])
            .range([padding, w - padding]);

        const gdp = dataset.map((element) => {
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
                return xScale(Number(dataString[0]));
            })
            .attr('y', (d, i) => {
                return yScale(d[1])
            })
            .attr('width', barWidth)
            .attr('height', (d, i) => {
                return d[1];
            })
            .attr('fill', '#aaa')
            .attr('class', 'bar')
            .on('mousemove', (d) => {
                var e = event;
                d3.select('#barChartTooltip').remove();
                var tooltip = svg.append('g').attr('id', 'barChartTooltip');
                tooltip.append('rect')
                    .attr('fill', '#ddd')
                    .attr('height', '40')
                    .attr('width', '105')
                    .attr('x', (e.offsetX) + margin.left)
                    .attr('y', (e.offsetY) + margin.top)
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .style('opacity', '0.7');

                //year
                tooltip.append('text')
                    .attr('fill', '#000')
                    .attr('x', (e.offsetX) + margin.left + 2.5)
                    .attr('y', (e.offsetY) + margin.top + 20)
                    .attr('dy', '0em')
                    .text(() => {
                        return d[0];
                    });

                //gdp number
                tooltip.append('text')
                    .attr('fill', '#000')
                    .attr('x', (e.offsetX) + margin.left + 2.5)
                    .attr('y', (e.offsetY) + margin.top + 20)
                    .attr('dy', '1em')
                    .text(() => {
                        let temp = ``;
                        return d[1];
                    });
            });
    }


}); //end of doc ready