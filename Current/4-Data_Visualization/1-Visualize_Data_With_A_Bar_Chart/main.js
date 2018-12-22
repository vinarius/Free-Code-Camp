window.addEventListener("DOMContentLoaded", function () {

    function insertCommas(d){
        let temp = String(d);

        let delta = temp.split('.');
        let data = delta[0];
        //measure digits, insert comma after every three starting from length
        data = data.split('');
        let counter = 0;
        //construct new array
        let result = [];

        for(let i = data.length - 1; i >= 0; i--){
            if(counter % 3 === 0 && counter !== 0){
                result.unshift(',');
            }
            let digit = data[i];
            result.unshift(digit);
            counter++;
        }

        result = result.join('');
        result = result.split();
        result.push(delta[1]);
        result = result.join('.');

        return result;
    }

    let h,
        w,
        toolTipWidth = 123,
        toolTipHeight = 40,
        barWidth;

    const padding = 60,
        tooltipMargin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 5
        },
        margin = {
            top: 23,
            right: 0,
            bottom: 0,
            left: 15
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
            .attr('id', 'title')
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
        .attr('id', 'x-axis')
        .call(xAxis);

        //yAxis
        svg.append("g")
            .attr('transform', 'translate(' + padding + ', 0)')
            .attr('id', 'y-axis')
            .call(yAxis);

        const dataBars = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('stroke', '#fff')
            .attr('data-date', (d, i)=> {
                return d[0];
            })
            .attr('data-gdp', (d, i)=>{
                return d[1];
            })
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
                let data = d;
                d3.select('#tooltip').remove();
                var tooltip = svg.append('g').attr('id', 'tooltip')
                .attr('data-date', ()=>{
                    return data[0];
                });
                tooltip.append('rect')
                    .attr('fill', '#ddd')
                    .attr('height', toolTipHeight)
                    .attr('width', toolTipWidth)
                    .attr('x', () => {
                        let val = (e.offsetX) + margin.left;
                        if (val > (w - toolTipWidth)) {
                            return w - toolTipWidth;
                        } else {
                            return val;
                        }
                    })
                    .attr('y', () => {
                        let val = (e.offsetY) + margin.top;
                        if (val > (h - toolTipHeight)) {
                            return h - toolTipHeight;
                        } else {
                            return val;
                        }
                    })
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .style('opacity', '0.7');

                //year
                tooltip.append('text')
                    .attr('fill', '#000')
                    .attr('x', () => {
                        let val = (e.offsetX) + margin.left;
                        if (val > (w - toolTipWidth)) {
                            return w - toolTipWidth + tooltipMargin.left;
                        } else {
                            return val + tooltipMargin.left;
                        }
                    })
                    .attr('y', () => {
                        let val = (e.offsetY) + margin.top;
                        if (val > (h - toolTipHeight)) {
                            return h - toolTipHeight;
                        } else {
                            return val;
                        }
                    })
                    .attr('dy', '1em')
                    .text(() => {
                        let temp = d[0].split('-');
                        let split = temp[1].split('');
                        let quarter;
                        switch(split[1]){
                            case '1':
                            quarter = '1';
                            break;
                            case '4':
                            quarter = '2';
                            break;
                            case '7':
                            quarter = '3';
                            break;
                            case '0':
                            quarter = '4';
                            break;
                            default:
                            //do nothing
                            break;
                        }
                        let delta = `${temp[0]} Q${quarter}`;
                        return delta;
                    });

                //gdp number
                tooltip.append('text')
                    .attr('fill', '#000')
                    .attr('x', () => {
                        let val = (e.offsetX) + margin.left;
                        if (val > (w - toolTipWidth)) {
                            return w - toolTipWidth + tooltipMargin.left;
                        } else {
                            return val + tooltipMargin.left;
                        }
                    })
                    .attr('y', () => {
                        let val = (e.offsetY) + margin.top;
                        if (val > (h - toolTipHeight)) {
                            return h - toolTipHeight;
                        } else {
                            return val;
                        }
                    })
                    .attr('dy', '2em')
                    .text(() => {
                        let delta = insertCommas(d[1]);
                        let temp = `$${delta} Billion`;
                        return temp;
                    });
            })
            .on('mouseout', (d) => {
                d3.select('#tooltip').remove();
            });
    }


}); //end of doc ready