window.addEventListener("DOMContentLoaded", function () {

    let h,
        w,
        toolTipWidth = 105,
        toolTipHeight = 40,
        barWidth;

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

    function setDimensions(dom, data) {
        h = d3.select(dom).node().clientHeight;
        w = d3.select(dom).node().clientWidth;
        barWidth = w/data.length;
    }

    function createChart(data) {
        setDimensions(targetDiv, data);

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

        const xScale = d3.scaleLinear()
            .domain([0, dataset.length])
            .range([padding, w - padding]);

        const gdpMin = d3.min(dataset, (d) => {
            return d[1];
        });
        const gdpMax = d3.max(dataset, (d) => {
            return d[1];
        });

        const yScale = d3.scaleLinear()
            .domain([gdpMin, gdpMax])
            .range([(h - padding), padding]);

        const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));
        const yAxis = d3.axisLeft().scale(yScale);

        //xAxis
        svg.append('g')
        .attr('transform', 'translate(0, ' + (h - padding) + ')')
        .call(xAxis);

        //yAxis
        svg.append("g")
            .attr('transform', 'translate(' + padding + ', 0)')
            .call(yAxis);

        const dataBars = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', (d, i) => {
                let dataString = d[0].split('-');
                let delta = Number(dataString[0]);
                return xScale(i);
            })
            .attr('y', (d, i) => {
                return yScale(d[1]);
            })
            .attr('width', barWidth)
            .attr('height', (d, i) => {
                return (h - yScale(d[1])) - padding;
            })
            .attr('fill', '#aaa')
            .attr('class', 'bar')
            .on('mousemove', (d) => { //tooltip on mouseover
                var e = event;
                d3.select('#barChartTooltip').remove();
                var tooltip = svg.append('g').attr('id', 'barChartTooltip');
                tooltip.append('rect')
                    .attr('fill', '#ddd')
                    .attr('height', toolTipHeight)
                    .attr('width', toolTipWidth)
                    .attr('x', () => {
                        let val = (e.offsetX) + margin.left;
                        return val + (padding/2);
                    })
                    .attr('y', () => {
                        return h - (padding * 2);
                    })
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .style('opacity', '0.7');

                //year
                tooltip.append('text')
                    .attr('fill', '#000')
                    .attr('x', () => {
                        let val = (e.offsetX) + margin.left + 2.5;
                        return val + (padding/2);
                    })
                    .attr('y', () => {
                        return h - (padding * 2);
                    })
                    .attr('dy', '1em')
                    .text(() => {
                        return d[0];
                    });

                //gdp number
                tooltip.append('text')
                    .attr('fill', '#000')
                    .attr('x', () => {
                        let val = (e.offsetX) + margin.left + 2.5;
                        return val + (padding/2);
                    })
                    .attr('y', () => {
                        return h - (padding * 2);
                    })
                    .attr('dy', '2em')
                    .text(() => {
                        let temp = ``; //modifications here
                        return d[1];
                    });
            })
            .on('mouseout', (d) => {
                d3.select('#barChartTooltip').remove();
            });
    }


}); //end of doc ready