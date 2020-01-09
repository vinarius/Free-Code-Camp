window.addEventListener('DOMContentLoaded', () => {

    let height = 0;
    let width = 0;

    const margin = {
        top: 100,
        right: 20,
        bottom: 40,
        left: 80
    };

    const tooltipInfo = {
        height: 75,
        width: 50,
        margin: 25,
        id: 'tooltip'
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const colorArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const colorTextArray = [
        '#343797', // 0
        '#4D76B6', // 1
        '#7CADD2', // 2
        '#B0D9EA', // 3
        '#E2F3F8', // 4
        '#FEFFBC', // 5
        '#FBDF8B', // 6
        '#F6AD5A', // 7
        '#EB6C3C', // 8
        '#CE2D1F', // 9
        '#9E0023' // 10
    ];
    const padding = 40;
    const heatMap = document.getElementById('heatMap');
    const jsonURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    const color = d3.scaleLinear()
        .domain(colorArray)
        .range(colorTextArray);

    let xhr = new XMLHttpRequest();
    xhr.open('GET', jsonURL);
    xhr.send();
    xhr.onload = function (d) {
        let json = JSON.parse(d.currentTarget.responseText);
        createHeatMap(json, heatMap);
    };

    function convertNumberToMonth(int) {
        switch (int) {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";
            default:
                return;
        }
    }

    function setDimensions(_parent) {
        let parent = _parent;
        height = parent.clientHeight - margin.top - margin.bottom;
        width = parent.clientWidth - margin.left - margin.right;
    }

    function createHeatMap(_data, _parent) {
        setDimensions(_parent);
        let data = JSON.parse(JSON.stringify(_data));

        data.monthlyVariance.forEach((element) => {
            element.month = element.month - 1;
            return element;
        });

        d3.select('#heatMap')
            .append('div')
            .attr('id', tooltipInfo.id)
            .style('opacity', '0.8')
            .style('display', 'none');

        const svg = d3.select(_parent)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        const xAxisGroup = svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${margin.left}, ${height + margin.top})`);

        const yAxisGroup = svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        const x = d3.scaleBand()
            .domain(data.monthlyVariance.map(variance => variance.year))
            .rangeRound([0, width]);

        const y = d3.scaleBand()
            .domain(months)
            .rangeRound([0, height]);

        const yAxisCall = d3.axisLeft(y)
            .tickSizeOuter(0);

        const xAxisCall = d3.axisBottom(x)
            .tickValues(x.domain().filter(year => year % 10 === 0))
            .tickSizeOuter(0);

        yAxisGroup.call(yAxisCall);
        xAxisGroup.call(xAxisCall);

        // Heading Title
        svg.append('text')
            .attr('id', 'title')
            .attr('x', () => {
                return width / 9;
            })
            .attr('text-anchor', 'center')
            .attr('y', () => {
                return padding;
            })
            .text('Monthly Global Land-Surface Temperature');

        // Heading Description
        svg.append('text')
            .attr('id', 'description')
            .attr('x', () => {
                return width / 9;
            })
            .attr('y', () => {
                return padding * 1.5;
            })
            .text('1753 - 2015: base temperature 8.66°C');

        // Legend
        const legendSize = {
            height: 55,
            width: 275
        };

        const lowestTemp = d3.min(data.monthlyVariance, function (d) {
            return data.baseTemperature + d.variance;
        });

        const highestTemp = d3.max(data.monthlyVariance, function (d) {
            return data.baseTemperature + d.variance;
        });

        const xAxisGroupLegend = svg.append('g')
            .attr('class', 'x-axis')
            .attr('id', 'legend')
            .attr('transform', `translate(${_parent.clientWidth - legendSize.width - 10}, ${legendSize.height / 1.15})`);

        const xLegend = d3.scaleLinear()
            .domain([lowestTemp, highestTemp])
            .range([0, legendSize.width]);

        const legendThreshold = d3.scaleThreshold()
            .domain((function (min, max, count) {
                const result = [];
                const step = (max - min) / count;
                for (let i = 1; i < count; i++) {
                    let tickMark = (min + step * i);
                    tickMark = tickMark.toFixed(2);
                    result.push(+tickMark);
                }
                return result;
            })(lowestTemp, highestTemp, colorArray.length))
            .range(colorTextArray);

        xAxisGroupLegend.call(
            d3.axisBottom(xLegend)
            .tickValues(legendThreshold.domain())
            .tickFormat(d3.format(".1f"))
            .tickSizeOuter(0)
        );

        xAxisGroupLegend.selectAll('rect')
            .data(colorTextArray.map((colorString) => {
                let d = legendThreshold.invertExtent(colorString);
                if (!d[0]) d[0] = lowestTemp;
                if (!d[1]) d[1] = highestTemp;
                return d;
            }))
            .enter()
            .append('rect')
            .attr('height', legendSize.height / 2)
            .attr('width', function (d) {
                return xLegend(d[1]) - xLegend(d[0]);
            })
            .attr('x', (d => xLegend(d[0])))
            .attr('y', (d) => {
                return -(legendSize.height / 2);
            })
            .style('fill', (d, i) => {
                return color(i);
            });

        // Heat Map Cells
        svg.selectAll('rect')
            .data(data.monthlyVariance)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('id', (d => `id-${d.year}-${d.month}`))
            .attr('x', (d => x(d.year)))
            .attr('y', (d) => {
                const month = convertNumberToMonth(d.month);
                return y(month);
            })
            .attr('data-month', (d => d.month))
            .attr('data-year', (d => d.year))
            .attr('data-temp', (d => d.variance))
            .attr('width', x.bandwidth())
            .attr('height', y.bandwidth())
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .style('fill', (d => legendThreshold(d.variance + data.baseTemperature)))
            .on('mouseover', (d) => {
                d3.select(`#id-${d.year}-${d.month}`)
                    .style('stroke-width', 1)
                    .style('stroke', '#000');

                d3.select(`#${tooltipInfo.id}`)
                    .style('display', 'block')
                    .style('left', ()=> {
                        const x = d3.event.pageX;
                        if((x + tooltipInfo.margin + tooltipInfo.width) > (window.innerWidth / 2)){
                            return `${(d3.event.pageX - tooltipInfo.margin - tooltipInfo.width)}px`;
                        }
                        return `${(d3.event.pageX + tooltipInfo.margin)}px`
                    })
                    .style('top', `${(d3.event.pageY - tooltipInfo.margin - tooltipInfo.height)}px`)
                    .attr('data-year', () => { return d.year})
                    .html(() => {
                        let newTemp = data.baseTemperature + d.variance;
                        newTemp = newTemp.toFixed(2);

                        const string =
                        `${d.year} - ${convertNumberToMonth(d.month)}<br>
                        ${newTemp}°C<br>
                        ${d.variance.toFixed(2)}°C`;

                        return string;
                    });
            })
            .on('mouseout', (d) => {
                d3.select(`#${tooltipInfo.id}`)
                    .style('display', 'none');

                d3.select(`#id-${d.year}-${d.month}`)
                    .style('stroke-width', 0)  
            });
    }
});